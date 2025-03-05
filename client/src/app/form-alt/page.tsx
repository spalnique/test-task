'use client';

import LoginForm from '@/components/LoginForm';
import PageWrapper from '@/components/PageWrapper';
import RegisterForm from '@/components/RegisterForm';
import { useSearchParams } from 'next/navigation';

export default function FormPage() {
  const searchParams = useSearchParams();

  const isRegister = searchParams.has('signup');

  return (
    <PageWrapper className="w-[384px] justify-center rounded-3xl px-8 py-10">
      {isRegister ? <RegisterForm /> : <LoginForm />}
    </PageWrapper>
  );
}
