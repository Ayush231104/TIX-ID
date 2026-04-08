'use client';

import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Typography from '../ui/Typography';

const supabase = createClient();

export default function ForgotForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: FieldValues) => {
        setIsLoading(true);
        setStatusMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
            redirectTo: `${window.location.origin}/resetPassword`,
        });

        if (error) {
            setStatusMessage({ type: 'error', text: error.message });
        } else {
            setStatusMessage({ type: 'success', text: 'Reset link sent! Please check your email inbox.' });
        }

        setIsLoading(false);
    };

    return (
        <div className="px-8 py-10 md:px-25 md:py-20">
            <Typography variant="h2" color='shade-900' className='mb-3 md:mb-12'>Forgot Password</Typography>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <div className="flex flex-col">
                    <Typography variant='body-large' className={`racking-wide uppercase mb-2 ${errors.email ? 'text-red-500' : 'text-shade-900'}`}>
                        Email
                    </Typography>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", { required: "Email is required" })}
                        className={`w-full border-b pb-2 text-[14px] md:text-[20px] font-normal focus:outline-none transition-colors bg-transparent ${errors.email ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-shade-400 text-gray-900 placeholder-shade-400 focus:border-gray-800'}`}
                    />
                    {errors.email && <span className="text-red-500 text-[11px] mt-2">{errors.email.message as string}</span>}
                </div>

                {statusMessage && (
                    <div className={`text-sm p-3 rounded ${statusMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {statusMessage.text}
                    </div>
                )}

                <div className="mt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-royal-blue-default hover:bg-royal-blue-hover text-white py-4 rounded-md font-medium text-[15px] disabled:bg-[#E2E8F0] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <Link
                        href="/login"
                        className="w-full block text-center text-gray-500 hover:text-shade-800 mt-6 font-medium text-[14px] transition-colors"
                    >
                        Back to Login
                    </Link>
                </div>
            </form>

            <Typography variant='body-small' className="text-black mt-27">
                © 2026 TIX ID. All rights reserved.
            </Typography>
        </div>
    );
}