import React from "react";

const BlogSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-5">
        <div className="w-20 h-5 bg-gray-200 rounded-full" />
        <div className="mt-4 w-3/4 h-6 bg-gray-200 rounded" />
        <div className="mt-3 space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded" />
          <div className="w-full h-4 bg-gray-200 rounded" />
          <div className="w-2/3 h-4 bg-gray-200 rounded" />
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
