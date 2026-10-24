# AGENTS.md — BrMoveToGo (site oficial)

Site oficial da **BrMoveToGo** (brmovetogo.com e www.brmovetogo.com): mudanças internacionais e foco comercial em **Mudanças e Mini Mudanças**. Objetivo: confiança, captação de leads e contato comercial (WhatsApp). **Repositório público e site em produção.**

O `README.md` tem as diretrizes de produto (válidas), mas as seções 6 e 10 estão desatualizadas: dizem que o repositório não tem implementação, e hoje ele tem.

## Stack
Site estático multi-página. Sem framework, build, dependências ou CI.

- `index.html` — home · `mudancas/` · `simulador/` · `bagagem-e-documentos/` · `404.html`
- `gerador.html` — gerador de documentos (linkado em `bagagem-e-documentos`)
- `assets/site.css`, `assets/site.js`, `assets/track.js` — usados pelas páginas atuais, referenciados com `?v=...` para cache
- `img/` — logos e fotos (webp, com fallback jpg); `robots.txt`, `sitemap.xml` (4 URLs)

Itens que parecem legado (**fato:** sem referência nas páginas atuais ou no sitemap; **hipótese:** sobras de versões anteriores): `css/styles.css`, `js/script.js`, `brmovetogo-gerador-documentos.html` e a pasta `novo/` (cópia paralela do site). Não editar nem remover sem OK do PH; a decisão é dele.

## Rodar local
`python3 -m http.server 8080` e abrir `http://localhost:8080`.

## Deploy e produção
- Push na `main` dispara `.github/workflows/deploy.yml`: AWS OIDC, `aws s3 sync . --delete` (excluindo `.git`, `.github`, `.gitignore`, `README.md`, `.DS_Store`) e invalidação do CloudFront (`/*`). **Merge em `main` = produção imediata.**
- Tudo que não está excluído é **publicado** e público, inclusive este arquivo e a pasta `novo/`. Nunca colocar secret, dado de cliente ou informação interna.
- Não há CI. Antes de pedir OK de merge, validar localmente em 360, 768 e 1280 px.

## Aprovação e merge
- Peça OK do PH antes de **todo** merge. A regra de "merge sem OK para tarefa pequena" exige CI verde e **não se aplica** aqui, porque o repositório não tem CI.
- Alteração em workflow, bucket, CloudFront ou IAM: OK explícito.

## Regras do site
- **Rastreamento só com consentimento:** `assets/track.js` carrega GA4 e Meta Pixel apenas depois do aceite (chave `bmg_consent` no `localStorage`) e dispara `whatsapp_click` / `generate_lead` (no `/simulador`). Não carregar tracking antes do consentimento nem remover o banner.
- Ao alterar `site.css`, `site.js` ou `track.js`, atualizar o `?v=` em **todas** as páginas que os referenciam (`index.html`, `mudancas/`, `simulador/`, `bagagem-e-documentos/`).
- Header "Rastrear envio" e rodapé "Ajuda > Portal do Cliente" apontam para `https://envios.brmovetogo.com/portaldocliente/`. **O link administrativo `https://envios.brmovetogo.com/` não deve aparecer no site público.**
- Não inventar serviços, rotas, coberturas, prazos, clientes, avaliações, números ou garantias. Não misturar informação jurídica ou operacional confidencial com conteúdo público.
- Não quebrar o fluxo de contato/orçamento (CTAs e WhatsApp).
- Mudou páginas ou URLs: atualizar `sitemap.xml` (domínio `www.brmovetogo.com`).

## UI
- Tokens em `assets/site.css`: `--purple #5a0a75`, `--purple-2 #7f28a0`, `--purple-dark #250331`, `--yellow #ffe400`, `--ink #160d1c`, `--bg #f8f6f9`, `--ok #16794b`, `--danger #b42318`. Reutilizar; não redesenhar a identidade aprovada.
- Responsivo em 360, 768 e 1280 px (menu, CTAs, formulários, WhatsApp, imagens), sem overflow.

## Nunca
- Colocar secret, token ou dado de lead/cliente no repositório (ele é público).
- Criar V2/New/Final, novas cópias paralelas de páginas, ou adicionar dependências sem necessidade.
