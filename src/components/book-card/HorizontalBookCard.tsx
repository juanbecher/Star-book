import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { trpc } from "../../utils/trpc";
import type { inferQueryOutput } from "../../utils/trpc";
import { Button } from "../ui/Button";
import { Tile } from "../ui/Tile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";

// Infer the type from tRPC query output
type UserBooksArray = inferQueryOutput<"books">["getUserBooks"];
type UserBook = UserBooksArray[number]; // Extract array element type

interface HorizontalBookCardProps {
  userBook: UserBook;
}

export const HorizontalBookCard = ({ userBook }: HorizontalBookCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const utils = trpc.useUtils();
  const removeBookMutation = trpc.books.removeUserBook.useMutation();

  const handleRemoveClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmRemove = async () => {
    setIsDeleting(true);
    try {
      await removeBookMutation.mutateAsync({
        userBookId: userBook.id,
      });
      // Invalidate and refetch user books
      utils.books.getUserBooks.invalidate();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to remove book:", error);
      // Keep dialog open on error so user can try again
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Tile className="p-4 flex gap-4 items-center">
      <div className="shrink-0">
        <Image
          src={userBook.book.imageUrl || "/imagen.png"}
          alt={userBook.book.title}
          width={60}
          height={90}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={`/book/${userBook.book.googleBooksId}`}
          className="text-slate-200 font-medium hover:text-amber-600 transition-colors"
        >
          {userBook.book.title}
        </Link>
        {userBook.book.subtitle && (
          <p className="text-slate-400 text-sm mt-1">
            {userBook.book.subtitle}
          </p>
        )}
        {userBook.book.authors && userBook.book.authors.length > 0 && (
          <p className="text-slate-500 text-sm mt-1">
            by {userBook.book.authors.join(", ")}
          </p>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-3">
        <Button
          onClick={handleRemoveClick}
          loading={isDeleting}
          disabled={isDeleting}
          variant="outline"
          size="icon"
          className="min-w-0 p-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove &quot;{userBook.book.title}&quot;
              from your books?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              loading={isDeleting}
              disabled={isDeleting}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tile>
  );
};
