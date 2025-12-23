'use client'

import { useActionState } from 'react'
import { authenticate } from '@/app/actions/auth-actions'
import { Button } from '@/components/ui/button' // We'll create this or use standard HTML for now if not exists
// Ideally we should create UI components first, but for speed I'll inline some styles or use standard tailwind
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, Mail, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Hesabınıza giriş yapın
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Veya{' '}
                        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            yeni bir hesap oluşturun
                        </Link>
                    </p>
                </div>
                <form action={formAction} className="mt-8 space-y-6">
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-t-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
                                placeholder="Email adresi"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
                                placeholder="Şifre"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                Beni hatırla
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                Şifrenizi mi unuttunuz?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Giriş Yap
                        </button>
                    </div>
                    {errorMessage && (
                        <div className="mt-2 text-center text-sm text-red-500">
                            {errorMessage}
                        </div>
                    )}
                </form>
            </motion.div>
        </div>
    )
}
