import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export const note = sqliteTable("note", {
    id: integer("id").primaryKey(),
    title: text("title"),
    content: text("content"),
    userId: text("userId").references(() => user.id, { onDelete: "cascade" }),
    updated_at: text().default(sql`(CURRENT_TIME)`),
    created_at: text().default(sql`(CURRENT_DATE)`)
});