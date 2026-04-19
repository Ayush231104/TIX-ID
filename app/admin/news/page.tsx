import { redirect } from 'next/navigation'
import Typography from '@/components/ui/Typography'
import { getAdminRole } from '@/actions/adminActions'
import NewsForm from '../../../components/admin/forms/NewsForm'

export default async function AdminNewsPage() {
  const roleResult = await getAdminRole()

  if (!roleResult.success || !roleResult.data) {
    redirect('/login?redirect=/admin/news')
  }

  if (roleResult.data !== 'super_admin') {
    redirect('/admin')
  }

  return (
    <section className="max-w-5xl">
      <Typography as="h2" variant="h2" color="shade-900">
        Add News
      </Typography>
      <NewsForm />
    </section>
  )
}
