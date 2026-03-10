'use client';

import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const supabase = createClient();

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: FieldValues) => {
        setIsLoading(true);
        setAuthError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            setAuthError('Email or Password is incorrect. Please try again.');
            setIsLoading(false);
        } else {
            router.push('/');
        }
    };

    const hasError = !!errors.email || !!errors.password || !!authError;

    return (
        <div className="p-10 sm:px-20 sm:pt-15 md:px-25 md:pt-20">

            <h1 className="text-[28px] md:text-[36px] font-bold text-shade-900 mb-10">
                Login to TIX ID
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 max-w-105.75">

                <div className="flex flex-col">
                    <label className={`text-[14px] md:text-[18px] font-normal tracking-wide uppercase mb-2 ${hasError ? 'text-red-500' : 'text-shade-900'}`}>
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", { required: "Email is required" })}
                        className={`w-full border-b pb-2 text-[14px] md:text-[20px] font-normal focus:outline-none transition-colors bg-transparent ${hasError ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-shade-400 text-gray-900 placeholder-shade-400 focus:border-gray-800'}`}
                    />
                </div>

                <div className="flex flex-col relative">
                    <label className={`text-[14px] md:text-[18px] font-normal tracking-wide uppercase mb-2 ${hasError ? 'text-red-500' : 'text-shade-900'}`}>
                        Password
                    </label>
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...register("password", { required: "Password is required" })}
                            className={`w-full border-b pb-2 text-[14px] md:text-[20px] font-normal pr-10 focus:outline-none transition-colors bg-transparent ${hasError ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-shade-400 text-gray-900 placeholder-shade-400 focus:border-gray-800'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute right-0 top-0 bottom-2 transition-colors ${hasError ? 'text-red-400' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                        </button>
                    </div>
                    <Link
                        href="/forgotPassword"
                        className={`text-[12px] md:text-[14px] mt-2 ${hasError ? 'text-red-500' : 'text-shade-600 hover:text-shade-900'} transition-colors`}
                    >
                        Forgot Password?
                    </Link>
                    {hasError && (
                        <span className="text-red-500 text-[11px] mt-2">
                            {authError || "Please check your email and password."}
                        </span>
                    )}
                </div>

                <div className="mt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-2 rounded-[5.07px] text-[20px] mt-6.5 ${hasError ? 'bg-shade-200 text-shade-400 cursor-not-allowed' : 'bg-royal-blue-default hover:bg-royal-blue-hover text-white font-medium'} transition-colors`}
                    >
                        {isLoading ? 'Processing...' : 'Login Now'}
                    </button>

                    <div className="text-center text-[11px] md:text-[12px] text-shade-600 my-5">
                        Don&apos;t have an account?
                    </div>

                    <Link
                        href="/signup"
                        className={`w-full block text-center px-2 py-3 rounded-[5.07px] font-medium text-[20px] border border-shade-600 text-royal-blue hover:bg-royal-blue-hover hover:text-white active:text-white active:bg-royal-blue-while-pressed transition-colors ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        Register Now
                    </Link>
                </div>
            </form>

            <div className="text-[10px] md:text-[12px] text-black font-normal mt-27">
                © 2021 TIX ID - PT Nusantara Elang Sejahtera.
            </div>
        </div>
    );
}