'use client';
import LoginForm from '@/components/auth/LoginForm';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-dark-900">
              Tool<span className="text-brand-600">Drop</span>
            </span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/signup" className="font-medium text-brand-600 hover:text-brand-500 hover:underline">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-black/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          <LoginForm />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signIn('google')}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.896 4.14-1.232 1.232-3.16 2.584-6.944 2.584-5.972 0-10.596-4.828-10.596-10.8s4.624-10.8 10.596-10.8c3.224 0 5.544 1.272 7.24 2.872l2.304-2.304c-1.976-1.88-4.512-3.32-9.544-3.32-8.912 0-16.272 7.256-16.272 16.32s7.36 16.32 16.272 16.32c4.808 0 8.448-1.584 11.232-4.472 2.88-2.88 3.792-6.912 3.792-10.24 0-.96-.08-1.856-.24-2.72h-14.784z" />
                </svg>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <span className="sr-only">Sign in with Apple</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.181 2.308c0.505-0.612 0.846-1.464 0.753-2.308-0.726 0.029-1.603 0.483-2.124 1.095-0.467 0.54-0.875 1.411-0.764 2.235 0.81 0.063 1.629-0.41 2.135-1.022zM12.875 4.542c-1.256 0-2.316 0.781-3.037 0.781-0.725 0-1.611-0.741-2.617-0.741-1.321 0-2.529 0.756-3.21 1.94-1.373 2.379-0.352 5.889 0.983 7.81 0.655 0.941 1.43 1.996 2.451 1.957 0.982-0.039 1.353-0.635 2.539-0.635 1.185 0 1.521 0.635 2.559 0.615 1.056-0.021 1.722-0.957 2.373-1.902 0.751-1.096 1.061-2.158 1.077-2.214-0.024-0.012-2.072-0.796-2.093-3.155-0.017-1.979 1.623-2.929 1.696-2.973-0.921-1.348-2.341-1.493-2.846-1.523-0.106-0.006-0.106-0.006-0.106-0.006z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
