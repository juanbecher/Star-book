import { useState } from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import Rating from "@mui/material/Rating";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { formatDistanceToNow } from "date-fns";
import Button from "./ui/Button";

interface Comment {
  id: string;
  content: string;
  rating: number | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentItemProps {
  comment: Comment;
  onDelete: () => void;
}

export const CommentItem = ({ comment, onDelete }: CommentItemProps) => {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteCommentMutation = trpc.useMutation(["books.delete-comment"]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setIsDeleting(true);
      try {
        await deleteCommentMutation.mutateAsync({ commentId: comment.id });
        onDelete();
      } catch (error) {
        console.error("Failed to delete comment:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const isOwner = session?.user?.id === comment.user.id;

  return (
    <div className="bg-stone-800 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            {comment.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={comment.user.image}
                alt={comment.user.name || "User"}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <PersonIcon className="text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {comment.user.name || "Anonymous"}
            </p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        {isOwner && (
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="outlined"
          >
            <DeleteIcon className="w-4 h-4" />
          </Button>
        )}
      </div>

      {comment.rating && (
        <div className="mb-2">
          <Rating
            value={comment.rating}
            readOnly
            size="small"
            precision={0.5}
          />
        </div>
      )}

      <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
    </div>
  );
};
