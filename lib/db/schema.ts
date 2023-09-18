import {
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    integer,
    pgEnum,
  } from "drizzle-orm/pg-core";
  

export const chats = pgTable("chats", {
    id: serial("id").primaryKey(),
    pdfName: text("pdf_name").notNull(),
    pdfUrl: text("pdf_url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    fileKey: text("file_key").notNull(),
  });

  export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);


//   Also need to store messages we will be sending
export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    // through chat id, one to many relationships. Link to chats above
    chatId: integer("chat_id")
      .references(() => chats.id)
      .notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    // if role is system, it means message is from GPT
    role: userSystemEnum("role").notNull(),
  });

//   Now with Drizzle Kit (utility package to create migrations and make sure all db is synced up with schema)