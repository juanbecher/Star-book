import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { Rating } from "../ui/Rating";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { Tile } from "../ui/Tile";
import { StarRating } from "../ui/StarRating";

interface CommentFormProps {
  bookId: string;
  onCommentAdded: () => void;
}

export const CommentForm = ({ bookId, onCommentAdded }: CommentFormProps) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCommentMutation = trpc.books.addComment.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await addCommentMutation.mutateAsync({
        bookId,
        content: content.trim(),
        rating: rating || undefined,
      });

      setContent("");
      setRating(null);
      onCommentAdded();
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <Tile>
        <p className="text-gray-400 text-center">
          Please sign in to leave a comment
        </p>
      </Tile>
    );
  }

  return (
    <Tile>
      <h3 className="text-lg font-semibold text-white mb-4">Leave a Comment</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rating (optional)
          </label>
          <StarRating
            value={rating || 0}
            onValueChange={setRating}
            size="medium"
            showLabel={false}
          />
        </div>

        <TextInput
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts about this book..."
          className="mb-4"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="outline"
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? "Commenting..." : "Comment"}
          </Button>
        </div>
      </form>
    </Tile>
  );
};
