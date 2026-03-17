'use client';

interface SkeletonProps {
  w?: string;
  h?: string;
  rounded?: string;
  className?: string;
}

export default function Skeleton({ 
  w = "w-full", 
  h = "h-4", 
  rounded = "rounded-md", 
  className = "" 
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-300 ${w} ${h} ${rounded} ${className}`}
    />
  );
}