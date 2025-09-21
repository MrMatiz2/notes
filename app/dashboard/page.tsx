import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getNotesByUserId, createNote, deleteNote } from "@/app/lib/notes-actions";

async function handleCreateNote(formData: FormData) {
  "use server";

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) return;

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (title && content) {
    await createNote(session.user.id, title, content);
  }
}

async function handleDeleteNote(noteId: number) {
  "use server";
  await deleteNote(noteId);
}

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/signin")
  }

  const notes = await getNotesByUserId(session.user.id);

  return (
    <div>
      <h1>Welcome {session.user.name}</h1>

      <h2>Create New Note</h2>
      <form action={handleCreateNote}>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea id="content" name="content" rows={4} required></textarea>
        </div>
        <button type="submit">Create Note</button>
      </form>

      <h2>Your Notes</h2>
      {notes.length === 0 ? (
        <p>No notes yet. Create your first note!</p>
      ) : (
        <div>
          {notes.map((note) => (
            <div key={note.id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <small>Created: {note.created_at}</small>
              <form action={handleDeleteNote.bind(null, note.id)} style={{ display: "inline", marginLeft: "10px" }}>
                <button type="submit">Delete</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}