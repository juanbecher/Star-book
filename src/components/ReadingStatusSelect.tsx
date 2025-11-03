import { useState, useEffect } from "react";
import { trpc } from "../utils/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Loader2 } from "lucide-react";

interface BookStateSelectProps {
  bookId: string;
  size?: "small" | "medium";
  minWidth?: number;
  className?: string;
  disabled?: boolean;
}

export const ReadingStatusSelect = ({
  bookId,
  size = "small",
  minWidth = 160,
  className = "",
  disabled = false,
}: BookStateSelectProps) => {
  const [bookState, setBookState] = useState<string>("");
  const utils = trpc.useUtils();
  const bookMutation = trpc.books.saveUserBook.useMutation();

  const { data: userBookStatus } = trpc.books.getUserBookStatus.useQuery({
    bookId,
  });

  useEffect(() => {
    if (userBookStatus?.state) {
      setBookState(userBookStatus.state);
    }
  }, [userBookStatus]);

  const handleStateChange = (value: string) => {
    const newState = value;
    setBookState(newState);

    if (newState) {
      bookMutation.mutate(
        {
          bookId: bookId,
          book_state: newState,
        },
        {
          onSuccess: () => {
            utils.books.getUserBooks.invalidate();
            utils.books.getUserBookStatus.invalidate({ bookId });
          },
        }
      );
    }
  };

  const sizeClasses = size === "small" ? "h-9" : "h-10";

  return (
    <div className={className} style={{ minWidth }}>
      <Select
        value={bookState || undefined}
        onValueChange={handleStateChange}
        disabled={bookMutation.isPending || disabled}
      >
        <SelectTrigger className={sizeClasses} aria-label="Select status">
          <SelectValue placeholder="Add to my list" />
          {bookMutation.isPending && (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="wantToRead">Want to read</SelectItem>
          <SelectItem value="reading">Reading</SelectItem>
          <SelectItem value="read">Read</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
