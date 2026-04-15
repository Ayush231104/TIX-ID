import Typography from '@/components/ui/Typography'
import TheaterForm from './TheaterForm'

export default function AdminTheatersPage() {
  return (
    <section className="max-w-5xl">
      <Typography as="h2" variant="h2" color="shade-900">
        Add Theater
      </Typography>
      <TheaterForm />
    </section>
  )
}
