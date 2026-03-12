'use client';

export const AlarmItemSkeleton = () => {
  return (
    <div className="border-b border-gray-200 p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
};
