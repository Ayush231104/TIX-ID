import ResetForm from "@/components/ResetForm";
import Image from "next/image";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";

export default function ResetPassword() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center md:justify-end bg-black px-4 md:pr-16 lg:pr-30 py-12">

      <div className="absolute inset-0 z-0">
        <Image
          src="/images/register/forgot.png"
          alt="Forgot password background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <Link
        href="/"
        className="absolute top-10 left-10 hidden md:flex items-center gap-4 text-white cursor-pointer hover:opacity-80 transition-opacity z-10"
      >
        <GoArrowLeft className="text-[32px]" />
        <span className="font-bold text-[24px]">Return</span>
      </Link>

      <div className="w-full md:w-164 bg-white shadow-2xl z-10 relative rounded-sm">
        <Link
          href="/"
          className="flex md:hidden items-center gap-3 text-shade-900 cursor-pointer hover:opacity-80 transition-opacity p-8 pb-0"
        >
          <GoArrowLeft className="text-2xl" />
          <span className="font-bold text-[24px]">Return</span>
        </Link>
        <ResetForm />
      </div>
    </div>
  )
}
