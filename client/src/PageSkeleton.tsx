import React from 'react';

// Kept in its own tiny file: it is the Suspense fallback for lazy-loaded pages,
// so it must not live inside one of those lazy chunks.
export const PageSkeleton: React.FC = () => (
  <div className="max-w-site mx-auto px-4 sm:px-6 py-12 space-y-8" aria-busy="true" aria-label="Loading">
    <div className="space-y-3">
      <div className="skeleton h-4 w-40" />
      <div className="skeleton h-9 w-3/4 max-w-xl" />
      <div className="skeleton h-4 w-1/2 max-w-md" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="border border-zinc-200 rounded-xs overflow-hidden">
          <div className="skeleton aspect-[16/10] rounded-none" />
          <div className="p-5 space-y-3">
            <div className="skeleton h-5 w-4/5" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
