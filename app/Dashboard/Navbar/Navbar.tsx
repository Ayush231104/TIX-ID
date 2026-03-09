"use client"

import Image from "next/image";
import Link from "next/link";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineMenu } from "react-icons/hi";
import { useEffect, useState, useRef } from "react";
import MobileMenu from "./MobileMenu";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { LuLogOut } from "react-icons/lu";

const supabase = createClient();

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.log(error);
      }
      setUser(data.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    setIsDropdownOpen(false);
    router.refresh();
    router.push("/");
  };

  const userName = user?.user_metadata?.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="my-3">
      <div className="flex items-center justify-between px-8 md:px-16 py-2">
        <Link href="/">
          <div className="flex items-center">
            <Image
              src="/images/homepage/logo.png"
              alt="Logo"
              width={80}
              height={40}
            />
          </div>
        </Link>

        {user ?
          <div className="hidden md:flex items-center gap-16">
            <Link href="/" className="font-medium text-shade-900 hover:text-royal-blue-hover active:text-royal-blue-while-pressed hover:border-b-2 hover:border-b-shade-900">Home</Link>
            <Link href="/tickets" className="font-medium text-shade-900 hover:text-royal-blue-hover active:text-royal-blue-while-pressed hover:border-b-2 hover:border-b-shade-900">Tiket Saya</Link>
            <Link href="/news" className="font-medium text-shade-900 hover:text-royal-blue-hover active:text-royal-blue-while-pressed hover:border-b-2 hover:border-b-shade-900">TIX ID News</Link>
            <IoMdNotificationsOutline className="text-2xl" />

            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex justify-center items-center bg-linear-to-r from-xxi-gold to-xxi-gold-dark size-9 text-white text-xl text-center rounded-full cursor-pointer hover:opacity-90 transition-opacity"
              >
                {userName}
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white rounded-lg shadow-lg border border-shade-100 z-50">
                  <div className="flex items-center p-2 px-6 border-b border-shade-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-[18px] font-medium text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                    <LuLogOut className="flex size-6 justify-center items-center text-red-600" />
                  </div>
                </div>
              )}
            </div>

          </div>
          :
          <div className="hidden md:flex items-center gap-12">
            <Link href="/" className="font-medium text-[18px] text-shade-900 hover:text-royal-blue-hover active:text-royal-blue-while-pressed hover:border-b-2 hover:border-b-shade-900">Home</Link>
            <Link href="/tickets" className="font-medium text-[18px] text-shade-900 hover:text-royal-blue-hover active:text-royal-blue-while-pressed hover:border-b-2 hover:border-b-shade-900">Tiket Saya</Link>
            <Link href="/news" className="font-medium text-[18px] text-shade-900 hover:text-royal-blue-hover active:text-royal-blue-while-pressed hover:border-b-2 hover:border-b-shade-900">TIX ID News</Link>
            <div className="w-0.5 h-6 bg-shade-400">
            </div>
            <IoMdNotificationsOutline className="text-2xl" />
            <Link href="/signup" className="font-medium text-[18px] text-shade-900 hover:text-royal-blue-hover active:text-royal-blue-while-pressed hover:border-b-2 hover:border-b-shade-900">Register Account</Link>
            <Link href="/login" className="flex items-center justify-center h-12 w-25.25 px-2 py-3 rounded-lg font-medium text-[24px] leading-8 bg-royal-blue-default hover:bg-royal-blue-hover active:bg-royal-blue-while-pressed text-sunshine-yellow">Login</Link>
          </div>
        }

        <div className="md:hidden">
          <HiOutlineMenu
            className="text-3xl cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}