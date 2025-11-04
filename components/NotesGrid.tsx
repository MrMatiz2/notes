"use client";

import { useEffect, useRef, useState } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import { updateNotePosition } from "@/app/lib/notes-actions";

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

  if (!isClient) {
    return (
      <div className="notes-grid-loading">
        <p>Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="notes-grid-container">
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
            <div className="grid-stack-item-content note-card border border-white">
              <div className="note-header">
              <h3 className="note-title">{note.title || "Untitled"}</h3>
              <button
                onClick={() => onDelete(note.id)}
                className="delete-button"
                type="button"
              >
                ×
              </button>
              </div>
              <div className="note-content">
              <p>{note.content}</p>
              </div>
              <div className="note-footer">
              <small>Created: {note.created_at}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
