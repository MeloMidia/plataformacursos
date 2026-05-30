export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { lessonId } = await params
  return <div className="p-8"><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Aula: {lessonId}</h1></div>
}
