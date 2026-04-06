'use client';

import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';
import Typography from '../ui/Typography';
import { useRouter } from 'next/navigation';

const supabase = createClient();

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    setAuthMessage(null);

    const { data: authData, error} = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    console.log({authData, error})

    if (error) {
      setAuthMessage({ type: 'error', text: error.message });
      setIsLoading(false);
      return;
    } 
    
    if (authData?.user?.identities && authData.user.identities.length === 0) {
      setAuthMessage({ 
        type: 'error', 
        text: 'This email is already registered. Please log in instead.' 
      });
      setIsLoading(false);
      return;
    }

    setShowSuccessModal(true);
    setIsLoading(false);
  }; 

  const handleModalOk = () => {
    setShowSuccessModal(false);
    router.push('/login'); 
  };

  const hasError = !!errors.fullName || !!errors.email || !!errors.password;

  return (
    <div className="p-10 sm:px-20 sm:pt-15 md:px-25 md:pt-20">
      <Typography variant='h2' color='shade-900' className='mb-10'>Register TIX ID</Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 w-full max-w-105.75">

        <div className="flex flex-col">
          <Typography variant='body-large' className={`tracking-wide uppercase mb-2 ${errors.fullName ? 'text-red-500' : 'text-shade-900'}`}>
            Full Name
          </Typography>
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
          <Typography variant='body-large' className={`tracking-wide uppercase mb-2 ${errors.email ? 'text-red-500' : 'text-shade-900'}`}>
            Email
          </Typography>
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
          <Typography variant='body-large' className={`tracking-wide uppercase mb-2 ${errors.password ? 'text-red-500' : 'text-shade-900'}`}>
            Password
          </Typography>
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

        {authMessage && authMessage.type === 'error' && (
          <div className="text-sm p-3 rounded mt-2 bg-red-50 text-red-600">
            {authMessage.text}
          </div>
        )}

        <div className='mt-2'>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-[5.07px] text-xl mt-6.5 ${hasError ? 'bg-shade-200 text-shade-400 cursor-not-allowed' : 'bg-royal-blue-default hover:bg-royal-blue-hover text-white font-medium'} transition-colors`}
          >
            {isLoading ? 'Processing...' : 'Register Now'}
          </button>

          <Typography variant='body-small' className="text-shade-600 my-5">
            Already have an account?
          </Typography>

          <Link
            href="/login"
            className={`w-full block text-center px-2 py-3 rounded-[5.07px] font-medium text-xl border border-shade-600 text-royal-blue hover:bg-royal-blue-hover hover:text-white active:text-white active:bg-royal-blue-while-pressed transition-colors ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
            Login Now
          </Link>
        </div>
      </form>

      <Typography variant='body-small' className="text-black mt-27">
        © 2026 TIX ID. All rights reserved.
      </Typography>

      {showSuccessModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-8 max-w-sm w-full mx-auto shadow-xl text-center'>
            <h2 className='text-2xl font-bold text-green-500 mb-2'>Registration Successful!</h2>
            <p className='text-shade-600 text-sm mb-8'>
              We have sent a confirmation link to your email address. Please verify your email to log in.
            </p>
            
            <button 
              onClick={handleModalOk} 
              className='w-full py-3 bg-royal-blue-default text-white font-bold rounded-xl hover:bg-royal-blue-hover transition-all cursor-pointer'
            >
              Okay, go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}