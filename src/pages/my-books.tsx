import Layout from "../components/Layout";
import { trpc, inferQueryOutput } from "../utils/trpc";

type UserBook = inferQueryOutput<"books.get-user-books">[number];

const MyBooks = () => {
  const { data, isLoading, error } = trpc.useQuery(["books.get-user-books"]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-slate-400">Loading your books...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-red-400">Error loading books: {error.message}</p>
        </div>
      </Layout>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          <h2 className="text-2xl font-semibold text-slate-200 mb-4">
            Your Books
          </h2>
          <p className="text-slate-400">
            You haven&apos;t added any books yet.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <h2 className="text-2xl font-semibold text-slate-200 mb-6">
          Your Books ({data.length})
        </h2>
        <div className="space-y-4">
          {data.map((book: UserBook) => (
            <div
              key={book.id}
              className="bg-slate-800 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-slate-200 font-medium">{book.bookId}</p>
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-600 text-white text-sm capitalize">
                  {book.state}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MyBooks;
