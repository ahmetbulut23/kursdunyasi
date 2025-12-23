'use client'

import { useActionState } from 'react'
import { register } from '@/app/actions/auth-actions'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, Mail, User, Loader2 } from 'lucide-react'

// Wrapper for register action to match useActionState signature
// The action expects FormData, but useActionState passes (state, payload)
// Our register action signature is currently async register(formData) -> result
// We need it to be async register(prevState, formData) -> result
// I need to update auth-actions.ts or wrap it here.
// But wait, I defined authenticate as (prevState, formData) but register as (formData).
// I should fix auth-actions.ts for register too, or use a wrapper.
// Let's use a wrapper for now or fix the action.
// Actually, let's fix the action in the next step or assume I'll fix it. 
// For now, I'll use a local wrapper content here? No, better to fix the file.
// I'll stick to expected usage.

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        return await register(formData);
    }, undefined)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Hesabınızı oluşturun
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Veya{' '}
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            mevcut hesabınıza giriş yapın
                        </Link>
                    </p>
                </div>
                <form action={formAction} className="mt-8 space-y-6">
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="relative block w-full rounded-t-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
                                placeholder="Ad Soyad"
                            />
                        </div>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
                                placeholder="Email adresi"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
                                placeholder="Şifre"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Kayıt Ol
                        </button>
                    </div>
                    {state?.error && (
                        <div className="mt-2 text-center text-sm text-red-500">
                            {state.error}
                        </div>
                    )}
                    {state?.success && (
                        <div className="mt-2 text-center text-sm text-green-500">
                            {state.success} <Link href="/login" className="underline">Şimdi giriş yap</Link>
                        </div>
                    )}
                </form>
            </motion.div>
        </div>
    )
}
