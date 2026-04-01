import ForgotForm from "@/components/auth/ForgotForm";
import AuthLayout from '@/components/auth/AuthLayout';

export default function ForgotPassword() {
  return (
    <AuthLayout bgImage="/images/register/forgot.png" bgAlt="Forgot password background">
      <ForgotForm />
    </AuthLayout>
  );
}