import LoginForm from '@/components/auth/LoginForm';
import AuthLayout from '@/components/auth/AuthLayout';

export default function Login() {
  return (
    <AuthLayout bgImage="/images/register/login.png" bgAlt="Login background">
      <LoginForm />
    </AuthLayout>
  );
}