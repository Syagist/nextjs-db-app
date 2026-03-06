interface StatsCardProps {
  title: string
  value: number | string
  description?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'slate'
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  slate: 'bg-slate-50 border-slate-200 text-slate-700',
}

export function StatsCard({ title, value, description, color = 'blue' }: StatsCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      {description && <p className="mt-1 text-xs opacity-60">{description}</p>}
    </div>
  )
}
