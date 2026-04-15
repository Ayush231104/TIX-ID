'use client'

import type { ReactNode } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import Skeleton from '@/components/ui/Skeleton'
import Typography from '@/components/ui/Typography'

type BadgeTone = 'green' | 'yellow' | 'red' | 'blue' | 'gray'

type BadgeProps = {
  value: string
}

type Column<T> = {
  key: string
  header: string
  className?: string
  render: (row: T) => ReactNode
}

type ActionHandlers<T> = {
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  isDeleting?: boolean
}

type GenericTableProps<T> = {
  columns: Array<Column<T>>
  data: T[]
  isLoading: boolean
  emptyMessage?: string
  getRowId: (row: T) => string
  rowLabel: (row: T) => string
} & ActionHandlers<T>

function getBadgeTone(value: string): BadgeTone {
  const normalized = value.toLowerCase()

  if (['paid', 'active', 'success', 'approved', 'published', 'completed'].includes(normalized)) {
    return 'green'
  }

  if (['pending', 'draft', 'processing', 'scheduled'].includes(normalized)) {
    return 'yellow'
  }

  if (['failed', 'rejected', 'cancelled', 'inactive'].includes(normalized)) {
    return 'red'
  }

  if (['info', 'new'].includes(normalized)) {
    return 'blue'
  }

  return 'gray'
}

function Badge({ value }: BadgeProps) {
  const normalized = value.toLowerCase()
  const tone = getBadgeTone(value)

  const toneClasses: Record<BadgeTone, string> = {
    green: 'bg-sky-blue/12 text-royal-blue ring-sky-blue/25',
    yellow: 'bg-sunshine-yellow/20 text-royal-blue ring-sunshine-yellow/35',
    red: 'bg-sweet-red/12 text-sweet-red ring-sweet-red/30',
    blue: 'bg-royal-blue/10 text-royal-blue ring-royal-blue/25',
    gray: 'bg-shade-200/65 text-shade-700 ring-shade-300',
  }

  const movieStatusClasses: Record<string, string> = {
    upcoming: 'bg-sky-blue/12 text-royal-blue ring-sky-blue/30',
    streaming: 'bg-xxi-gold/20 text-xxi-gold-dark ring-pastel-yellow/50',
  }

  const badgeClass = movieStatusClasses[normalized] ?? toneClasses[tone]

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ring-1 ring-inset ${badgeClass}`}>
      {value}
    </span>
  )
}

export default function GenericTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No records found',
  getRowId,
  rowLabel,
  onEdit,
  onDelete,
  isDeleting = false,
}: GenericTableProps<T>) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto no-scrollbar">
        <div className="overflow-hidden rounded-xl border border-shade-200 bg-white shadow-sm">
          <div className="border-b border-shade-200 bg-shade-100 px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))` }}>
              {columns.map((column) => (
                <Skeleton key={column.key} h="h-4" className="w-24" />
              ))}
              <Skeleton h="h-4" className="w-20" />
            </div>
          </div>
          <div className="divide-y divide-shade-100">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid gap-4 px-6 py-5" style={{ gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))` }}>
                {columns.map((column) => (
                  <Skeleton key={`${column.key}-${rowIndex}`} h="h-4" className="w-full max-w-28" />
                ))}
                <div className="flex items-center gap-3">
                  <Skeleton h="h-4" className="w-4 rounded-full" />
                  <Skeleton h="h-4" className="w-4 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-xl border border-shade-200 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <Typography variant="body-medium" color="shade-700" className="font-medium">
            {emptyMessage}
          </Typography>
          <Typography variant="body-small" color="shade-500">
            Try adjusting your filters or create a new record.
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="overflow-hidden rounded-xl border border-shade-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-shade-200 bg-shade-100">
              {columns.map((column) => (
                <th key={column.key} className={`px-6 py-4 ${column.className ?? ''}`}>
                  <Typography as="span" variant="body-small" color="shade-500" className="font-bold uppercase tracking-[0.08em]">
                    {column.header}
                  </Typography>
                </th>
              ))}
              <th className="px-6 py-4 text-right">
                <Typography as="span" variant="body-small" color="shade-500" className="font-bold uppercase tracking-[0.08em]">
                  Actions
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={getRowId(row)} className="border-b border-shade-100 transition-colors last:border-0 hover:bg-shade-50">
                {columns.map((column) => (
                  <td key={`${getRowId(row)}-${column.key}`} className={`px-6 py-4 align-middle ${column.className ?? ''}`}>
                    {column.render(row)}
                  </td>
                ))}
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center justify-end gap-3">
                    {onEdit ? (
                      <button type="button" aria-label={`Edit ${rowLabel(row)}`} onClick={() => onEdit(row)} className="inline-flex items-center justify-center text-shade-400 transition hover:text-royal-blue-default">
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : null}
                    {onDelete ? (
                      <button type="button" aria-label={`Delete ${rowLabel(row)}`} onClick={() => onDelete(row)} disabled={isDeleting} className="inline-flex items-center justify-center text-shade-400 transition hover:text-sweet-red disabled:cursor-not-allowed disabled:opacity-50">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { Badge }
