import { useQuery } from "react-query";
import { Book } from "../components/BookCard";
import { searchBooks } from "../utils/books";

interface UseBookSearchReturn {
  books: Book[];
  isSearching: boolean;
  searchError: string | null;
}

export function useBookSearch(
  query: string,
  initialBooks: Book[]
): UseBookSearchReturn {
  const trimmedQuery = query.trim();
  const shouldSearch = trimmedQuery.length > 0;

  const { data, isLoading, error } = useQuery<Book[], Error>(
    ["books", trimmedQuery],
    () => searchBooks(trimmedQuery),
    {
      enabled: shouldSearch,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
      retry: 1,
      onError: (error) => {
        console.error("Search error:", error);
      },
    }
  );

  // Use initialBooks when query is empty, otherwise use fetched data
  const books = shouldSearch ? data || [] : initialBooks;

  // Determine error message
  const searchError = error
    ? "Failed to search books. Please try again."
    : null;

  return {
    books,
    isSearching: isLoading && shouldSearch,
    searchError,
  };
}
