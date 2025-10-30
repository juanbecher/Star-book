import { useState, useEffect } from "react";
import { trpc } from "../utils/trpc";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import type { SelectChangeEvent } from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";

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

  const handleStateChange = (event: SelectChangeEvent<string>) => {
    const newState = event.target.value;
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

  return (
    <div className={className}>
      <FormControl size={size} sx={{ minWidth }}>
        <Select
          name={bookId}
          value={bookState}
          onChange={handleStateChange}
          displayEmpty
          disabled={bookMutation.isLoading || disabled}
          inputProps={{ "aria-label": "Select status" }}
          endAdornment={
            bookMutation.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        >
          <MenuItem value="">
            <em>Reading Status</em>
          </MenuItem>
          <MenuItem value={"wantToRead"}>Want to read</MenuItem>
          <MenuItem value={"reading"}>Reading</MenuItem>
          <MenuItem value={"read"}>Read</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
