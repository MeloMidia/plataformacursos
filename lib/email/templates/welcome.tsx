import {
  Html, Head, Body, Container, Heading, Text, Button, Hr
} from '@react-email/components'

interface WelcomeEmailProps {
  fullName: string
  setPasswordUrl: string
}

export function WelcomeEmail({ fullName, setPasswordUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ background: '#050914', fontFamily: 'Inter, sans-serif' }}>
        <Container style={{ maxWidth: 560, margin: '40px auto', padding: '0 20px' }}>
          <Heading style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 700 }}>
            Seu acesso está pronto, {fullName}!
          </Heading>
          <Text style={{ color: '#A7B0C0', fontSize: 16, lineHeight: 1.6 }}>
            Sua compra foi aprovada. Clique no botão abaixo para definir sua senha
            e acessar a plataforma.
          </Text>
          <Button
            href={setPasswordUrl}
            style={{
              background: '#FFD400',
              color: '#050914',
              fontWeight: 700,
              fontSize: 16,
              padding: '14px 32px',
              borderRadius: 8,
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: 16,
            }}
          >
            Definir minha senha
          </Button>
          <Hr style={{ borderColor: '#1E2A3D', margin: '32px 0' }} />
          <Text style={{ color: '#64748B', fontSize: 12 }}>
            Se você não realizou esta compra, ignore este e-mail.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
