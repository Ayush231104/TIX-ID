"use client";

import { useState, useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import Typography from "../ui/Typography";
import ConfirmModal from "@/components/ui/ConfirmModal"; 

const supabase = createClient();

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // States for the Modal
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "" });
    const [callbackUrl, setCallbackUrl] = useState("/");

    const router = useRouter();
    
    // 1. Properly destructure 'watch' from useForm
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const next = params.get("next") || params.get("redirect") || "/";
        setCallbackUrl(next);
    }, []);

    const onSubmit = async (data: FieldValues) => {
        setIsLoading(true);
        setAuthError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                if (error.message?.includes("Email not confirmed")) {
                    await supabase.auth.resend({
                        type: 'signup',
                        email: data.email,
                    });

                    setModalData({
                        title: "Email Not Verified",
                        message: "Your email isn't verified yet. We've sent a new link to your inbox!"
                    });
                    setShowModal(true);
                } else {
                    toast.error("Email or Password is incorrect.");
                    setAuthError(error.message);
                }
            } else {
                toast.success("Login successful!");
                router.refresh();
                router.push(callbackUrl);
            }
        } catch (err) {
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Watch inputs and clear server error when typing
    const emailValue = watch("email");
    const passwordValue = watch("password");

    useEffect(() => {
        if (authError) {
            setAuthError(null);
        }
    }, [emailValue, passwordValue]);

    // 3. Clean logic for UI state
    const isRed = !!errors.email || !!errors.password || !!authError;
    const isDisabled = !!errors.email || !!errors.password || isLoading;

    return (
        <div className="p-10 sm:px-20 sm:pt-15 md:px-25 md:pt-20">
            <Typography variant="h2" color="shade-900" className="mb-10">
                Login to TIX ID
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 max-w-105.75">
                {/* Email Field */}
                <div className="flex flex-col">
                    {/* Replaced hasError with isRed */}
                    <Typography variant="body-large" className={`tracking-wide uppercase mb-2 ${isRed ? 'text-red-500' : 'text-shade-900'}`}>
                        Email
                    </Typography>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", { required: "Email is required" })}
                        className={`w-full border-b pb-2 text-[14px] md:text-[20px] font-normal focus:outline-none transition-colors bg-transparent ${isRed ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-shade-400 text-gray-900 placeholder-shade-400 focus:border-gray-800'}`}
                    />
                </div>

                {/* Password Field */}
                <div className="flex flex-col relative">
                    <Typography variant="body-large" className={`tracking-wide uppercase mb-2 ${isRed ? 'text-red-500' : 'text-shade-900'}`}>
                        Password
                    </Typography>
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...register("password", { required: "Password is required" })}
                            className={`w-full border-b pb-2 text-[14px] md:text-[20px] font-normal pr-10 focus:outline-none transition-colors bg-transparent ${isRed ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-shade-400 text-gray-900 placeholder-shade-400 focus:border-gray-800'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute right-0 top-0 bottom-2 transition-colors ${isRed ? 'text-red-400' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>
                    <Link href="/forgotPassword" className="text-[12px] md:text-[14px] mt-2 text-shade-600 hover:text-shade-900">
                        Forgot Password?
                    </Link>
                </div>

                <div className="mt-2">
                    {/* Replaced hasError with isDisabled for functionality */}
                    <button
                        type="submit"
                        disabled={isDisabled}
                        className={`w-full py-3 px-2 rounded-[5.07px] text-[20px] mt-6.5 ${isDisabled ? 'bg-shade-200 text-shade-400 cursor-not-allowed' : 'bg-royal-blue-default hover:bg-royal-blue-hover text-white font-medium'} transition-colors`}
                    >
                        {isLoading ? 'Processing...' : 'Login Now'}
                    </button>

                    <div className="text-center text-[11px] md:text-[12px] text-shade-600 my-5">
                        Don&apos;t have an account?
                    </div>

                    <Link href="/signup" className="w-full block text-center px-2 py-3 rounded-[5.07px] font-medium text-[20px] border border-shade-600 text-royal-blue hover:bg-royal-blue-hover hover:text-white transition-colors">
                        Register Now
                    </Link>
                </div>
            </form>

            <ConfirmModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => setShowModal(false)}
                title={modalData.title}
                description={modalData.message}
                confirmText="Okay"
            />

            <Typography variant="body-small" className="text-black mt-27">
                © 2026 TIX ID. All rights reserved.
            </Typography>
        </div>
    );
}