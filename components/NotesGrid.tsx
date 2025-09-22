'use client';
import { useEffect } from "react";
import { GridStack } from 'gridstack';

interface Note {
    id: number;
    title: string | null;
    content: string | null;
    userId: string | null;
    updated_at: string | null;
    created_at: string | null;
}

export default function NotesGrid({ notes }: { notes: Note[] }) {

    useEffect(() => {
        var grid = GridStack.init();
        /*
        [
            {
                id: 1,
                title: 'note title',
                content: 'note content',
                userId: 'kTlnx6R4fqV9taN1TAl8xB8GO0sNXtlv',
                updated_at: '22:40:24',
                created_at: '2025-09-21'
            }
        ]
        */
        notes.forEach((note, index) => {
            grid.addWidget({ content: note.content || ''});
        });
    }, [notes]);

    return (
        <div className="App">
            <div className="grid-stack">
                {/* <div className="grid-stack-item border-dark" data-gs-width="4" data-gs-height="4">
                    <div className="grid-stack-item-content">Item 1</div>
                </div>
                <div className="grid-stack-item border-dark" data-gs-width="4" data-gs-height="4">
                    <div className="grid-stack-item-content">Item 2</div>
                </div>
                <div className="grid-stack-item border-dark" data-gs-width="4" data-gs-height="4">
                    <div className="grid-stack-item-content">Item 3</div>
                </div> */}
            </div>
        </div>
    );
}