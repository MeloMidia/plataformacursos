'use client'

import { useTransition, useState } from 'react'
import { motion } from 'framer-motion'
import { requestPasswordReset } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await requestPasswordReset(formData)
      if (result?.error) setError(result.error)
      else setSent(true)
    })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-base)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Link href="/login" className="flex items-center gap-1.5 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={14} /> Voltar para o login
        </Link>

        <div
          className="rounded-2xl p-8 border"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border)',
            boxShadow: '0 0 40px rgba(0,87,255,0.08)',
          }}
        >
          {sent ? (
            <div className="text-center space-y-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                style={{ background: 'rgba(34,197,94,0.15)' }}
              >
                <span style={{ color: 'var(--success)', fontSize: 22 }}>✓</span>
              </div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>E-mail enviado!</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Verifique sua caixa de entrada e siga as instruções.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Recuperar senha</h1>
              <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                Informe seu e-mail para receber o link de redefinição.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-sm" style={{ color: 'var(--text-secondary)' }}>E-mail</Label>
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    style={{
                      background: 'var(--bg-secondary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                {error && <p className="text-sm" style={{ color: 'var(--error)' }}>{error}</p>}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full font-semibold"
                  style={{ background: 'var(--blue-primary)', color: '#fff' }}
                >
                  {isPending ? 'Enviando...' : 'Enviar link'}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
