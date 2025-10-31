import { Book } from "../components/book-card/BookCard";
import { GOOGLE_BOOKS_API_URL, MAX_RESULTS } from "../constants/books";

export interface SearchBooksResponse {
  items: Book[];
  totalItems: number;
  hasMore: boolean;
}

export async function searchBooks(
  query: string,
  startIndex: number = 0
): Promise<SearchBooksResponse> {
  // Use server-side key if available (for SSR), otherwise use client-side key
  const apiKey = process.env.GOOGLE_API_KEY || "";

  if (!apiKey) {
    throw new Error("Google Books API key is not configured");
  }

  const url = `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(
    query
  )}&maxResults=${MAX_RESULTS}&startIndex=${startIndex}&printType=books&orderBy=relevance&key=${apiKey}`;

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
    const items = data.items || [];
    const totalItems = data.totalItems || 0;
    const hasMore = startIndex + items.length < totalItems;

    return {
      items,
      totalItems,
      hasMore,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch books: Unknown error");
  }
}
