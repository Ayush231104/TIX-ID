import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/profile')
  }

  return children
}
