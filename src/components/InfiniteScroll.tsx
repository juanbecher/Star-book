import React, { useEffect, useRef, ReactNode } from "react";

interface InfiniteScrollProps {
  children: ReactNode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  loadingComponent?: ReactNode;
  endMessage?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export const InfiniteScroll = ({
  children,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  loadingComponent,
  endMessage,
  threshold = 0.1,
  rootMargin = "0px",
  className = "",
}: InfiniteScrollProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore, threshold, rootMargin]);

  return (
    <>
      {children}
      <div
        ref={observerTarget}
        className={`h-10 flex justify-center items-center mt-8 ${className}`}
      >
        {isFetchingNextPage && loadingComponent}
        {!hasNextPage && endMessage}
      </div>
    </>
  );
};
