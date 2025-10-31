import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  value: number;
  onChange?: (value: number | null) => void;
  readOnly?: boolean;
  precision?: number;
  size?: "small" | "medium" | "large";
  className?: string;
  emptyIcon?: React.ReactNode;
}

const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  readOnly = false,
  precision = 1,
  size = "medium",
  className,
  emptyIcon,
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const [isHovering, setIsHovering] = React.useState(false);

  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6",
  };

  const displayValue =
    isHovering && hoverValue !== null ? hoverValue : value || 0;

  const handleClick = (newValue: number) => {
    if (readOnly || !onChange) return;
    onChange(newValue === value ? null : newValue);
  };

  const handleMouseEnter = (newValue: number) => {
    if (readOnly) return;
    setIsHovering(true);
    setHoverValue(newValue);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setIsHovering(false);
    setHoverValue(null);
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const filled = displayValue >= starValue;
    const halfFilled =
      displayValue >= index && displayValue < starValue && precision === 0.5;

    return (
      <span
        key={index}
        className={cn(
          "inline-block cursor-pointer transition-colors",
          readOnly && "cursor-default",
          sizeClasses[size]
        )}
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        role={readOnly ? undefined : "button"}
        tabIndex={readOnly ? -1 : 0}
        onKeyDown={(e) => {
          if (readOnly) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(starValue);
          }
        }}
      >
        {filled ? (
          <Star
            className={cn(sizeClasses[size], "fill-amber-500 text-amber-500")}
          />
        ) : halfFilled ? (
          <div className="relative">
            <Star
              className={cn(sizeClasses[size], "fill-gray-400 text-gray-400")}
            />
            <Star
              className={cn(
                sizeClasses[size],
                "absolute left-0 top-0 fill-amber-500 text-amber-500",
                "overflow-hidden w-1/2"
              )}
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        ) : emptyIcon ? (
          emptyIcon
        ) : (
          <Star
            className={cn(
              sizeClasses[size],
              "fill-gray-400 text-gray-400 opacity-30"
            )}
          />
        )}
      </span>
    );
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
    </div>
  );
};

export { Rating };
