import React, { useState } from "react";
import { Book, BookCard } from "../components/BookCard";
import Layout from "../components/Layout";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loading } from "../components/Loading";
import { TextInput } from "../components/TextInput";
import { InfiniteScroll } from "../components/InfiniteScroll";
import { useBookSearch } from "../hooks/useBookSearch";
import { useDebounce } from "../hooks/useDebounce";
import { DEFAULT_SEARCH_QUERY } from "../constants/books";

interface HomeProps {
  initialBooks: Book[];
}

const Home = ({ initialBooks }: HomeProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    books,
    isSearching,
    searchError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookSearch(debouncedSearchQuery, initialBooks);

  const sortedBooks = [...books].sort(
    (a: Book, b: Book) =>
      (b.volumeInfo?.averageRating || 0) - (a.volumeInfo?.averageRating || 0)
  );

  return (
    <Layout>
      <div className="py-8">
        <div className="w-full max-w-md flex justify-center mx-auto mb-8">
          <TextInput
            id="book-search"
            label="Search book"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchError && <ErrorMessage message={searchError} />}

        {isSearching ? (
          <Loading />
        ) : sortedBooks.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-slate-400">
              No books found. Try a different search.
            </p>
          </div>
        ) : (
          <InfiniteScroll
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={fetchNextPage}
            loadingComponent={<Loading />}
            endMessage={
              sortedBooks.length > 0 ? (
                <p className="text-slate-400 text-sm">No more books to load</p>
              ) : null
            }
            threshold={0.1}
          >
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {sortedBooks.map((book: Book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </Layout>
  );
};

export default Home;

export async function getServerSideProps() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/books/search?q=${encodeURIComponent(
        DEFAULT_SEARCH_QUERY
      )}`
    );

    const result = await response.json();
    const initialBooks = result.items || [];

    return {
      props: {
        initialBooks,
      },
    };
  } catch (error) {
    console.error("Error fetching initial books:", error);
    return {
      props: {
        initialBooks: [],
      },
    };
  }
}
