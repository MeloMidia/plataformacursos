export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <div className="p-8"><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Curso: {slug}</h1></div>
}
