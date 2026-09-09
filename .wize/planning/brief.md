---
status: ready-for-prd
owner: Pepper Potts
created: 2026-09-09
---

# Brief — Simulado Enem Aprovejá

## Vision
Um web app leve, responsivo e focado em mobile que simula com fidedignidade as condições reais de prova do ENEM (90 questões cronometradas em 4h30 por dia de prova) e gera um diagnóstico com nota estimada por TRI e revisão comentada de erros para estudantes do ensino médio e pré-vestibulandos.

## Audience
- **Primary:** Estudantes de ensino médio e cursinhos pré-ENEM (incluindo alunos da rede Ânima) que precisam treinar velocidade, resistência e diagnosticar lacunas de conhecimento no celular.
- **Secondary:** Professores e mentores pedagógicos que recomendam ferramentas de treino sob pressão de tempo.
- **Stakeholders:** Coordenação do Bootcamp Hackathon Ânima, DTCOM e QWize.

## Success criteria
1. **Completude do ciclo:** 100% dos usuários conseguem iniciar, responder 90 questões cronometradas, finalizar voluntariamente ou por tempo esgotado e receber a nota.
2. **Resiliência a falhas:** 0 perda de progresso em caso de reload ou fechamento acidental da aba (`localStorage` preserva respostas e timer).
3. **Diagnóstico fidedigno:** Exibição imediata da nota TRI estimada (0 a 1000) por área do conhecimento e acertos brutos.
4. **Revisão ativa:** Lista contínua de questões com marcação visual clara de erro (vermelho), gabarito (verde) e justificativa comentada.
5. **Responsividade:** TTI < 1.5s e layout 100% legível em dispositivos móveis (360px a 430px de largura).

## Non-goals (Fora do MVP)
- Simulado curto/rápido (apenas o formato oficial completo de 90 questões).
- Redação e correção textual (foco estrito nas questões objetivas).
- Autenticação, login e histórico em nuvem entre sessões/dispositivos (dados locais ao navegador).
- Painel administrativo de cadastro de questões (questões carregadas via JSON estático com dados reais do ENEM).
- Exibição de estatísticas complexas de coerência pedagógica ao usuário final (apenas nota TRI final e acertos).

## Constraints
- **Stack:** Web estática moderna, Vanilla CSS/JS sem frameworks pesados, rodando no navegador do cliente sem dependência de backend para o exame.
- **Dados:** Questões oficiais do ENEM (baseadas nos datasets de domínio público/pesquisa como `maritaca-ai/enem`).
- **Idioma:** Português do Brasil (pt-BR).
- **Tempo por bloco:** 4h30 (16.200 segundos) regressivos contínuos.

## Open questions
- Nenhuma questão bloqueadora aberta. Entendimento 100% alinhado.
