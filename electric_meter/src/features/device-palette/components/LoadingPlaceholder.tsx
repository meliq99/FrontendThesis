import React from "react";

export const LoadingPlaceholder: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="h-24 animate-pulse rounded-md bg-muted flex flex-col items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-muted-foreground/20 mb-2"></div>
            <div className="w-16 h-3 bg-muted-foreground/20 rounded mb-1"></div>
            <div className="w-10 h-2 bg-muted-foreground/20 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}; 