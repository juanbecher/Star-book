import { Book } from "../components/BookCard";
import { GOOGLE_BOOKS_API_URL, MAX_RESULTS } from "../constants/books";

export async function searchBooks(query: string): Promise<Book[]> {
  // Use server-side key if available (for SSR), otherwise use client-side key
  const apiKey =
    process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

  if (!apiKey) {
    throw new Error("Google Books API key is not configured");
  }

  const url = `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(
    query
  )}&maxResults=${MAX_RESULTS}&printType=books&orderBy=relevance&key=${apiKey}`;

  try {
    const response = await fetch(url, {
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch books: ${response.status} ${response.statusText}. ${
          errorData.error?.message || ""
        }`
      );
    }

    const data = await response.json();

    return data.items || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch books: Unknown error");
  }
}
