'use client'

interface AuthCartProps {
    title?: string
    subTitle?: string
    children: React.ReactNode
}

export function AuthCart({
    title, subTitle, children,
}: AuthCartProps) {

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                    <p className="mt-2 text-slate-500">{subTitle}</p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                    {children}
                </div>
            </div>
        </div>
    )
}
