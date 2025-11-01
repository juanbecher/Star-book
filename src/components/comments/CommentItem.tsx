import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { Rating } from "../ui/Rating";
import { Trash2 } from "lucide-react";
import { User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../ui/Button";
import type { inferQueryOutput } from "../../utils/trpc";
import { Tile } from "../ui/Tile";

export type Comment =
  inferQueryOutput<"books">["getBookDetails"]["comments"][number];

interface CommentItemProps {
  comment: Comment;
  onDelete: () => void;
}

export const CommentItem = ({ comment, onDelete }: CommentItemProps) => {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteCommentMutation = trpc.books.deleteComment.useMutation();

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

  // @ts-ignore
  const isOwner = session?.user?.id === comment.userId;

  return (
    <Tile>
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
              <User className="w-8 h-8 text-gray-400" />
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
            variant="outline"
            size="icon"
          >
            <Trash2 className="w-4 h-4" />
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
    </Tile>
  );
};
