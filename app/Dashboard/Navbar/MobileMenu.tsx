"use client"

import { createClient } from "@/utils/supabase/client";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient();

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: Props) {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		supabase.auth.getUser().then(({ data, error }) => {
			if (error) {
				console.log(error);
			}
			setUser(data?.user ?? null);
		});

		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				setUser(session?.user ?? null);
			}
		);

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.log(error);
		}

		onClose();
		router.refresh();
		router.push("/");
	};

	const userName = user?.user_metadata?.full_name || "User";
	const userInitial = userName.charAt(0).toUpperCase();

	return (
		<>
			{isOpen && (
				<div
					className="md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
					onClick={onClose}
				/>
			)}

			<div className={`md:hidden fixed top-0 right-0 z-50 h-full w-[80%] sm:w-72 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
				<div className="flex flex-col p-6 gap-6 h-full overflow-y-auto">
					<div className="flex justify-between items-center mb-2">
						<div></div>
						<X className="cursor-pointer text-shade-900 hover:text-red-500 transition-colors" onClick={onClose} />
					</div>

					{user && (
						<div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl mb-2 border border-gray-100">
							<div className="shrink-0 flex justify-center items-center bg-linear-to-r from-[#DAB868] to-[#B28A35] w-12 h-12 text-white text-xl font-bold rounded-full shadow-sm">
								{userInitial}
							</div>
							<div className="flex flex-col overflow-hidden">
								<span className="font-semibold text-shade-900 truncate">{userName}</span>
								<span className="text-xs text-shade-500 truncate">{user.email}</span>
							</div>
						</div>
					)}

					<div className="flex flex-col gap-4">
						<div>
							<Link href="/" onClick={onClose} className="block font-medium text-[16px] text-shade-900 hover:text-royal-blue-default transition-colors">Home</Link>
							<hr className="border-gray-200 w-full mt-4" />
						</div>
						<div>
							<Link href="/movies" onClick={onClose} className="block font-medium text-[16px] text-shade-900 hover:text-royal-blue-default transition-colors">Movies</Link>
							<hr className="border-gray-200 w-full mt-4" />
						</div>
						<div>
							<Link href="/tickets" onClick={onClose} className="block font-medium text-[16px] text-shade-900 hover:text-royal-blue-default transition-colors">My Ticket</Link>
							<hr className="border-gray-200 w-full mt-4" />
						</div>
						<div>
							<Link href="/news" onClick={onClose} className="block font-medium text-[16px] text-shade-900 hover:text-royal-blue-default transition-colors">TIX ID News</Link>
							<hr className="border-gray-200 w-full mt-4" />
						</div>
					</div>

					<div className="mt-auto pt-6">
						{!user ? (
							<div className="flex flex-col gap-4">
								<Link
									href="/signup"
									onClick={onClose}
									className="w-full text-center border border-shade-300 text-shade-900 py-3 rounded-lg font-medium text-[15px] active:bg-gray-100 transition-colors"
								>
									Register Account
								</Link>
								<Link
									href="/login"
									onClick={onClose}
									className="w-full text-center bg-royal-blue-default text-white py-3 rounded-lg font-medium text-[15px] hover:bg-royal-blue-hover active:bg-royal-blue-while-pressed transition-colors"
								>
									Login
								</Link>
							</div>
						) : (
							<button
								onClick={handleLogout}
								className="w-full text-center border border-red-200 text-red-600 bg-red-50 py-3 rounded-lg font-medium text-[15px] active:bg-red-100 transition-colors"
							>
								Logout
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	);
}