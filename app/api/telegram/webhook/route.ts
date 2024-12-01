
import { NextResponse } from "next/server";
import { db } from "@/db";
import { books } from "@/db/schema";

interface TelegramMessage {
  chat: { id: number };
  text?: string;
  from: { id: number; username?: string };
}

async function handleCommands(message: TelegramMessage) {
  const { text, chat } = message;

  switch (text) {
    case "/start":
      await sendTelegramMessage(
        chat.id,
        "Welcome to your Reading Tracker! Here are the available commands:\n\n" +
          "/books - List your current books\n" +
          "/update <book_id> <page> [summary] - Update your reading progress\n" +
          "/stats - View your reading statistics\n" +
          "/help - Show this help message"
      );
      break;

    case "/books":
      const userBooks = await db.select().from(books);
      const bookList = userBooks
        .map(
          (book) =>
            `📚 ${book.title} by ${book.author}\n` +
            `ID: ${book.id} | Progress: ${book.currentPage}/${book.totalPages} pages`
        )
        .join("\n\n");

      await sendTelegramMessage(
        chat.id,
        bookList || "No books found. Use /addbook to add your first book!"
      );
      break;

    case "/help":
      await sendTelegramMessage(
        chat.id,
        "Reading Tracker Help:\n\n" +
          "📖 Basic Commands:\n" +
          "/books - View your book list\n" +
          "/update <book_id> <page> [summary] - Update progress\n" +
          "/stats - View reading statistics\n\n" +
          "📚 Book Management:\n" +
          "/addbook - Add a new book\n" +
          "/removebook <book_id> - Remove a book\n\n" +
          "📊 Statistics:\n" +
          "/streak - View your reading streak\n" +
          "/summary <book_id> - View your reading summaries\n\n" +
          "Example:\n" +
          "/update 1 50 Really enjoying the character development!"
      );
      break;

    // Add more command handlers as needed
  }
}
