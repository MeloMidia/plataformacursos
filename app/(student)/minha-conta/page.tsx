import { signOut } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/layout/PageTransition'
import { LogOut } from 'lucide-react'

export default function MinhaContaPage() {
  return (
    <PageTransition className="p-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        Minha Conta
      </h1>
      <form action={signOut}>
        <Button
          type="submit"
          variant="ghost"
          className="flex items-center gap-2 text-sm"
          style={{ color: 'var(--error)' }}
        >
          <LogOut size={16} />
          Sair da conta
        </Button>
      </form>
    </PageTransition>
  )
}
