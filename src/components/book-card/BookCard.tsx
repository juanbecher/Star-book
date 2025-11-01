import { Building2, Calendar, BookOpen, User } from "lucide-react";
import { Rating } from "../ui/Rating";
import Image from "next/image";
import { useRouter } from "next/router";

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

export const BookCard = ({ book }: { book: Book }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/book/${book.id}`);
  };

  return (
    <div className="h-[200px] flex rounded-lg bg-card border border-border shadow-sm">
      <div className="p-2 m-auto">
        <Image
          src={
            book.volumeInfo.imageLinks
              ? book.volumeInfo.imageLinks.thumbnail
              : "/imagen.png"
          }
          alt="Img description"
          width={120}
          height={180}
          className="rounded-lg cursor-pointer object-cover w-full h-full"
          onClick={handleCardClick}
        />
      </div>
      <div className="w-3/4 flex flex-col">
        <div className="px-2 pt-2 pb-0">
          <div className="grid gap-2">
            <h6
              className="m-0 text-base font-semibold overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-primary"
              onClick={handleCardClick}
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
            <div className="grid grid-cols-3 justify-between mt-1 text-slate-300 text-xs overflow-hidden text-ellipsis whitespace-nowrap">
              {book.volumeInfo.publisher && (
                <div className="grid items-center grid-cols-[auto_1fr]">
                  <Building2 className="text-primary mr-2 h-4 w-4" />
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {book.volumeInfo.publisher
                      ? book.volumeInfo.publisher
                      : "Unknown publisher"}
                  </p>
                </div>
              )}
              {book.volumeInfo.publishedDate && (
                <div className="grid items-center grid-cols-[auto_1fr] mx-1">
                  <Calendar className="text-primary mr-2 h-4 w-4" />
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {book.volumeInfo.publishedDate
                      ? book.volumeInfo.publishedDate
                      : "Unknown published date"}
                  </p>
                </div>
              )}
              {book.volumeInfo.pageCount && (
                <div className="grid items-center grid-cols-[auto_1fr] mx-1">
                  <BookOpen className="text-primary mr-2 h-4 w-4" />
                  <p>{book.volumeInfo.pageCount} pages</p>
                </div>
              )}
            </div>
            {/* Rating */}
            <div className="flex items-center my-1 text-xs text-slate-400">
              <Rating
                value={book.volumeInfo.averageRating || 0}
                size="small"
                precision={0.5}
                readOnly
              />
              {book.volumeInfo.averageRating && (
                <p className="px-5">{book.volumeInfo.averageRating} avg rate</p>
              )}
              {book.volumeInfo.ratingsCount && (
                <p className="px-5">{book.volumeInfo.ratingsCount} votes</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
