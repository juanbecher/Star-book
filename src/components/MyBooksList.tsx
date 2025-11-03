import { useMemo } from "react";
import { trpc } from "../utils/trpc";
import { Loading } from "./ui/Loading";
import { HorizontalBookCard } from "./book-card/HorizontalBookCard";

const stateLabels: Record<string, string> = {
  wantToRead: "Want to Read",
  reading: "Currently Reading",
  read: "Read",
};

const stateOrder = ["wantToRead", "reading", "read"];

const MyBooksList = () => {
  const { data, isLoading, error } = trpc.books.getUserBooks.useQuery();

  // Group books by state
  const groupedBooks = useMemo(() => {
    if (!data) return {};

    return data.reduce((acc, book) => {
      const state = book.state || "other";
      if (!acc[state]) {
        acc[state] = [];
      }
      acc[state].push(book);
      return acc;
    }, {} as Record<string, typeof data>);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-red-400">Error loading books: {error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[200px]">
        <h2 className="text-2xl font-semibold text-slate-200 mb-4">
          Your Books
        </h2>
        <p className="text-slate-400">You haven&apos;t added any books yet.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="space-y-8">
        {stateOrder.map((state) => {
          const books = groupedBooks[state] || [];

          return (
            <div key={state}>
              <h3 className="text-xl font-semibold text-slate-300 mb-4">
                {stateLabels[state] || state} ({books.length})
              </h3>
              <div className="space-y-4">
                {books.map((book) => (
                  <HorizontalBookCard key={book.id} userBook={book} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBooksList;
