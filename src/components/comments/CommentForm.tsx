import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { Rating } from "../ui/Rating";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";

interface CommentFormProps {
  bookId: string;
  onCommentAdded: () => void;
}

export const CommentForm = ({ bookId, onCommentAdded }: CommentFormProps) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCommentMutation = trpc.useMutation(["books.add-comment"]);

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
      <div className="bg-stone-800 rounded-lg p-4 mb-6">
        <p className="text-gray-400 text-center">
          Please sign in to leave a comment
        </p>
      </div>
    );
  }

  return (
    <div className="bg-stone-800 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Leave a Comment</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rating (optional)
          </label>
          <Rating
            value={rating || 0}
            onChange={(newValue) => setRating(newValue)}
            size="large"
            precision={0.5}
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
            variant="ghost"
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>
    </div>
  );
};
