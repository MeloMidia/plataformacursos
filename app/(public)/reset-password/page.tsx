'use client'

import { useTransition, useState } from 'react'
import { motion } from 'framer-motion'
import { updatePassword } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string
    if (password !== confirm) {
      setError('As senhas não conferem.')
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await updatePassword(formData)
      if (result?.error) setError(result.error)
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
        className="w-full max-w-md"
      >
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border)',
            boxShadow: '0 0 40px rgba(0,87,255,0.08)',
          }}
        >
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Defina sua senha
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            Crie uma senha forte para acessar a plataforma.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Nova senha</Label>
              <Input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                style={{
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Confirmar senha</Label>
              <Input
                name="confirm"
                type="password"
                required
                placeholder="Repita a senha"
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
              {isPending ? 'Salvando...' : 'Salvar senha'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
