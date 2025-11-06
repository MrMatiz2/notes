"use server";

import { db } from "@/db";
import { note } from "@/db/schema/note-schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createNote(userId: string, title: string, content: string) {
  await db.insert(note).values({
    title,
    content,
    userId,
  });

  revalidatePath("/dashboard");
}

export async function getNotesByUserId(userId: string) {
  return await db.select().from(note).where(eq(note.userId, userId));
}

export async function updateNote(noteId: number, content: string) {
  await db.update(note).set({ content }).where(eq(note.id, noteId));
  revalidatePath("/dashboard");
}

export async function updateNotePosition(noteId: number, x: number, y: number, w: number, h: number) {
  await db.update(note).set({ gridX: x, gridY: y, gridW: w, gridH: h }).where(eq(note.id, noteId));
  revalidatePath("/dashboard");
}

export async function deleteNote(noteId: number) {
  await db.delete(note).where(eq(note.id, noteId));
  revalidatePath("/dashboard");
}

export async function toggleNoteBlur(noteId: number, blurred: boolean) {
  await db.update(note).set({ blurred }).where(eq(note.id, noteId));
  revalidatePath("/dashboard");
}