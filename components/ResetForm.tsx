'use client';

import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const supabase = createClient();

export default function ResetForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: FieldValues) => {
        setIsLoading(true);
        setStatusMessage(null);

        const { error } = await supabase.auth.updateUser({
            password: data.password,
        });

        if (error) {
            setStatusMessage({ type: 'error', text: error.message });
            setIsLoading(false);
        } else {
            setStatusMessage({ type: 'success', text: 'Password updated successfully! Redirecting...' });
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }
    };

    return (
        <div className="px-8 py-10 md:px-25 md:py-20">
            <h1 className="text-[28px] md:text-[36px] font-bold text-shade-900 mb-10">
                Set New Password
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                
                <div className="flex flex-col relative">
                    <label className={`text-[14px] md:text-[18px] font-normal tracking-wide uppercase mb-2 ${errors.password ? 'text-red-500' : 'text-shade-900'}`}>
                        New Password
                    </label>
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            {...register("password", { 
                                required: "Password is required",
                                pattern: {
                                  value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/i,
                                  message: "Must be 8-16 chars, containing uppercase, lowercase, number, and symbol."
                                }
                            })}
                            className={`w-full border-b pb-2 text-[14px] md:text-[20px] font-normal pr-10 focus:outline-none transition-colors bg-transparent ${errors.password ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-shade-400 text-gray-900 placeholder-shade-400 focus:border-gray-800'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute right-0 top-0 bottom-2 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                        </button>
                    </div>
                    {errors.password && <span className="text-red-500 text-[11px] mt-2">{errors.password.message as string}</span>}
                </div>

                {statusMessage && (
                    <div className={`text-sm p-3 rounded mt-2 ${statusMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {statusMessage.text}
                    </div>
                )}

                <div className="mt-2">
                    <button
                        type="submit"
                        disabled={isLoading || statusMessage?.type === 'success'}
                        className="w-full bg-royal-blue-default hover:bg-royal-blue-hover text-white py-4 rounded-md font-medium text-[15px] disabled:bg-[#E2E8F0] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>

            <div className="text-[10px] md:text-[12px] text-shade-900 font-medium mt-27">
                © 2021 TIX ID - PT Nusantara Elang Sejahtera.
            </div>
        </div>
    );
}