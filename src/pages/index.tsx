import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import axios, { AxiosError } from "axios";
import React, { useCallback, useState } from "react";
import { Book, BookCard } from "../components/BookCard";
import Layout from "../components/Layout";

interface HomeProps {
  initialBooks: Book[];
}

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
const DEFAULT_SEARCH_QUERY = "harry potter";
const MAX_RESULTS = 20;

const Home: React.FC<HomeProps> = ({ initialBooks }) => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value.trim();

      if (!value) {
        setBooks(initialBooks);
        setSearchError(null);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
        const response = await axios.get<{ items: Book[] }>(
          `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(
            value
          )}&maxResults=${MAX_RESULTS}&printType=books&key=${apiKey}`,
          {
            headers: {
              "content-type": "application/json; charset=UTF-8",
            },
          }
        );

        setBooks(response.data.items || []);
      } catch (error) {
        const axiosError = error as AxiosError;
        setSearchError(
          axiosError.response?.status === 400
            ? "Invalid search query"
            : "Failed to search books. Please try again."
        );
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [initialBooks]
  );

  const inputStyle = { WebkitBoxShadow: "0 0 0 1000px #191919 inset" };

  const sortedBooks = [...books].sort(
    (a: Book, b: Book) =>
      (b.volumeInfo?.averageRating || 0) - (a.volumeInfo?.averageRating || 0)
  );

  return (
    <Layout>
      <div className="py-8">
        <div className="w-full max-w-md flex justify-center mx-auto mb-8">
          <TextField
            fullWidth
            id="book-search"
            label="Search book"
            variant="outlined"
            inputProps={{ style: inputStyle }}
            onChange={handleSearch}
            disabled={isSearching}
          />
        </div>

        {searchError && (
          <div className="text-center mb-6">
            <p className="text-red-400">{searchError}</p>
          </div>
        )}

        {isSearching ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <CircularProgress />
              <p className="text-slate-400">Searching...</p>
            </div>
          </div>
        ) : sortedBooks.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-slate-400">
              No books found. Try a different search.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {sortedBooks.map((book: Book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;

export async function getServerSideProps() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY || "";
    const response = await axios.get<{ items: Book[] }>(
      `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(
        DEFAULT_SEARCH_QUERY
      )}&maxResults=${MAX_RESULTS}&printType=books&key=${apiKey}`,
      {
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      }
    );

    return {
      props: {
        initialBooks: response.data.items || [],
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
