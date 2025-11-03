import { BookOpen, Building2, Calendar, LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";

interface BookFeatureProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

const BookFeature = ({
  icon: Icon,
  label,
  className = "",
}: BookFeatureProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={`grid justify-items-start grid-cols-[auto_1fr] gap-2 overflow-hidden text-ellipsis whitespace-nowrap ${className}`}
        >
          <Icon className="text-primary h-4 w-4" />
          <p className="overflow-hidden text-ellipsis whitespace-nowrap">
            {label}
          </p>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const BookFeatures = ({
  publisher,
  publishedDate,
  pageCount,
}: {
  publisher?: string | null;
  publishedDate?: string | null;
  pageCount?: number | null;
}) => {
  return (
    <div className="grid grid-cols-3 justify-between mt-1 text-slate-300 text-xs">
      {publisher && (
        <BookFeature
          icon={Building2}
          label={publisher ? publisher : "Unknown publisher"}
        />
      )}
      {publishedDate && (
        <BookFeature
          icon={Calendar}
          label={publishedDate ? publishedDate : "Unknown published date"}
          className="mx-1"
        />
      )}
      {pageCount && (
        <BookFeature
          icon={BookOpen}
          label={`${pageCount} pages`}
          className="mx-1"
        />
      )}
    </div>
  );
};
