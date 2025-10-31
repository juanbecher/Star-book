import { CommentItem } from "./CommentItem";

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
      <div className="bg-stone-800 rounded-lg p-8 text-center">
        <p className="text-gray-400 text-lg">No comments yet</p>
        <p className="text-gray-500 text-sm mt-2">
          Be the first to share your thoughts about this book!
        </p>
      </div>
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
