'use client';

import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FiCheck } from "react-icons/fi"; // Added for the checkmark
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";

const supabase = createClient();

type News = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  release_date: string;
  category: string;
  img: string;
};

export default function NewsFilter() {
  const [news, setNews] = useState<News[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = ["Spotlight", "News", "Video"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getNews = async () => {
      let query = supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (search) {
        query = query.ilike("title", `%${search}%`);
      }

      // filter by multiple categories
      if (selectedCategories.length > 0) {
        query = query.in("category", selectedCategories);
      }

      const { data, error } = await query;

      if (!error && data) {
        setNews(data);
      }
    };

    const timeout = setTimeout(() => {
      getNews();
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, selectedCategories]);

  // Toggle category selection
  const toggleCategory = (option: string) => {
    setSelectedCategories((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div>
      <div>
        <div className="font-bold text-4xl text-shade-900 py-4.5">
          TIX ID News
        </div>
        <div className="text-[16px] font-normal text-shade-600 leading-6 mb-8">
          The latest news about the world of cinema for you!
        </div>
      </div>

      <div className="flex items-center gap-6 w-full mb-6">
        <div className="relative flex items-center w-lg">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                      onClick={() => toggleCategory(option)}
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

      <div className="flex flex-wrap gap-4 mb-16.5">
        {news.map((news) => (
          <button
            key={news.id}
            className="px-5 py-3 border border-shade-500 rounded-[23px] text-[16px] text-shade-500 hover:text-shade-800 hover:border-shade-800 transition"
          >
            {news.tag}
          </button>
        ))}
      </div>

      <div>
        <div className="flex flex-col gap-15 lg:gap-26 mb-20">
          {news.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <Link href={`news/${item.id}`} key={item.id}>
                <div
                  key={item.id}
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
                    <div className="border border-shade-800 px-5 py-3.5 text-xl leading-5 font-normal mb-2 sm:mb-6">
                      {item.category}
                    </div>
                    <h2 className="lg:w-lg text-3xl sm:text-[40px] font-medium leading-7 sm:leading-12.5 text-shade-900 mb-4">
                      {item.title}
                    </h2>
                    <p className="lg:w-lg text-[16px] font-normal leading-5 sm:leading-6 text-shade-600 mb-5">
                      {item.subtitle}
                    </p>
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
      </div>
    </div>
  )
}
