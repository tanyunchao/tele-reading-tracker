"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { books, readingUpdates, type NewReadingUpdate } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function updateBookProgress(
  bookId: number,
  currentPage: number,
  summary?: string
) {
  try {
    // Get the current book data
    const [book] = await db.select().from(books).where(eq(books.id, bookId));

    if (!book) {
      throw new Error("Book not found");
    }

    // Begin a transaction to ensure data consistency
    await db.transaction(async (tx) => {
      // Create the reading update
      const newUpdate: NewReadingUpdate = {
        bookId,
        previousPage: book.currentPage ?? 0,
        currentPage,
        summary,
      };

      await tx.insert(readingUpdates).values(newUpdate);

      // Update the book's current page
      await tx
        .update(books)
        .set({
          currentPage,
          lastUpdated: new Date(),
        })
        .where(eq(books.id, bookId));
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update book progress:", error);
    return { success: false, error: "Failed to update book progress" };
  }
}

// Function to get recent reading activity
export async function getRecentReadingActivity(days: number = 7) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days);

  const updates = await db
    .select({
      date: readingUpdates.timestamp,
      pagesRead: sql<number>`current_page - previous_page`,
    })
    .from(readingUpdates)
    .where(sql`timestamp >= ${startDate}`)
    .orderBy(readingUpdates.timestamp);

  // Aggregate pages read by date
  const dailyReads = updates.reduce((acc, { date, pagesRead }) => {
    const dateKey = date!.toISOString().split("T")[0];
    acc[dateKey] = (acc[dateKey] || 0) + pagesRead;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(dailyReads).map(([date, pages]) => ({
    date,
    pagesRead: pages,
  }));
}

// Function to get book details with progress
export async function getBookWithProgress(bookId: number) {
  const [book] = await db.select().from(books).where(eq(books.id, bookId));

  if (!book) {
    throw new Error("Book not found");
  }

  const updates = await db
    .select()
    .from(readingUpdates)
    .where(eq(readingUpdates.bookId, bookId))
    .orderBy(readingUpdates.timestamp);

  return {
    ...book,
    updates,
  };
}
