# BrMoveToGo — Site Oficial

> **PROJECT SOURCE OF TRUTH**
>
> Este documento registra o contexto aprovado do projeto. Antes de mudanças significativas, inspecione a implementação existente. Preserve funcionalidades, conteúdo e identidade aprovados. O código funcional é a fonte técnica de verdade.

## 1. Produto

Site oficial da **BrMoveToGo**, empresa de mudanças com atuação em mudanças internacionais e posicionamento atual também voltado a **Mudanças e Mini Mudanças**.

## 2. Objetivo de negócio

Apresentar os serviços, gerar confiança, captar leads e facilitar o contato comercial de pessoas que precisam realizar mudanças.

## 3. Posicionamento atual

A comunicação deve contemplar o foco comercial vigente:

**Mudanças e Mini Mudanças**

A operação também possui contexto de mudanças internacionais, incluindo Orlando/EUA. Não inventar rotas, coberturas, prazos ou serviços que não estejam confirmados.

## 4. Direção do site

- Profissional e confiável.
- Comunicação simples e comercial.
- Responsivo para desktop, tablet e mobile.
- CTA de orçamento/contato claramente visível.
- WhatsApp como canal comercial quando configurado.
- Evitar páginas excessivamente longas e conteúdo duplicado.

## 5. Conteúdo e conversão

Priorizar:

- clareza dos serviços;
- Mudanças e Mini Mudanças;
- mudanças internacionais quando aplicável;
- processo de contato/orçamento;
- diferenciais reais e comprováveis;
- CTA para falar com a equipe.

Não inventar avaliações, clientes, números de mudanças realizadas ou garantias.

## 6. Arquitetura técnica

O repositório ainda não contém a implementação oficial. Não definir stack, backend, banco ou infraestrutura antes da entrada/análise do código real.

## 7. Responsividade

A experiência deve funcionar corretamente em desktop, tablet e mobile, especialmente:

- menu;
- CTAs;
- formulários;
- WhatsApp;
- imagens;
- seções de serviços.

## 8. Segurança e privacidade

- Não expor secrets ou tokens.
- Dados de leads/clientes não devem ficar públicos.
- Formulários devem validar entrada.
- Integrações devem usar configuração segura.

## 9. Restrições críticas

**DO NOT:**

- inventar serviços, rotas, clientes ou métricas;
- expor informações privadas de processos/clientes;
- misturar informações jurídicas/operacionais confidenciais com conteúdo público do site;
- redesenhar identidade aprovada sem solicitação;
- adicionar dependências sem necessidade;
- quebrar fluxo de contato/orçamento.

## 10. Status atual

Repositório preparado para receber a implementação oficial do site.

### A validar após entrada do código

- stack atual;
- branding/assets oficiais;
- formulários;
- WhatsApp;
- SEO;
- analytics;
- domínio/deploy.

---

**Princípio de desenvolvimento:** `PATCH > REWRITE` · `REUSE > RECREATE` · `SIMPLE > COMPLEX` · `WORKING CODE > UNNECESSARY REFACTOR`

## 11. Produção e publicação

Arquitetura atual:

- **GitHub:** fonte oficial do código do site;
- **Amazon S3:** bucket `brmovetogo-site`;
- **Amazon CloudFront:** distribuição `E2K57WGDC7AHVV`;
- **Domínios:** `brmovetogo.com` e `www.brmovetogo.com`;
- **Default root object:** `index.html`.

Fluxo alvo de publicação:

```text
GitHub main
   ↓
GitHub Actions
   ↓
AWS OIDC / IAM Role
   ↓
S3 sync
   ↓
CloudFront invalidation
   ↓
Produção
```

O workflow automático deve ser ativado somente após a configuração do IAM Role/OIDC e da região AWS correspondente ao bucket.

### Portal do Cliente

- Header **Rastrear envio ↗** → `https://envios.brmovetogo.com/portaldocliente/`;
- Rodapé **Ajuda > Portal do Cliente** → mesma URL;
- Rodapé **Rastrear meu envio** permanece apontando para o rastreio público enquanto ele existir;
- o link administrativo para `https://envios.brmovetogo.com/` não deve ser exibido no site público.

