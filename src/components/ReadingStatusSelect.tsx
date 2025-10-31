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
  const utils = trpc.useContext();
  const bookMutation = trpc.useMutation(["books.save-user-book"]);

  const { data: userBookStatus } = trpc.useQuery([
    "books.get-user-book-status",
    { bookId },
  ]);

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
            utils.invalidateQueries(["books.get-user-books"]);
            utils.invalidateQueries(["books.get-user-book-status", { bookId }]);
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
        disabled={bookMutation.isLoading || disabled}
      >
        <SelectTrigger className={sizeClasses} aria-label="Select status">
          <SelectValue placeholder="Reading Status" />
          {bookMutation.isLoading && (
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
