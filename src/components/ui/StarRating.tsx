import { Rating, RatingButton, RatingProps } from "./Rating";

const sizeMap = {
  medium: 20,
  large: 26,
};

interface StarRatingProps {
  value: number;
  readOnly?: boolean;
  size?: keyof typeof sizeMap;
  maxStars?: number;
  className?: string;
  count?: number;
  showLabel?: boolean;
  onChange?: RatingProps["onChange"];
  onValueChange?: RatingProps["onValueChange"];
}

export const StarRating = ({
  value,
  readOnly = false,
  size = "medium",
  maxStars = 5,
  className,
  count,
  onChange,
  onValueChange,
  showLabel = true,
}: StarRatingProps) => {
  return (
    <div className="flex items-center gap-2 my-1 text-xs text-slate-400">
      <Rating
        defaultValue={value}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        onValueChange={onValueChange}
        className={className}
      >
        {Array.from({ length: maxStars }).map((_, index) => (
          <RatingButton
            key={index}
            size={sizeMap[size]}
            className="text-primary"
          />
        ))}
      </Rating>
      {showLabel && (
        <>
          <p>{value}</p>
          <p>({count})</p>
        </>
      )}
    </div>
  );
};
