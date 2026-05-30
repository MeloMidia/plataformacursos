# Design System — Plataforma de Cursos Premium

Visual premium, dark, moderno e cinematográfico. Inspirado em plataformas high ticket como Netflix, Pronix e áreas de membros de produtos digitais profissionais.

**Regra de ouro:** A plataforma nunca pode parecer um dashboard genérico ou painel administrativo branco.

---

## Paleta de Cores

```css
:root {
  /* Backgrounds */
  --bg-base:        #050914;  /* fundo principal — quase preto azulado */
  --bg-secondary:   #08111F;  /* fundo secundário — páginas, seções */
  --bg-sidebar:     #060A13;  /* sidebar fixa */
  --bg-card:        #0D1728;  /* cards de curso, módulo, aula */
  --bg-card-hover:  #111E33;  /* card em hover */

  /* Bordas */
  --border:         #1E2A3D;  /* bordas sutis */
  --border-focus:   #0057FF;  /* foco de input */

  /* Azul — cor principal */
  --blue-primary:   #0057FF;  /* CTAs, links ativos, highlights */
  --blue-premium:   #003B99;  /* hover de botões primários */
  --blue-accent:    #2F80FF;  /* destaques, ícones ativos */
  --blue-glow:      rgba(0, 87, 255, 0.08); /* glow em cards */
  --blue-glow-strong: rgba(0, 87, 255, 0.18); /* glow hover */

  /* Amarelo — cor de destaque premium */
  --yellow:         #FFD400;  /* CTA principal, progresso, badge premium */
  --yellow-hover:   #FFE45C;  /* hover em elementos amarelos */
  --yellow-dim:     rgba(255, 212, 0, 0.15); /* fundo de badge amarelo */

  /* Texto */
  --text-primary:   #FFFFFF;
  --text-secondary: #A7B0C0;
  --text-muted:     #64748B;
  --text-disabled:  #3D4A5C;

  /* Status */
  --success:        #22C55E;
  --warning:        #F59E0B;
  --error:          #EF4444;
  --info:           #3B82F6;
}
```

---

## Tipografia

### Fonte
- **Display / Hero:** `Inter` peso 700–800 (títulos grandes de páginas)
- **Corpo:** `Inter` peso 400–500
- **Labels / Badges:** `Inter` peso 600

### Escala
```
--text-xs:   0.75rem  / 12px  — badges, labels pequenos
--text-sm:   0.875rem / 14px  — metadados, descrições
--text-base: 1rem     / 16px  — corpo
--text-lg:   1.125rem / 18px  — subtítulos
--text-xl:   1.25rem  / 20px  — títulos de seção
--text-2xl:  1.5rem   / 24px  — títulos de card
--text-3xl:  1.875rem / 30px  — títulos de página
--text-4xl:  2.25rem  / 36px  — hero titles
--text-5xl:  3rem     / 48px  — hero principal
```

---

## Espaçamento e Layout

### Sidebar
- Largura fixa: **256px** (desktop)
- Colapsável: **72px** (só ícones) em breakpoint < lg
- Mobile: drawer com overlay

### Layout principal
```
Desktop:  [Sidebar 256px] [Conteúdo flex-1]
Mobile:   [Conteúdo fullwidth] + [Sidebar drawer]
```

### Grid de cards
```
Mobile:  1 coluna
Tablet:  2 colunas
Desktop: 3 colunas (vitrine de cursos)
Wide:    4 colunas
```

---

## Border Radius

```
--radius-sm:  6px   — badges, tags
--radius-md:  8px   — botões, inputs
--radius-lg:  12px  — cards
--radius-xl:  16px  — modais, cards hero
--radius-2xl: 24px  — cards grandes de destaque
```

---

## Sombras e Glow

```css
/* Card padrão */
.card {
  box-shadow: 0 0 40px var(--blue-glow);
}

/* Card em hover */
.card:hover {
  box-shadow: 0 0 60px var(--blue-glow-strong);
  transform: translateY(-2px);
}

/* Sidebar item ativo */
.sidebar-item-active {
  box-shadow: inset 3px 0 0 var(--blue-primary);
}
```

---

## Componentes

### Botões

```
Primary:    bg-[--blue-primary]  text-white  hover:bg-[--blue-premium]
Secondary:  bg-transparent  border border-[--border]  text-[--text-primary]  hover:border-[--blue-accent]
Yellow CTA: bg-[--yellow]  text-[--bg-base]  font-bold  hover:bg-[--yellow-hover]
Ghost:      bg-transparent  text-[--text-secondary]  hover:text-white  hover:bg-[--bg-card]
Danger:     bg-[--error]  text-white
```

### Badges / Status

```
Ativo:     bg-[--success]/15  text-[--success]  "Ativo"
Revogado:  bg-[--error]/15    text-[--error]    "Revogado"
Novo:      bg-[--yellow-dim]  text-[--yellow]   "Novo"
Draft:     bg-[--border]      text-[--text-muted] "Rascunho"
```

### Cards

```css
.course-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: 0 0 40px var(--blue-glow);
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 60px var(--blue-glow-strong);
  border-color: rgba(47, 128, 255, 0.3);
}

.locked-card {
  /* igual ao course-card mas com overlay */
  position: relative;
}

.locked-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(5, 9, 20, 0.6);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(2px);
}
```

### Sidebar

```
Fundo: --bg-sidebar
Largura: 256px
Bordas: border-r 1px solid --border
Item ativo: bg-[--bg-card] com left-border azul
Ícones: 20px, text-[--text-muted] → text-white no ativo
Avatar: bottom, com nome e role abaixo
```

### Hero de Curso

```
Altura: 300–400px
Background: thumbnail com gradient overlay (escurece para baixo)
gradient: linear-gradient(to bottom, transparent 30%, --bg-base 100%)
Título: text-4xl font-bold text-white
Progresso: barra amarela embaixo do título
```

---

## Animações (Framer Motion)

```typescript
// Entrada de página
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' }
}

// Cards em stagger
const containerVariants = {
  animate: { transition: { staggerChildren: 0.06 } }
}
const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 }
}

// Sidebar items
const sidebarItemVariants = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 }
}
```

---

## Ícones

Biblioteca: **Lucide React** (consistente com Shadcn/UI).
Tamanho padrão: 20px na sidebar, 16px em labels, 24px em destaques.

---

## Regras Inegociáveis

1. Nenhuma cor branca ou cinza claro como fundo principal
2. Amarelo `#FFD400` apenas em: CTA principal, barras de progresso, badge "Novo/Premium"
3. Bordas sempre sutis (`#1E2A3D`) — nunca bordas escuras/pesadas
4. Cards sempre com glow azul sutil — nunca flat/sem sombra
5. Hover de card sempre com `translateY(-2px)` — sensação de elevação
6. Sidebar sempre visível em desktop — nunca colapsada por padrão
7. Pouco texto na tela — ênfase em imagens, thumbnails e ícones
8. Thumbnails sempre com aspect-ratio 16:9
9. Progresso sempre em amarelo — nunca azul
10. Fonte Inter — nunca fontes serifadas ou decorativas
