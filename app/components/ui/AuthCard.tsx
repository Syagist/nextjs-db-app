import { ReactNode } from "react"

interface AuthCardProps {
  title: string
  children: ReactNode
}

export default function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-950 dark:to-black px-4">
      
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-xl border border-zinc-200 dark:border-zinc-800">
        
        <h1 className="text-2xl font-semibold text-center mb-6 text-zinc-800 dark:text-white">
          {title}
        </h1>

        <div className="space-y-4">
          {children}
        </div>

      </div>
    </div>
  )
}
