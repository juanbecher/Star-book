"use client";

import { useState, ReactNode } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./Collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  content: ReactNode;
  previewLines?: number;
  maxHeight?: string;
  defaultOpen?: boolean;
  className?: string;
}

const lineClampClasses: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

export function CollapsibleSection({
  title,
  content,
  previewLines = 6,
  maxHeight = "max-h-96",
  defaultOpen = false,
  className = "",
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const lineClampClass = lineClampClasses[previewLines] || lineClampClasses[6];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={cn("flex items-center justify-between mb-4", className)}>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <CollapsibleTrigger className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
          <span className="text-sm">{isOpen ? "Show less" : "Show more"}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200 ease-in-out",
              isOpen && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
      </div>

      {/* Preview when collapsed */}
      {!isOpen && (
        <div
          className={cn(
            "text-gray-300 transition-opacity duration-200 pr-2",
            lineClampClass
          )}
        >
          {content}
        </div>
      )}

      {/* Full content when expanded */}
      <CollapsibleContent className="transition-all duration-200 ease-in-out">
        <div className={cn("text-gray-300", maxHeight, "overflow-y-auto pr-2")}>
          {content}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
