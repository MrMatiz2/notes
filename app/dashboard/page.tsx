import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getNotesByUserId, createNote, deleteNote } from "@/app/lib/notes-actions";
import NotesGrid from "@/components/NotesGrid";
import SignOutButton from "@/components/SignOutButton";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome {session.user.name}
          </h1>
          <SignOutButton />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Create New Note
          </h2>
          <form action={handleCreateNote} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                placeholder="Enter note title"
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Content:
              </label>
              <textarea
                id="content"
                name="content"
                rows={4}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-vertical"
                placeholder="Enter note content"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Create Note
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Notes
          </h2>
          {notes.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No notes yet. Create your first note!
              </p>
            </div>
          ) : (
            <NotesGrid notes={notes} onDelete={handleDeleteNote} />
          )}
        </div>
      </div>
    </div>
  )
}