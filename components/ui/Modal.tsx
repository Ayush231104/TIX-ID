'use client'

import type { ReactNode } from 'react'

export default function Modal({
  isOpen,
  title,
  onClose,
  children,
}: {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-shade-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-shade-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1 text-sm font-semibold text-shade-700 transition hover:bg-shade-100"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
