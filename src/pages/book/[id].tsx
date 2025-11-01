import { useRouter } from "next/router";
import Image from "next/image";
import { trpc } from "../../utils/trpc";
import Layout from "../../components/Layout";
import { CommentForm } from "../../components/comments/CommentForm";
import { CommentList } from "../../components/comments/CommentList";
import { Loading } from "../../components/ui/Loading";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { ReadingStatusSelect } from "../../components/ReadingStatusSelect";
import { Rating } from "../../components/ui/Rating";
import { Building2, Calendar, BookOpen, User, Tag, Star } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useSession } from "next-auth/react";
import { Tile } from "@/components/ui/Tile";

const Book = () => {
  const router = useRouter();
  const { id } = router.query;
  const [refreshComments, setRefreshComments] = useState(0);

  const { data: session } = useSession();

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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Book Header */}
        <Tile className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <Image
                src={book.imageUrl || "/imagen.png"}
                alt={book.title}
                width={192}
                height={288}
                className="w-48 h-72 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {book.title}
              </h1>
              {book.subtitle && (
                <h2 className="text-xl text-gray-300 mb-4">{book.subtitle}</h2>
              )}

              {/* Authors */}
              <div className="flex items-center mb-4">
                <User className="text-primary mr-2 h-5 w-5" />
                <div className="flex flex-wrap gap-2">
                  {book.authors.map((author: string, index: number) => (
                    <span
                      key={index}
                      className="text-gray-300 bg-card px-3 py-1 rounded-full text-sm"
                    >
                      {author}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {book.publisher && (
                  <div className="flex items-center text-gray-300">
                    <Building2 className="text-primary mr-2 h-4 w-4" />
                    <span className="text-sm">{book.publisher}</span>
                  </div>
                )}
                {book.publishedDate && (
                  <div className="flex items-center text-gray-300">
                    <Calendar className="text-primary mr-2 h-4 w-4" />
                    <span className="text-sm">{book.publishedDate}</span>
                  </div>
                )}
                {book.pageCount && (
                  <div className="flex items-center text-gray-300">
                    <BookOpen className="text-primary mr-2 h-4 w-4" />
                    <span className="text-sm">{book.pageCount} pages</span>
                  </div>
                )}
              </div>

              {/* Categories */}
              {book.categories.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <Tag className="text-primary mr-2 h-4 w-4" />
                    <span className="text-gray-300 font-medium">
                      Categories
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {book.categories
                      .slice(0, 3)
                      .map((category: string, index: number) => (
                        <span
                          key={index}
                          className="bg-primary text-black px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {category}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              {book.averageRating && (
                <div className="flex items-center mb-4">
                  <Rating
                    value={book.averageRating}
                    readOnly
                    precision={0.5}
                    size="large"
                    emptyIcon={<Star className="h-6 w-6 opacity-30" />}
                  />
                  <span className="ml-2 text-gray-300">
                    {book.averageRating} ({book.ratingsCount} ratings)
                  </span>
                </div>
              )}

              {/* Book State Select */}
              <div className="mb-6">
                <ReadingStatusSelect
                  bookId={book.id}
                  size="medium"
                  minWidth={200}
                  disabled={!session}
                />
              </div>
            </div>
          </div>
        </Tile>

        {/* Description */}
        {book.description && (
          <Tile className="p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Description
            </h3>

            <div className="text-gray-300 leading-relaxed">
              <Markdown rehypePlugins={[rehypeRaw]}>
                {book.description}
              </Markdown>
            </div>
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
