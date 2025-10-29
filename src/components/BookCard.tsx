import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { trpc } from "../utils/trpc";
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

  const [bookState, setBookState] = useState<string>("");
  const bookMutation = trpc.useMutation(["books.save-user-book"]);

  const handleStateChange = (event: { target: { value: unknown } }) => {
    const newState = event.target.value as string;
    setBookState(newState);

    if (newState) {
      bookMutation.mutate({
        bookId: book.id,
        book_state: newState,
      });
    }
  };

  const handleCardClick = () => {
    router.push(`/book/${book.id}`);
  };

  return (
    <Card sx={{ height: 200, display: "flex" }}>
      <CardMedia
        component="img"
        image={
          book.volumeInfo.imageLinks
            ? book.volumeInfo.imageLinks.thumbnail
            : "/imagen.png"
        }
        alt="Img description"
        className="w-1/4 p-4 rounded-lg cursor-pointer"
        onClick={handleCardClick}
      />
      <div className="w-3/4 flex flex-col">
        <CardContent className="px-2 pt-2 pb-0">
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            className="m-0 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-amber-500"
            onClick={handleCardClick}
          >
            {book.volumeInfo.title}
          </Typography>

          {/* Author */}
          <p className="text-slate-400">
            by {book.volumeInfo.authors ? book.volumeInfo.authors[0] : ""}
          </p>

          {/* Publiser - publish date - pages*/}
          <div className="flex  mt-1 text-slate-300 text-xs">
            {book.volumeInfo.publisher && <p>{book.volumeInfo.publisher}</p>}
            {book.volumeInfo.publishedDate && (
              <p className="mx-1"> on {book.volumeInfo.publishedDate}</p>
            )}
            {book.volumeInfo.pageCount && (
              <p className="mx-1">, {book.volumeInfo.pageCount} pages</p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center my-1 text-xs text-slate-400">
            <Rating
              name="size-small"
              value={book.volumeInfo.averageRating}
              size="small"
              precision={0.5}
            />
            {book.volumeInfo.averageRating && (
              <p className="px-5">{book.volumeInfo.averageRating} avg rate</p>
            )}
            {book.volumeInfo.ratingsCount && (
              <p className="px-5">{book.volumeInfo.ratingsCount} votes</p>
            )}
          </div>
        </CardContent>
        <CardActions className=" mt-auto mb-1 px-1 py-0">
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              name={book.id}
              value={bookState}
              onChange={handleStateChange}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select status</em>
              </MenuItem>
              <MenuItem value={"wantToRead"}>Want to read</MenuItem>
              <MenuItem value={"reading"}>Reading</MenuItem>
              <MenuItem value={"read"}>Read</MenuItem>
            </Select>
          </FormControl>
        </CardActions>
      </div>
    </Card>
  );
};
