'use client';

import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Typography from '../ui/Typography';

const supabase = createClient();

export default function ResetForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Added state for confirm password

    const router = useRouter();
    // Added 'watch' to compare the two password fields
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

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
            <Typography variant="h2" color='shade-900' className='mb-3 md:mb-12'>
                Set New Password
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">

                <div className="flex flex-col relative">
                    <Typography variant='body-large' className={`tracking-wide uppercase mb-2 ${errors.password ? 'text-red-500' : 'text-shade-900'}`}>
                        New Password
                    </Typography>
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

                <div className="flex flex-col relative">
                    <Typography variant='body-large' className={`tracking-wide uppercase mb-2 ${errors.confirmPassword ? 'text-red-500' : 'text-shade-900'}`}>
                        Confirm Password
                    </Typography>
                    <div className="relative w-full">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (val: string) => {
                                    if (watch('password') !== val) {
                                        return "Your passwords do not match";
                                    }
                                }
                            })}
                            className={`w-full border-b pb-2 text-[14px] md:text-[20px] font-normal pr-10 focus:outline-none transition-colors bg-transparent ${errors.confirmPassword ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-shade-400 text-gray-900 placeholder-shade-400 focus:border-gray-800'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={`absolute right-0 top-0 bottom-2 transition-colors ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {showConfirmPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                        </button>
                    </div>
                    {errors.confirmPassword && <span className="text-red-500 text-[11px] mt-2">{errors.confirmPassword.message as string}</span>}
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
                        className="w-full bg-royal-blue-default hover:bg-royal-blue-hover text-white py-4 rounded-md font-medium text-[15px] disabled:bg-[#E2E8F0] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>

            <Typography variant='body-small' className="text-black mt-27">
                © 2026 TIX ID. All rights reserved.
            </Typography>
        </div>
    );
}