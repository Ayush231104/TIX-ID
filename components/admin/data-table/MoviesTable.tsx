'use client'

import { useState } from 'react'
import type { Movie } from '@/types/index'
import { useDeleteMovieMutation, useGetAdminMoviesQuery } from '@/lib/features/api/adminApi'
import ConfirmModal from '@/components/ui/ConfirmModal'
import Typography from '@/components/ui/Typography'
import GenericTable, { Badge } from './GenericTable'

type MoviesTableProps = {
  onEdit: (movie: Movie) => void
}

export default function MoviesTable({ onEdit }: MoviesTableProps) {
  const { data: movies = [], isLoading } = useGetAdminMoviesQuery()
  const [deleteMovie, { isLoading: isDeleting }] = useDeleteMovieMutation()
  const [pendingDelete, setPendingDelete] = useState<Movie | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleConfirmDelete = async () => {
    if (!pendingDelete) {
      return
    }

    try {
      await deleteMovie(pendingDelete.id).unwrap()
      setPendingDelete(null)
      setError(null)
    } catch (deleteError) {
      if (deleteError && typeof deleteError === 'object' && 'message' in deleteError) {
        setError(String(deleteError.message))
        return
      }

      setError('Failed to delete movie')
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-lg border border-sweet-red/40 bg-sweet-red/10 px-4 py-3">
          <Typography variant="body-small" color="sweet-red" className="font-medium">
            {error}
          </Typography>
        </div>
      ) : null}

      <GenericTable<Movie>
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (movie) => (
              <Typography variant="body-medium" color="shade-900" className="font-medium">
                {movie.name}
              </Typography>
            ),
          },
          {
            key: 'genre',
            header: 'Genre',
            render: (movie) => (
              <Typography variant="body-medium" color="shade-900">
                {movie.genre ?? '-'}
              </Typography>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (movie) => (
              movie.movies_status ? <Badge value={movie.movies_status} /> : <Typography variant="body-medium" color="shade-900">-</Typography>
            ),
          },
        ]}
        data={movies}
        isLoading={isLoading}
        getRowId={(movie) => movie.id}
        rowLabel={(movie) => movie.name}
        emptyMessage="No records found"
        onEdit={onEdit}
        onDelete={(movie) => setPendingDelete(movie)}
        isDeleting={isDeleting}
      />

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Movie"
        description={pendingDelete ? `Are you sure you want to delete ${pendingDelete.name}? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  )
}
