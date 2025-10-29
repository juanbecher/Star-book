import { useState } from "react";
import { trpc } from "../utils/trpc";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import type { SelectChangeEvent } from "@mui/material/Select";

interface BookStateSelectProps {
  bookId: string;
  initialValue?: string;
  size?: "small" | "medium";
  minWidth?: number;
  className?: string;
}

export const ReadingStatusSelect = ({
  bookId,
  initialValue = "",
  size = "small",
  minWidth = 160,
  className = "",
}: BookStateSelectProps) => {
  const [bookState, setBookState] = useState<string>(initialValue);
  const bookMutation = trpc.useMutation(["books.save-user-book"]);

  const handleStateChange = (event: SelectChangeEvent<string>) => {
    const newState = event.target.value;
    setBookState(newState);

    if (newState) {
      bookMutation.mutate({
        bookId: bookId,
        book_state: newState,
      });
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
          inputProps={{ "aria-label": "Select status" }}
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
