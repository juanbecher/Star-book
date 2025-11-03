import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReadingStatusSelect } from "../ReadingStatusSelect";
import { StarRating } from "../ui/StarRating";
import { BookFeatures } from "./BookFeatures";

const CARD_SIZE_MAP = {
  medium: {
    cardHeight: "h-[200px]",
    imageWidth: 120,
    imageHeight: 180,
    titleFontSize: "text-base",
    maxStars: 1,
  },
  large: {
    cardHeight: "h-[360px]",
    imageWidth: 180,
    imageHeight: 270,
    titleFontSize: "text-3xl",
    maxStars: 5,
  },
};

export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    description: string;
    categories: string[];
    pageCount: number;
    imageLinks: {
      thumbnail: string;
    };
    authors: string[];
    publisher: string;
    publishedDate: string;
    averageRating: number;
    ratingsCount: number;
  };
}

interface BookCardProps {
  book: Book;
  size: keyof typeof CARD_SIZE_MAP;
  showCategories?: boolean;
  showReadingStatus?: boolean;
  onClick?: () => void;
}

export const BookCard = ({
  book,
  size = "medium",
  showCategories,
  showReadingStatus,
  onClick,
}: BookCardProps) => {
  const router = useRouter();

  const { data: session } = useSession();

  return (
    <div
      className={`${CARD_SIZE_MAP[size].cardHeight} flex rounded-lg bg-card border border-border shadow-sm`}
    >
      {/* Left Side */}
      <div>
        <Image
          src={
            book.volumeInfo.imageLinks
              ? book.volumeInfo.imageLinks.thumbnail
              : "/imagen.png"
          }
          alt="Img description"
          width={CARD_SIZE_MAP[size].imageWidth}
          height={CARD_SIZE_MAP[size].imageHeight}
          className={cn(
            "rounded-lg object-cover w-full h-full",
            onClick && "cursor-pointer"
          )}
          onClick={onClick}
        />
      </div>
      {/* Right Side */}
      <div className="w-3/4 grid">
        <div className="grid gap-4 p-3">
          <div className="grid gap-2">
            {/* Title */}
            <h6
              className={cn(
                `m-0 ${CARD_SIZE_MAP[size].titleFontSize} font-semibold overflow-hidden text-ellipsis whitespace-nowrap hover:text-primary`,
                onClick && "cursor-pointer"
              )}
              onClick={onClick}
            >
              {book.volumeInfo.title}
            </h6>

            {/* Author */}
            <div className="flex items-center text-slate-400">
              <User className="text-primary mr-2 h-4 w-4" />
              <p className="text-sm">
                {book.volumeInfo.authors
                  ? book.volumeInfo.authors[0]
                  : "Unknown author"}
              </p>
            </div>

            {/* Publisher - publish date - pages*/}
            <BookFeatures
              publisher={book.volumeInfo.publisher}
              publishedDate={book.volumeInfo.publishedDate}
              pageCount={book.volumeInfo.pageCount}
            />
          </div>

          {/* Categories */}
          {showCategories && book.volumeInfo.categories?.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {book.volumeInfo.categories
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
          <StarRating
            value={book.volumeInfo.averageRating || 0}
            count={book.volumeInfo.ratingsCount || 0}
            maxStars={CARD_SIZE_MAP[size].maxStars}
            showLabel={true}
            readOnly
            size={size}
          />

          {/* Reading Status */}
          {showReadingStatus && (
            <div className="mb-6 flex">
              <ReadingStatusSelect
                bookId={book.id}
                size="medium"
                minWidth={200}
                disabled={!session}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
