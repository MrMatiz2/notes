'use client';
import { useEffect, useRef, useState } from "react";
import { GridStack } from 'gridstack';
import MDEditor from '@uiw/react-md-editor';
import { createRoot } from 'react-dom/client';
import { updateNote as updateNoteAction } from '@/app/lib/notes-actions';

interface Note {
    id: number;
    title: string | null;
    content: string | null;
    userId: string | null;
    updated_at: string | null;
    created_at: string | null;
}

export default function NotesGrid({ notes }: { notes: Note[] }) {
    const gridRef = useRef<GridStack | null>(null);
    const [editableNotes, setEditableNotes] = useState<Note[]>(notes);
    const [tempValues, setTempValues] = useState<Record<number, string>>({});
    const editorRootsRef = useRef<Record<number, any>>({});
    const blurTimersRef = useRef<Record<number, NodeJS.Timeout>>({});

    // Update local state when props change
    useEffect(() => {
        setEditableNotes(notes);
        setTempValues({});
    }, [notes]);

    const handleContentChange = (noteId: number, newContent: string) => {
        setTempValues(prev => ({
            ...prev,
            [noteId]: newContent
        }));
    };

    const handleContentBlur = async (noteId: number) => {
        blurTimersRef.current[noteId] = setTimeout(async () => {
            // Get the current temp value
            const newContent = tempValues[noteId];
            if (newContent !== undefined) {
                // Update the actual note state
                setEditableNotes(prev =>
                    prev.map(note =>
                        note.id === noteId
                            ? { ...note, content: newContent }
                            : note
                    )
                );

                // Clear temp value
                setTempValues(prev => {
                    const newTemp = { ...prev };
                    delete newTemp[noteId];
                    return newTemp;
                });

                // Update in database (moved outside of setState)
                try {
                    await updateNoteAction(noteId, newContent);
                } catch (error) {
                    console.error('Failed to update note:', error);
                }
            }
        }, 200);
    };

    const handleContentFocus = (noteId: number) => {
        if (blurTimersRef.current[noteId]) {
            clearTimeout(blurTimersRef.current[noteId]);
            delete blurTimersRef.current[noteId];
        }
    };

    useEffect(() => {
        if (!gridRef.current) {
            gridRef.current = GridStack.init();
        }

        const grid = gridRef.current;

        // Clear existing widgets and editor references
        grid.removeAll();
        editorRootsRef.current = {};

        // Clear any pending timers
        Object.values(blurTimersRef.current).forEach(timer => clearTimeout(timer));
        blurTimersRef.current = {};

        // Add new widgets
        editableNotes.forEach((note) => {
            const widget = document.createElement('div');
            widget.className = 'grid-stack-item-content';

            // Create header
            const header = document.createElement('div');
            header.className = 'card-header';
            header.textContent = note.title || '';

            // Create content container for MDEditor
            const contentContainer = document.createElement('div');
            contentContainer.className = 'card-content';

            widget.appendChild(header);
            widget.appendChild(contentContainer);

            // Render MDEditor using ReactDOM
            if (note.content !== null) {
                const root = createRoot(contentContainer);
                editorRootsRef.current[note.id] = root;

                const currentValue = tempValues[note.id] ?? (note.content || '');
                root.render(
                    <MDEditor
                        value={currentValue}
                        onChange={(value) => handleContentChange(note.id, value || '')}
                        onBlur={() => handleContentBlur(note.id)}
                        onFocus={() => handleContentFocus(note.id)}
                        preview="edit"
                        hideToolbar={false}
                    />
                );
            }

            grid.makeWidget(widget);
        });

        // Cleanup function
        return () => {
            if (gridRef.current) {
                gridRef.current.removeAll();
            }
        };
    }, [editableNotes]);

    // Update individual editors when temp values change
    useEffect(() => {
        Object.keys(tempValues).forEach(noteIdStr => {
            const noteId = parseInt(noteIdStr);
            const editorRoot = editorRootsRef.current[noteId];
            const note = editableNotes.find(n => n.id === noteId);

            if (editorRoot && note) {
                const currentValue = tempValues[noteId] ?? (note.content || '');
                editorRoot.render(
                    <MDEditor
                        value={currentValue}
                        onChange={(value) => handleContentChange(noteId, value || '')}
                        onBlur={() => handleContentBlur(noteId)}
                        onFocus={() => handleContentFocus(noteId)}
                        preview="edit"
                        hideToolbar={false}
                    />
                );
            }
        });
    }, [tempValues]);

    return (
        <div className="App">
            <div className="grid-stack">
            </div>
        </div>
    );
}