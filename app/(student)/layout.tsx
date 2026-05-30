import { StudentShell } from '@/components/layout/StudentShell'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentShell userFullName="Aluno Teste" userEmail="aluno@exemplo.com">
      {children}
    </StudentShell>
  )
}
