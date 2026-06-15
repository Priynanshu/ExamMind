import { cn } from "../../utils/cn";

// Base skeleton shimmer component
const Skeleton = ({ className, ...props }) => (
  <div
    className={cn("animate-pulse rounded-md", className)}
    style={{ backgroundColor: "var(--bg-card-hover)" }}
    {...props}
  />
);

// Chat message skeleton
const ChatSkeleton = () => (
  <div className="flex gap-3 p-4">
    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

// Session card skeleton
const SessionCardSkeleton = () => (
  <div className="card p-4 space-y-3">
    <div className="flex items-start justify-between">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-3 w-1/3" />
    <div className="flex gap-2">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  </div>
);

// Progress stats skeleton
const ProgressSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="card p-4 space-y-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
);

export { Skeleton, ChatSkeleton, SessionCardSkeleton, ProgressSkeleton };
