# Project Overview — Plataforma de Cursos Online

## O que é

Plataforma própria de área de membros para criadores de conteúdo venderem cursos online com visual premium, dark e cinematográfico. O checkout e pagamento são realizados externamente pela **Hubla**. Após a aprovação do pagamento, a Hubla envia um webhook para a plataforma, que libera automaticamente o acesso do aluno ao(s) curso(s) comprado(s).

## Modelo de negócio

- Múltiplos cursos disponíveis na mesma plataforma
- Aluno acessa **somente** os cursos que comprou
- Produtos na Hubla podem mapear para 1 ou N cursos (combos)
- Reembolso ou cancelamento pela Hubla revoga o acesso automaticamente
- Admin pode conceder ou revogar acesso manualmente (cortesias, suporte)

## Exemplos de acesso

| Compra | Acesso |
|---|---|
| Curso 1 apenas | Somente Curso 1 |
| Curso 2 apenas | Somente Curso 2 |
| Combo (Curso 1 + Curso 2) | Ambos os cursos |
| Reembolso do Curso 1 | Acesso ao Curso 1 revogado |

## Fluxo principal

```
1. Aluno compra na Hubla (checkout externo)
2. Hubla envia webhook POST /api/webhooks/hubla
3. Plataforma valida a assinatura (HMAC-SHA256)
4. Plataforma cria conta do aluno no Supabase Auth
5. Resend envia e-mail com link de definição de senha
6. Aluno acessa a plataforma e define sua senha
7. Aluno faz login e acessa os cursos comprados
8. Progresso por aula é salvo automaticamente
```

## Personas

- **Aluno** — consome conteúdo, acompanha progresso, baixa materiais
- **Admin** — gerencia cursos, alunos, acessos, produtos e webhooks
- **Support** — visualiza alunos e vendas, sem alterar configurações críticas

## Identidade visual

Visual premium, dark, moderno e cinematográfico. Inspirado em plataformas high ticket como Pronix, Netflix e áreas de membros de produtos digitais de alto valor. Sidebar fixa à esquerda, cards grandes, vitrine horizontal, pouco texto, forte sensação de produto caro.

Cores dominantes: **Azul escuro** como base, **Amarelo** como destaque.

## Integrações externas

| Serviço | Função |
|---|---|
| **Hubla** | Checkout, pagamento e webhook de acesso |
| **Panda Video** | Hospedagem e streaming dos vídeos das aulas |
| **Resend** | E-mails transacionais (boas-vindas, reset de senha) |
| **Supabase** | Auth, banco de dados PostgreSQL, storage |
| **Vercel** | Deploy e CDN |
