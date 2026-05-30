import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudentShell } from '@/components/layout/StudentShell'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <StudentShell
      userFullName={profile?.full_name ?? user.email ?? 'Aluno'}
      userEmail={profile?.email ?? user.email ?? ''}
      userAvatarUrl={profile?.avatar_url ?? undefined}
    >
      {children}
    </StudentShell>
  )
}
