// Shared form field primitives

export const inputCls =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500'

interface FormFieldProps {
  label: string
  children: React.ReactNode
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={inputCls} />
}
