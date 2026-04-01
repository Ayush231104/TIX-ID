import SignupForm from '@/components/auth/SignupForm';
import AuthLayout from '@/components/auth/AuthLayout';

export default function Signup() {
  return (
    <AuthLayout bgImage="/images/register/signup.png" bgAlt="Signup background">
      <SignupForm />
    </AuthLayout>
  );
}