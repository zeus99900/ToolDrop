'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginUser } from '@/lib/actions/auth';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 group transition-all disabled:opacity-70"
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}

export default function LoginForm() {
  const [errorMessage, dispatch] = useActionState(loginUser, undefined);

  return (
    <form action={dispatch} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="name@example.com"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-dark-900"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5 ml-1">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <Link href="/forgot-password" title="Forgot password?" className="text-xs text-brand-600 hover:underline font-medium">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-dark-900"
          />
        </div>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {errorMessage}
        </motion.div>
      )}

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
