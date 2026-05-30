import { PageTransition } from '@/components/layout/PageTransition'

export default function DashboardPage() {
  return (
    <PageTransition className="p-8">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
        Bem-vindo de volta
      </h1>
      <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
        Seus cursos estão aqui.
      </p>
    </PageTransition>
  )
}
