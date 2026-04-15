import { redirect } from 'next/navigation'
import { getAdminRole } from '@/actions/adminActions'

export default async function AdminEntryPage() {
  const roleResult = await getAdminRole()

  if (!roleResult.success || !roleResult.data) {
    redirect('/login?redirect=/admin')
  }

  redirect('/admin/dashboard')
}
