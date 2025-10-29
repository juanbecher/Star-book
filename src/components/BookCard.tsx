import { useRouter } from "next/router";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import { ReadingStatusSelect } from "./ReadingStatusSelect";

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
    <div className="h-[200px] flex rounded-lg bg-stone-800 shadow-sm">
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
              className="m-0 text-base font-semibold overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-amber-500"
              onClick={handleCardClick}
            >
              {book.volumeInfo.title}
            </h6>

            {/* Author */}
            <div className="flex items-center text-slate-400">
              <PersonIcon className="text-amber-500 mr-2 text-sm" />
              <p className="text-sm">
                {book.volumeInfo.authors
                  ? book.volumeInfo.authors[0]
                  : "Unknown author"}
              </p>
            </div>

            {/* Publisher - publish date - pages*/}
            <div className="grid grid-cols-3 justify-between mt-1 text-slate-300 text-xs overflow-hidden text-ellipsis whitespace-nowrap">
              {book.volumeInfo.publisher && (
                <div className="flex items-center">
                  <BusinessIcon className="text-amber-500 mr-2 text-sm" />
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {book.volumeInfo.publisher
                      ? book.volumeInfo.publisher
                      : "Unknown publisher"}
                  </p>
                </div>
              )}
              {book.volumeInfo.publishedDate && (
                <div className="flex items-center mx-1">
                  <CalendarTodayIcon className="text-amber-500 mr-2 text-sm" />
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {book.volumeInfo.publishedDate
                      ? book.volumeInfo.publishedDate
                      : "Unknown published date"}
                  </p>
                </div>
              )}
              {book.volumeInfo.pageCount && (
                <div className="flex items-center mx-1">
                  <MenuBookIcon className="text-amber-500 mr-2 text-sm" />
                  <p>{book.volumeInfo.pageCount} pages</p>
                </div>
              )}
            </div>
            {/* Rating */}
            <div className="flex items-center my-1 text-xs text-slate-400">
              <Rating
                name="size-small"
                value={book.volumeInfo.averageRating}
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
        <div className="mt-auto mb-1 px-1 py-0">
          <div className="m-1 min-w-[120px]">
            <ReadingStatusSelect bookId={book.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
