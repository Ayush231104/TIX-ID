'use client'
import AuthLayout from "@/components/auth/AuthLayout";
import ResetForm from "@/components/auth/ResetForm";

export default function ResetPassword() {
  return (
    <div>
      <AuthLayout bgImage="/images/register/reset.png" bgAlt="Reset Password background">
        <ResetForm />
      </AuthLayout>
    </div>
  )
}
