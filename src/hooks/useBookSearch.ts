import { useInfiniteQuery } from "@tanstack/react-query";
import { Book } from "../components/BookCard";
import { SearchBooksResponse } from "../utils/books";
import { MAX_RESULTS } from "../constants/books";

interface UseBookSearchReturn {
  books: Book[];
  isSearching: boolean;
  searchError: string | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function useBookSearch(
  query: string,
  initialBooks: Book[]
): UseBookSearchReturn {
  const trimmedQuery = query.trim();
  const shouldSearch = trimmedQuery.length > 0;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<SearchBooksResponse, Error>({
    queryKey: ["books", trimmedQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(
        `/api/books/search?q=${encodeURIComponent(
          trimmedQuery
        )}&startIndex=${pageParam}`
      );
      return await response.json();
    },
    enabled: shouldSearch,
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: SearchBooksResponse,
      allPages: SearchBooksResponse[]
    ) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length * MAX_RESULTS;
    },
  });

  // Flatten all pages into a single array of books
  const books = shouldSearch
    ? data?.pages.flatMap((page: SearchBooksResponse) => page.items) || []
    : initialBooks;

  // Determine error message
  console.log(error);
  const searchError = error
    ? "Failed to search books. Please try again."
    : null;

  return {
    books,
    isSearching: isLoading && shouldSearch,
    searchError,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
  };
}
