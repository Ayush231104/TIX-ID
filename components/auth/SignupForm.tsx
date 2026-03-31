'use client';

import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';

const supabase = createClient();

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    setAuthMessage(null);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      setAuthMessage({ type: 'error', text: error.message });
    } else {
      setAuthMessage({ type: 'success', text: 'Registration successful! Please check your email.' });
    }

    setIsLoading(false);
  };

  const hasError = !!errors.fullName || !!errors.email || !!errors.password;

  return (
    <div className="p-10 sm:px-20 sm:pt-15 md:px-25 md:pt-20">

      <h1 className="text-[28px] md:text-[36px] font-bold text-shade-900 mb-10">
        Register TIX ID
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 w-full max-w-105.75">

        <div className="flex flex-col">
          <label className={`text-[14px] md:text-[18px] font-normal tracking-wide uppercase mb-2 ${errors.fullName ? 'text-red-500' : 'text-shade-900'}`}>
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            {...register("fullName", { required: "Full name is required", minLength: 1, maxLength: 30 })}
            className={`w-full border-b pb-2 text-[14px] md:text-[20px] focus:outline-none transition-colors bg-transparent ${errors.fullName ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-shade-400 text-shade-900 placeholder-shade-400 focus:border-shade-800'}`}
          />
          {errors.fullName && <span className="text-red-500 text-[12px] mt-2">{errors.fullName.message as string}</span>}
        </div>

        {/* Email Input */}
        <div className="flex flex-col">
          <label className={`text-[14px] md:text-[18px] font-normal tracking-wide uppercase mb-2 ${errors.email ? 'text-red-500' : 'text-shade-900'}`}>
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
            className={`w-full border-b pb-2 text-[14px] md:text-[20px] focus:outline-none transition-colors bg-transparent ${errors.email ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-shade-400 text-shade-900 placeholder-shade-400 focus:border-shade-800'}`}
          />
          {errors.email && <span className="text-red-500 text-[12px] mt-2">{errors.email.message as string}</span>}
        </div>

        {/* Password Input */}
        <div className="flex flex-col relative">
          <label className={`text-[14px] md:text-[18px] font-normal tracking-wide uppercase mb-2 ${errors.password ? 'text-red-500' : 'text-shade-900'}`}>
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/i,
                  message: "Must be 8-16 chars, containing uppercase, lowercase, number, and symbol."
                }
              })}
              className={`w-full border-b pb-2 text-[14px] md:text-[20px] pr-10 focus:outline-none transition-colors bg-transparent ${errors.password ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-shade-400  text-shade-900 placeholder-shade-400 focus:border-shade-800'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-0 top-0 bottom-2 transition-colors ${errors.password ? 'text-red-400' : 'text-shade-400 hover:text-shade-600'}`}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.password && <span className="text-red-500 text-[12px] mt-2">{errors.password.message as string}</span>}
        </div>

        {/* Global Auth Messages from Supabase */}
        {authMessage && (
          <div className={`text-sm p-3 rounded mt-2 ${authMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {authMessage.text}
          </div>
        )}

        <div className='mt-2'>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-[5.07px] text-[20px] mt-6.5 ${hasError ? 'bg-shade-200 text-shade-400 cursor-not-allowed' : 'bg-royal-blue-default hover:bg-royal-blue-hover text-white font-medium'} transition-colors`}
          >
            {isLoading ? 'Processing...' : 'Register Now'}
          </button>

          <div className="text-center text-[11px] md:text-[12px] text-shade-600 my-5">
            Already have an account?
          </div>

          <Link
            href="/login"
            className={`w-full block text-center px-2 py-3 rounded-[5.07px] font-medium text-[20px] border border-shade-600 text-royal-blue hover:bg-royal-blue-hover hover:text-white active:text-white active:bg-royal-blue-while-pressed transition-colors ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
            Login Now
          </Link>
        </div>
      </form>

      <div className="text-[10px] md:text-[12px] text-shade-900 font-medium mt-27">
        © 2021 TIX ID - PT Nusantara Elang Sejahtera.
      </div>
    </div>
  );
}