'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSearchQuery, toggleCategory } from "@/lib/features/slice/newsSlice";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useGetNewsQuery } from "@/lib/features/api/newsApi";
import Skeleton from "@/components/ui/Skeleton";
import Typography from "@/components/ui/Typography";

export default function NewsFilter() {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.news.searchQuery)
  const selectedCategories = useAppSelector((state) => state.news.selectedCategories)
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const options = ["Spotlight", "News", "Video"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: news = [], isLoading, isError } = useGetNewsQuery({ searchQuery: search, categories: selectedCategories });

  return (
    <div>
      <div>
        <Typography variant="h2" color="shade-900" className="py-4.5">
          TIX ID News
        </Typography>
        <Typography color="shade-700" className="mb-8">
          The latest news about the world of cinema for you!
        </Typography>
      </div>

      <div className="flex items-center gap-6 w-full mb-6">
        <div className="relative flex items-center w-lg">
          <input
            type="text"
            value={search}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full px-4 py-3 border rounded-lg border-shade-300 focus:outline-none"
            placeholder="Search Post"
          />
          <CiSearch className="absolute right-4 text-gray-500 text-xl" />
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-3 text-[16px] font-normal text-gray-800 transition-opacity ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
          >
            Sort
            <FaCaretDown className="text-sm" />
          </button>

          {isOpen && (
            <div className="absolute -top-3 -left-4 w-48 bg-white rounded-lg shadow-md/30 shadow-gray-900 border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95">
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full text-left px-6 py-2 text-[14px] font-normal text-gray-900 hover:bg-gray-50 transition"
              >
                Sort
                <FaCaretUp className="text-sm" />
              </button>

              <div className="flex flex-col mt-2 px-2">
                {options.map((option) => {
                  const isSelected = selectedCategories.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => dispatch(toggleCategory(option))}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-[14px] transition cursor-pointer text-gray-900 hover:bg-shade-200"
                    >
                      <span>{option}</span>
                      {isSelected && (
                        <FiCheck className="text-royal-blue text-lg" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── LOADING & ERROR & DATA RENDERING ── */}
      {isLoading ? (
        <>
          {/* Skeleton for Tags */}
          <div className="flex flex-wrap gap-4 mb-16.5">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} w="w-24" h="h-12" rounded="rounded-[23px]" />
            ))}
          </div>

          {/* Skeleton for Alternating News Layout */}
          <div className="flex flex-col gap-15 lg:gap-26 mb-20">
            {[...Array(3)].map((_, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex flex-col gap-10 lg:gap-16 items-center ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                >
                  {/* Image Skeleton */}
                  <div className="w-full lg:w-1/2 h-100 lg:h-102.5 relative">
                    <Skeleton w="w-full" h="h-full" rounded="rounded-xl" />
                  </div>

                  {/* Text Skeleton */}
                  <div className="w-full lg:w-1/2 flex flex-col items-start px-2">
                    <Skeleton w="w-28" h="h-12" className="mb-2 sm:mb-6" />
                    
                    <Skeleton w="w-full lg:w-lg" h="h-10" className="mb-2" />
                    <Skeleton w="w-3/4 lg:w-96" h="h-10" className="mb-4" />
                    
                    <Skeleton w="w-full lg:w-lg" h="h-6" className="mb-2" />
                    <Skeleton w="w-5/6 lg:w-80" h="h-6" className="mb-5" />
                    
                    <Skeleton w="w-48" h="h-8" className="sm:mt-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : isError ? (
        <div className="flex justify-center items-center h-96">
          <Typography className="text-red-500 text-lg">Failed to load news.</Typography>
        </div>
      ) : news.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <Typography variant="body-large" color="shade-500">No news found matching your criteria.</Typography>
        </div>
      ) : (
        <>
          {/* Tags Row */}
          <div className="flex flex-wrap gap-4 mb-16.5">
            {news.map((item) => (
              <button
                key={item.id}
                className="px-5 py-3 border border-shade-500 rounded-[23px] text-[16px] text-shade-500 hover:text-shade-800 hover:border-shade-800 transition"
              >
                {item.tag}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-15 lg:gap-26 mb-20">
            {news.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <Link href={`news/${item.id}`} key={item.id}>
                  <div
                    className={`flex flex-col gap-10 lg:gap-16 items-center ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                      }`}
                  >
                    <div className="w-full lg:w-1/2 h-100 lg:h-102.5 relative">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="object-cover rounded-xl"
                        priority={index < 2}
                      />
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col items-start px-2">
                      <Typography variant="body-xl" color="shade-900" className="border px-5 py-3.5 leading-5 mb-2 sm:mb-6">
                        {item.category}
                      </Typography>
                      <Typography variant="h2" color="shade-900" className="lg:w-lg lg:text-[40px] font-medium leading-7 sm:leading-12.5 mb-4">
                        {item.title}
                      </Typography>
                      <Typography color="shade-600" className="lg:w-lg mb-5">
                        {item.subtitle}
                      </Typography>
                      <p className="text-xl sm:text-[24px] font-normal leading-6 text-shade-700 sm:mt-5">
                        {new Date(item.release_date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        | TIX ID
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}