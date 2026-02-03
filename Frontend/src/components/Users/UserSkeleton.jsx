import React from "react";
import { Skeleton } from "../ui/skeleton";

function UserSkeleton() {
  return (
    <div>
      <div className="flex items-center gap-4 my-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-100" />
          <Skeleton className="h-4 w-90" />
        </div>
      </div>
    </div>
  );
}

export default UserSkeleton;
