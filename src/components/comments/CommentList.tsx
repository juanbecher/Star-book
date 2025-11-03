import { Tile } from "../ui/Tile";
import { CommentItem } from "./CommentItem";
import type { Comment } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  onCommentDeleted: () => void;
}

export const CommentList = ({
  comments,
  onCommentDeleted,
}: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <Tile className="text-center">
        <p className="text-gray-400 text-lg">No comments yet</p>
        <p className="text-gray-500 text-sm mt-2">
          Be the first to share your thoughts about this book!
        </p>
      </Tile>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">
        Comments ({comments.length})
      </h3>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDelete={onCommentDeleted}
        />
      ))}
    </div>
  );
};
