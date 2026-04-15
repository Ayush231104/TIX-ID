import Typography from '@/components/ui/Typography'
import ShowtimeForm from './ShowtimeForm'

export default function AdminShowtimesPage() {
  return (
    <section className="max-w-5xl">
      <Typography as="h2" variant="h2" color="shade-900">
        Add Showtime
      </Typography>
      <ShowtimeForm />
    </section>
  )
}
