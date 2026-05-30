# Hubla Webhooks — Integração

## Endpoint

```
POST /api/webhooks/hubla
```

Não requer autenticação de sessão. A segurança é garantida pela validação da assinatura HMAC-SHA256.

---

## Segurança — Validação da Assinatura

A Hubla assina cada requisição com o header `X-Hubla-Signature` usando HMAC-SHA256 com um segredo compartilhado.

```typescript
import crypto from 'crypto'

function validateHublaSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )
}
```

O segredo é armazenado em `HUBLA_WEBHOOK_SECRET` (variável de ambiente — nunca exposta ao cliente).

---

## Idempotência

Cada evento da Hubla possui um `hubla_event_id` único. Antes de processar qualquer evento:

1. Verificar se `hubla_event_id` já existe em `webhook_events`
2. Se já existe e `processed = true` → retornar `200 OK` sem processar novamente
3. Se já existe e `processed = false` → tentar processar novamente (retry após erro anterior)
4. Se não existe → inserir e processar

Isso protege contra reenvios duplicados da Hubla.

---

## Eventos Suportados

### Eventos de Acesso Concedido (grant access)

| Evento Hubla | Ação na plataforma |
|---|---|
| `purchase.approved` | Criar/ativar enrollment |
| `subscription.activated` | Criar/ativar enrollment |
| `access.granted` | Criar/ativar enrollment |
| `order.completed` | Criar/ativar enrollment |

### Eventos de Acesso Revogado (revoke access)

| Evento Hubla | Ação na plataforma |
|---|---|
| `purchase.refunded` | Revogar enrollment |
| `subscription.cancelled` | Revogar enrollment |
| `subscription.expired` | Revogar enrollment (status='expired') |
| `access.revoked` | Revogar enrollment |
| `chargeback.created` | Revogar enrollment |

---

## Fluxo Completo de Processamento

```
POST /api/webhooks/hubla
│
├── 1. Ler body como raw string (para validação HMAC)
├── 2. Validar X-Hubla-Signature
│   └── Inválida → return 401 Unauthorized
│
├── 3. Parse JSON do payload
├── 4. Extrair hubla_event_id e event_type
│
├── 5. INSERT INTO webhook_events
│   └── ON CONFLICT (hubla_event_id) → verificar processed
│   └── Se already processed → return 200 OK (idempotência)
│
├── 6. Determinar tipo de ação: GRANT ou REVOKE
│
├── [GRANT]
│   ├── 7a. Extrair email do comprador do payload
│   ├── 7b. Buscar profiles por email
│   │   └── Não encontrado → createUser via supabase.auth.admin
│   │       └── Resend: e-mail "Seu acesso está pronto" com link de senha
│   │
│   ├── 7c. Extrair hubla_product_id do payload
│   ├── 7d. SELECT products WHERE hubla_product_id = ?
│   ├── 7e. SELECT course_ids FROM product_courses WHERE product_id = ?
│   │
│   ├── 7f. INSERT INTO purchases (student_id, product_id, hubla_order_id, ...)
│   │
│   └── 7g. Para cada course_id:
│       └── UPSERT enrollments SET status='active', granted_by='webhook'
│
├── [REVOKE]
│   ├── 8a. Extrair email ou hubla_order_id do payload
│   ├── 8b. Localizar student_id via email
│   ├── 8c. Localizar product via hubla_product_id
│   ├── 8d. SELECT course_ids FROM product_courses
│   │
│   ├── 8e. UPDATE purchases SET status='refunded'|'cancelled'
│   │
│   └── 8f. Para cada course_id:
│       └── UPDATE enrollments SET status='revoked', revoked_at=now()
│           WHERE student_id=? AND course_id=? AND granted_by='webhook'
│           (NÃO revogar se granted_by='manual' — proteção de cortesias)
│
└── 9. UPDATE webhook_events SET processed=true
    └── return 200 OK
```

---

## Estrutura do Payload Esperado

```typescript
interface HublaWebhookPayload {
  event_id: string          // hubla_event_id para idempotência
  event_type: string        // ex: 'purchase.approved'
  created_at: string        // ISO timestamp
  
  data: {
    order_id: string        // hubla_order_id
    product_id: string      // hubla_product_id
    
    customer: {
      email: string
      name: string
    }
    
    amount: number          // em centavos
    status: string
  }
}
```

**Nota:** O payload exato da Hubla deve ser confirmado na documentação oficial da Hubla. A tabela `webhook_events.payload` armazena o raw payload para referência.

---

## Tratamento de Erros

```typescript
try {
  // processar evento
  await processWebhookEvent(event)
  await supabase
    .from('webhook_events')
    .update({ processed: true, error: null })
    .eq('hubla_event_id', event.hubla_event_id)
  
  return NextResponse.json({ ok: true }, { status: 200 })
  
} catch (error) {
  // Salvar erro mas retornar 200 para a Hubla não reenviar infinitamente
  // Reenvios devem ser tratados por retry manual no admin
  await supabase
    .from('webhook_events')
    .update({ error: String(error) })
    .eq('hubla_event_id', event.hubla_event_id)
  
  // Log para observabilidade
  console.error('[webhook/hubla] processing error:', error)
  
  return NextResponse.json({ ok: true }, { status: 200 })
}
```

**Decisão:** Retornar 200 mesmo em erro de processamento interno para evitar loop de reenvio da Hubla. Erros ficam visíveis na tabela `webhook_events` e na página `/admin/webhooks`.

---

## Página de Admin: `/admin/webhooks`

Exibe tabela de `webhook_events` com:
- Timestamp
- event_type
- hubla_event_id
- processed (✅ / ❌)
- error (se houver)
- Botão "Reprocessar" para eventos com erro

---

## Configuração na Hubla

1. Entrar no painel da Hubla → Configurações → Webhooks
2. Adicionar URL: `https://seu-dominio.com/api/webhooks/hubla`
3. Copiar o segredo gerado para `HUBLA_WEBHOOK_SECRET`
4. Selecionar eventos: purchase.approved, purchase.refunded, subscription.*, access.*
5. Testar com evento de teste da Hubla

---

## Segurança Adicional

- Usar `SUPABASE_SERVICE_ROLE_KEY` apenas no handler do webhook (server-side)
- Nunca logar o payload completo em produção (pode conter dados pessoais — LGPD)
- Rate limiting: Vercel aplica automaticamente no Edge
- Timeout: handler deve responder em < 10s (limite Vercel Serverless)
