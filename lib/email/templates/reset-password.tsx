import {
  Html, Head, Body, Container, Heading, Text, Button, Hr
} from '@react-email/components'

interface ResetPasswordEmailProps {
  resetUrl: string
}

export function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ background: '#050914', fontFamily: 'Inter, sans-serif' }}>
        <Container style={{ maxWidth: 560, margin: '40px auto', padding: '0 20px' }}>
          <Heading style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 700 }}>
            Redefinição de senha
          </Heading>
          <Text style={{ color: '#A7B0C0', fontSize: 16, lineHeight: 1.6 }}>
            Recebemos uma solicitação para redefinir sua senha. Clique no botão
            abaixo para criar uma nova senha.
          </Text>
          <Button
            href={resetUrl}
            style={{
              background: '#0057FF',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 16,
              padding: '14px 32px',
              borderRadius: 8,
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: 16,
            }}
          >
            Redefinir senha
          </Button>
          <Hr style={{ borderColor: '#1E2A3D', margin: '32px 0' }} />
          <Text style={{ color: '#64748B', fontSize: 12 }}>
            Link válido por 1 hora. Se não solicitou, ignore este e-mail.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
