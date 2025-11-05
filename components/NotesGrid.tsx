"use client";

import { useEffect, useRef, useState } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import { updateNotePosition, updateNote } from "@/app/lib/notes-actions";

interface Note {
  id: number;
  title: string | null;
  content: string | null;
  userId: string | null;
  gridX: number | null;
  gridY: number | null;
  gridW: number | null;
  gridH: number | null;
  updated_at: string | null;
  created_at: string | null;
}

interface NotesGridProps {
  notes: Note[];
  onDelete: (noteId: number) => void;
}

export default function NotesGrid({ notes, onDelete }: NotesGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInstanceRef = useRef<GridStack | null>(null);
  const [isClient, setIsClient] = useState(false);
  const prevNotesRef = useRef<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize GridStack once
  useEffect(() => {
    if (!isClient || !gridRef.current) return;

    const grid = GridStack.init({
      cellHeight: 100,
      margin: 10,
      float: true,
      acceptWidgets: true,
      resizable: {
        handles: "se, sw"
      },
      draggable: {
        handle: ".note-header"
      }
    }, gridRef.current);

    gridInstanceRef.current = grid;

    // Handle position change
    grid.on("change", (event, items) => {
      if (!items) return;

      items.forEach((item) => {
        const noteId = parseInt(item.el?.getAttribute("data-note-id") || "0");
        if (noteId && item.x !== undefined && item.y !== undefined && item.w !== undefined && item.h !== undefined) {
          //updateNotePosition(noteId, item.x, item.y, item.w, item.h);
        }
      });
    });

    return () => {
      if (gridInstanceRef.current) {
        gridInstanceRef.current.destroy(false);
      }
    };
  }, [isClient]);

  // Update grid items when notes change
  useEffect(() => {
    if (!gridInstanceRef.current || !isClient) return;

    const grid = gridInstanceRef.current;
    const prevNotes = prevNotesRef.current;

    // Find new notes
    const newNotes = notes.filter(note =>
      !prevNotes.some(prevNote => prevNote.id === note.id)
    );

    // Find deleted notes
    const deletedNoteIds = prevNotes
      .filter(prevNote => !notes.some(note => note.id === prevNote.id))
      .map(note => note.id);

    // Remove deleted items from grid
    deletedNoteIds.forEach(noteId => {
      const element = gridRef.current?.querySelector(`[data-note-id="${noteId}"]`);
      if (element) {
        grid.removeWidget(element as HTMLElement);
      }
    });

    // Add new items to grid
    newNotes.forEach(note => {
      const element = gridRef.current?.querySelector(`[data-note-id="${note.id}"]`);
      if (element) {
        grid.makeWidget(element as HTMLElement);
      }
    });

    prevNotesRef.current = notes;
  }, [notes, isClient]);

  const handleEditClick = (note: Note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content || "");
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (noteId: number) => {
    await updateNote(noteId, editContent);
    setEditingNoteId(null);
    setEditContent("");
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600 dark:text-gray-400">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={gridRef} className="grid-stack">
        {notes.map((note) => (
          <div
            key={note.id}
            className="grid-stack-item"
            data-note-id={note.id}
            gs-x={note.gridX ?? 0}
            gs-y={note.gridY ?? 0}
            gs-w={note.gridW ?? 2}
            gs-h={note.gridH ?? 2}
          >
            <div className="grid-stack-item-content bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
              <div className="note-header bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between cursor-move">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {note.title || "Untitled"}
                </h3>
                <div className="flex items-center gap-2">
                  {editingNoteId !== note.id && (
                    <button
                      onClick={() => handleEditClick(note)}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      type="button"
                      title="Edit note"
                    >
                      ✎
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(note.id)}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-xl leading-none"
                    type="button"
                    title="Delete note"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                {editingNoteId === note.id ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                    {note.content}
                  </p>
                )}
              </div>
              {editingNoteId === note.id ? (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-600 flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(note.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    type="button"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                  <small className="text-xs text-gray-500 dark:text-gray-400">
                    Created: {note.created_at}
                  </small>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
