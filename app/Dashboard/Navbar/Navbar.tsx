"use client"

import Image from "next/image";
import Link from "next/link";
import { HiOutlineMenu } from "react-icons/hi";
import { useEffect, useState, useRef } from "react";
import MobileMenu from "./MobileMenu";
import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import Typography from "@/components/ui/Typography";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAppSelector } from "@/lib/hooks";

const supabase = createClient();

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [adminRole, setAdminRole] = useState<'super_admin' | 'theater_admin' | null>(null);

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

  useEffect(() => {
    let isMounted = true;

    const getRole = async () => {
      if (!user?.id) {
        if (isMounted) setAdminRole(null);
        return;
      }

      const { data, error } = await supabase
        .from('profile')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!isMounted || error || !data?.role) {
        if (isMounted) setAdminRole(null);
        return;
      }

      if (data.role === 'super_admin' || data.role === 'theater_admin') {
        setAdminRole(data.role);
      } else {
        setAdminRole(null);
      }
    };

    getRole();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

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
  const canAccessAdmin = adminRole === 'super_admin' || adminRole === 'theater_admin';

  return (
    <div className="sticky top-0 z-999 w-full bg-white py-3">
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
            {canAccessAdmin && (
              <Link href="/admin">
                <Typography variant="h4" color="shade-900" className="hover:text-royal-blue-hover border-b-2 border-b-white hover:border-b-shade-900">Admin</Typography>
              </Link>
            )}

            <div className="relative" ref={dropdownRef}>
              <Link href="/profile"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex justify-center items-center bg-linear-to-r from-xxi-gold to-xxi-gold-dark size-9 text-white text-xl rounded-full cursor-pointer hover:opacity-90 transition-opacity"
              >
                {userName}
              </Link>
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