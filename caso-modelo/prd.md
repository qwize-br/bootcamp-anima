# PRD — Simulado do ENEM versão Web

> **Caso modelo do bootcamp** — exemplo de PRD no formato do Wize Dev Kit (ACs numerados, sem estimativas).
> Cada AC usa o formato **"Dado que…, quando…, então…"** — assim a IA (e qualquer pessoa) sabe exatamente o que "pronto" significa.

## Visão do produto
Web app de simulado ENEM com prova cronometrada, correção automática e diagnóstico por área, funcionando em celular e desktop.

## Critérios de aceite (ACs)

### Epic 01 — Entrar no simulado
- **AC-01-1:** Dado que acesso o app, quando a página carrega, então vejo a tela inicial com o nome do simulado, as instruções da prova e o botão "Começar".
- **AC-01-2:** Dado que estou na tela inicial, quando clico em "Começar", então escolho o bloco (Dia 1: Linguagens + Ciências Humanas; Dia 2: Matemática + Ciências da Natureza) e a prova abre no cronômetro.

### Epic 02 — Fazer a prova
- **AC-02-1:** Dado que a prova abriu, quando o cronômetro inicia, então conto regressivamente a partir de 4h30 e vejo o tempo restante em todos os momentos.
- **AC-02-2:** Dado que estou na prova, quando vejo uma questão, então enxergo o enunciado, o texto de apoio (se houver) e as 5 alternativas (A–E).
- **AC-02-3:** Dado que estou em uma questão, quando seleciono uma alternativa, então minha escolha fica marcada e posso navegar para qualquer outra questão (anterior/próxima ou pelo mapa de questões).
- **AC-02-4:** Dado que estou em uma questão, quando marco "revisar depois", então a questão fica sinalizada no mapa de questões.
- **AC-02-5:** Dado que o cronômetro zera, quando ainda estou na prova, então a prova é finalizada automaticamente e vou para a correção (com o que foi respondido até ali).

### Epic 03 — Correção e resultado
- **AC-03-1:** Dado que finalizei a prova (voluntariamente ou pelo tempo), quando a correção roda, então vejo minha pontuação geral em acertos e percentual.
- **AC-03-2:** Dado que a correção saiu, quando vejo o resultado, então o desempenho está detalhado **por área do conhecimento** (Linguagens, Ciências Humanas, Ciências da Natureza, Matemática).

### Epic 04 — Revisão
- **AC-04-1:** Dado que recebi o resultado, quando entro na revisão, então consigo ver questão por questão: minha resposta, o gabarito correto e o comentário explicativo.
- **AC-04-2:** Dado que estou na revisão, quando uso o filtro "só as que errei", então vejo apenas as questões erradas com o comentário do gabarito.

### Epic 05 — Qualidade de uso
- **AC-05-1:** Dado que acesso o app pelo celular, quando navego por qualquer tela, então o layout se adapta a tela pequena sem quebrar leitura ou botões.
- **AC-05-2:** Dado que recarrego a página no meio da prova, quando o app volta, então minhas respostas e o tempo restante são preservados (localStorage).

## Restrições e notas
- Banco de questões vem pronto em arquivo (JSON) — sem cadastro pela interface no MVP.
- Sem login/histórico no MVP (fora do escopo do brief).
- **Regra do kit:** sem estimativas — a única medida é "cabe em 1 PR?" (stories pequenas).
- Idioma: pt-BR.

## Done means (por story)
AC do PRD com verificação passando; story `ready-for-review`; gate do kit sem bloqueios.

---

*DTCOM × NoCode × QWize — caso modelo para o bootcamp Hackathon Ânima*