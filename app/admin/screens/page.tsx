import Typography from '@/components/ui/Typography'
import ScreenForm from '../../../components/admin/forms/ScreenForm'

export default function AdminScreensPage() {
  return (
    <section className="max-w-5xl">
      <Typography as="h2" variant="h2" color="shade-900">
        Add Screen
      </Typography>
      <ScreenForm />
    </section>
  )
}
