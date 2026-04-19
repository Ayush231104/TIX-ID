import Typography from '@/components/ui/Typography'
import MovieForm from '../../../components/admin/forms/MovieForm'
import { getAdminRole } from '@/actions/adminActions'
import { redirect } from 'next/navigation'

export default async function AdminMoviesPage() {
  const roleResult = await getAdminRole()

  if (!roleResult.success || !roleResult.data) {
    redirect('/login?redirect=/admin/movies')
  }

  if (roleResult.data !== 'super_admin') {
    redirect('/admin')
  }

  return (
    <section className="max-w-4xl">
      <Typography as="h2" variant="h2" color="shade-900">
        Add Movie
      </Typography>
      <MovieForm />
    </section>
  )
}
