import { redirect } from 'next/navigation'
import Typography from '@/components/ui/Typography'
import DiscountForm from './DiscountForm'
import { createClient } from '@/utils/supabase/server'

export default async function AdminDiscountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (profile?.role !== 'super_admin') {
    redirect('/admin')
  }

  return (
    <section className="overflow-hidden rounded-lg border border-shade-200 bg-white p-6 shadow-[0_14px_34px_rgba(51,51,51,0.08)] md:p-8">
      <Typography as="h1" variant="h2" color="shade-900" className="font-bold tracking-[-0.03em]">
        Discount Management
      </Typography>
      <Typography variant="body-medium" color="shade-700" className="mt-2 max-w-2xl">
        Create and manage discount campaigns used during payment and checkout.
      </Typography>
      <DiscountForm />
    </section>
  )
}
