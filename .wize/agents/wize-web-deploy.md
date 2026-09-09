# Web Deploy Playbook

> Use quando o projeto web estiver pronto para deploy e precisar do playbook de publicação.

# Web Deploy Playbook

**Goal.** Document the deploy path: provider, environments, secrets, rollback.

## Inputs
- `.wize/solutioning/architecture.md`
- `.wize/planning/nfr-principles.md` (cost, reliability)

## Output
- `.wize/solutioning/deploy/web-deploy.md`

## Sections
- Provider (Vercel / Cloudflare / Fly / self-hosted Coolify / etc.)
- Environments (dev / preview / prod)
- Secrets management
- Build/deploy commands
- Smoke checks
- Rollback procedure
