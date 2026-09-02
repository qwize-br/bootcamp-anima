# ▶️ COMECE AQUI — copie o prompt abaixo e cole no seu agente (Codex ou Antigravity)

> Antes de colar, complete a última linha com a ideia do **seu** projeto.

---

```text
Instale o Wize Dev Kit da QWize neste projeto:

1. Configure o git deste repositório: pergunte a mim o meu nome e e-mail (para os commits) e rode:
   git config user.name "<MEU NOME>" && git config user.email "<MEU E-MAIL>"

2. Rode a instalação:
   npx -y wize-dev-kit install --yes --directory "$(pwd)"

3. Confirme que a pasta .wize/ e o arquivo AGENTS.md foram criados, e me diga quando a instalação terminar.

4. Agora inicie o ciclo de planejamento: use o agente de brief (wize-product-brief) para me ENTREVISTAR sobre a ideia do projeto — uma pergunta por vez, em português simples — e, ao final, gere o arquivo .wize/planning/brief.md e me apresente um resumo dele.

A ideia do meu projeto é: [ESCREVA AQUI A SUA IDEIA — ou cole: "use o caso modelo do Simulado do ENEM versão Web, na pasta caso-modelo/, lendo caso-modelo/brief.md e caso-modelo/prd.md como base do brief e do PRD"]
```

---

## Depois da instalação (Prática 2)

Quando o brief estiver pronto, cole este segundo prompt:

```text
Agora evolua do brief para o PRD: use o agente de PM (wize-agent-pm) para gerar o .wize/planning/prd.md com critérios de aceite numerados (formato AC-XX-N, cada um no formato "Dado que…, quando…, então…"). Depois, quebre em épicos e stories pequenos na pasta .wize/solutioning/ seguindo o fluxo do kit. Ao final, me mostre um resumo do PRD e da lista de épicos.
```

> 💡 **Dica:** a IA pode te perguntar coisas que você não sabe responder. Não sabe? Responda "não sei, sugira você" — o agente propõe e você aprova. Assim se trabalha com IA.