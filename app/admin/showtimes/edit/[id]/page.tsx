import Link from 'next/link'
import { redirect } from 'next/navigation'
import Typography from '@/components/ui/Typography'
import { getAdminShowtimeById } from '@/actions/adminActions'

type Params = {
  params: Promise<{ id: string }>
}

export default async function AdminEditShowtimePage({ params }: Params) {
  const { id } = await params
  const result = await getAdminShowtimeById(id)

  if (!result.success || !result.data) {
    redirect('/admin/dashboard')
  }

  return (
    <section className="max-w-4xl">
      <Typography as="h2" variant="h2" color="shade-900" className="font-bold">
        Edit Showtime
      </Typography>
      <Typography variant="body-default" color="shade-700" className="mt-2">
        Edit flow is being wired to reusable forms. Current selection: {result.data.show_time}
      </Typography>
      <Link href="/admin/showtimes" className="mt-4 inline-block text-royal-blue-default hover:underline">
        <Typography as="span" variant="body-small" color="royal-blue" className="font-semibold">
          Open Showtime Form
        </Typography>
      </Link>
    </section>
  )
}
