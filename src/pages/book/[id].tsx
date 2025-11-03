import { BookCard } from "@/components/book-card/BookCard";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Tile } from "@/components/ui/Tile";
import { useRouter } from "next/router";
import { useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Layout from "../../components/Layout";
import { CommentForm } from "../../components/comments/CommentForm";
import { CommentList } from "../../components/comments/CommentList";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Loading } from "../../components/ui/Loading";
import { trpc } from "../../utils/trpc";

const Book = () => {
  const router = useRouter();
  const { id } = router.query;
  const [refreshComments, setRefreshComments] = useState(0);

  const {
    data: book,
    isLoading,
    error,
    refetch,
  } = trpc.books.getBookDetails.useQuery(
    { googleBooksId: id as string },
    {
      enabled: !!id,
    }
  );

  const handleCommentAdded = () => {
    setRefreshComments(refreshComments + 1);
    refetch();
  };

  const handleCommentDeleted = () => {
    setRefreshComments(refreshComments + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage message={error.message} />
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <ErrorMessage message="Book not found" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8 grid gap-8">
        {/* Book Header */}
        <BookCard
          book={{
            id: book.id,
            volumeInfo: {
              title: book.title,
              subtitle: book.subtitle || "",
              description: book.description || "",
              categories: book.categories,
              pageCount: book.pageCount || 0,
              imageLinks: book.imageUrl
                ? { thumbnail: book.imageUrl }
                : { thumbnail: "" },
              authors: book.authors,
              publisher: book.publisher || "",
              publishedDate: book.publishedDate || "",
              averageRating: book.averageRating || 0,
              ratingsCount: book.ratingsCount || 0,
            },
          }}
          size="large"
          showCategories={true}
          showReadingStatus={true}
        />

        {/* Description */}
        {book.description && (
          <Tile className="p-6">
            <CollapsibleSection
              title="Description"
              content={
                <Markdown rehypePlugins={[rehypeRaw]}>
                  {book.description}
                </Markdown>
              }
              previewLines={6}
            />
          </Tile>
        )}

        {/* Comments Section */}
        <div className="space-y-6">
          <CommentForm bookId={book.id} onCommentAdded={handleCommentAdded} />

          <CommentList
            comments={book.comments}
            onCommentDeleted={handleCommentDeleted}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Book;
