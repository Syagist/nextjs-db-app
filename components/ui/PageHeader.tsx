interface PageHeaderProps {
  title: string
  subtitle: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
