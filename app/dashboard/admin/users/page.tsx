'use client'

import { useActionState, useState } from 'react'
import { uploadUsersFromCSV } from '@/app/actions/admin-actions'
import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'

export default function AdminUsersPage() {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        return await uploadUsersFromCSV(formData);
    }, undefined)

    const [fileName, setFileName] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Upload users via CSV (email, name, password, role).
                </p>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6 max-w-md">
                <h3 className="font-semibold mb-4">Bulk Upload</h3>
                <form action={formAction} className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">CSV (MAX. 5MB)</p>
                            </div>
                            <input id="dropzone-file" name="file" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                        </label>
                    </div>
                    {fileName && <p className="text-sm text-gray-500 text-center">Selected: {fileName}</p>}

                    <Button type="submit" className="w-full" disabled={isPending || !fileName}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Upload Users
                    </Button>

                    {state?.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}
                    {state?.success && <p className="text-sm text-green-500 text-center">{state.success}</p>}
                </form>

                <div className="mt-6">
                    <h4 className="text-sm font-medium">CSV Format Example:</h4>
                    <pre className="mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                        email,name,password,role{'\n'}
                        student1@example.com,John Doe,pass123,STUDENT{'\n'}
                        teacher@example.com,Jane Smith,secret,ADMIN
                    </pre>
                </div>
            </div>
        </div>
    )
}
