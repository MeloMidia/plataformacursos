export default async function AdminAlunoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div className="p-8"><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Aluno: {id}</h1></div>
}
