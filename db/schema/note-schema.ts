import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export const note = sqliteTable("note", {
    id: integer("id").primaryKey(),
    title: text("title"),
    content: text("content"),
    userId: text("userId").references(() => user.id, { onDelete: "cascade" }),
    gridX: integer("grid_x").default(0),
    gridY: integer("grid_y").default(0),
    gridW: integer("grid_w").default(2),
    gridH: integer("grid_h").default(2),
    updated_at: text().default(sql`(CURRENT_TIME)`),
    created_at: text().default(sql`(CURRENT_DATE)`)
});