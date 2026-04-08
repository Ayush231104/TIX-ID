"use client"

import Image from "next/image";
import Link from "next/link";
import { HiOutlineMenu } from "react-icons/hi";
import { useEffect, useState, useRef } from "react";
import MobileMenu from "./MobileMenu";
import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { LuLogOut } from "react-icons/lu";
import Typography from "@/components/ui/Typography";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAppSelector } from "@/lib/hooks";

const supabase = createClient();

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const user = useAppSelector((state) => state.auth.user);

  const currentQuery = typeof window !== "undefined" ? window.location.search : "";
  const currentPath = `${pathname}${currentQuery}`;
  const isAuthPage = pathname.startsWith('/login') || 
                     pathname.startsWith('/signup') || 
                     pathname.startsWith('/forgotPassword');
  const loginHref = isAuthPage || pathname === '/' 
      ? '/login' 
      : `/login?next=${encodeURIComponent(currentPath)}`;

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
    setShowLogoutModal(false);
    router.refresh();
    router.push("/");
  };

  const userName = user?.user_metadata?.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="sticky top-0 z-50 w-full bg-white py-3">
      <div className="flex items-center justify-between px-8 md:px-16 py-2">
        <Link href="/">
          <div className="flex items-center">
            <Image
              src="/images/homepage/logo.png"
              alt="Logo"
              width={80}
              height={40}
              priority 
            />
          </div>
        </Link>

        {user ? (
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            <Link href="/">
              <Typography variant="h4" color="shade-900" className="hover:text-royal-blue-hover border-b-2 border-b-white hover:border-b-shade-900">Home</Typography>
            </Link>
            <Link href="/movies">
              <Typography variant="h4" color="shade-900" className="hover:text-royal-blue-hover border-b-2 border-b-white hover:border-b-shade-900">Movies</Typography>
            </Link>
            <Link href="/tickets">
              <Typography variant="h4" color="shade-900" className="hover:text-royal-blue-hover border-b-2 border-b-white hover:border-b-shade-900">My Tickets</Typography>
            </Link>
            <Link href="/news">
              <Typography variant="h4" color="shade-900" className="hover:text-royal-blue-hover border-b-2 border-b-white hover:border-b-shade-900">TIX ID News</Typography>
            </Link>

            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex justify-center items-center bg-gradient-to-r from-xxi-gold to-xxi-gold-dark size-9 text-white text-xl rounded-full cursor-pointer hover:opacity-90 transition-opacity"
              >
                {userName}
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white rounded-lg shadow-lg border border-shade-100 z-50">
                  <div className="flex items-center p-2 px-6">
                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex justify-between items-center text-left text-[18px] font-medium text-shade-900 hover:text-royal-blue-hover transition-colors gap-2"
                    >
                      <span>Logout</span>
                      <LuLogOut className="size-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {showLogoutModal && (
              <ConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                title="Are you sure you want to logout?"
                description="You will be securely signed out of your TIX ID account."
                confirmText="Logout"
              />
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            <Link href="/">
              <Typography variant="h4" color="shade-900" className="hover:text-royal-blue-hover border-b-2 border-b-white hover:border-b-shade-900">Home</Typography>
            </Link>
            <Link href="/movies">
              <Typography variant="h4" color="shade-900" className="hover:text-royal-blue-hover border-b-2 border-b-white hover:border-b-shade-900">Movies</Typography>
            </Link>
            <Link href="/tickets">
              <Typography variant="h4" color="shade-900" className="hover:text-royal-blue-hover border-b-2 border-b-white hover:border-b-shade-900">My Tickets</Typography>
            </Link>
            <Link href="/news">
              <Typography variant="h4" color="shade-900" className="hover:text-royal-blue-hover border-b-2 border-b-white hover:border-b-shade-900">TIX ID News</Typography>
            </Link>
            <div className="w-0.5 h-6 bg-shade-400" />
            <Link href="/signup">
              <Typography variant="h4" color="shade-900" className="hover:text-royal-blue-hover border-b-2 border-b-white hover:border-b-shade-900">Register Account</Typography>
            </Link>
            <Link href={loginHref} className="flex items-center justify-center h-12 px-6 rounded-lg bg-royal-blue-default hover:bg-royal-blue-hover text-sunshine-yellow transition-colors">
              <Typography variant="h4" color="sunshine-yellow">Login</Typography>
            </Link>
          </div>
        )}

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