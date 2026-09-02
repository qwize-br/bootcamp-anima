# Brief — Simulado do ENEM versão Web

> **Caso modelo do bootcamp** — use como base se você não trouxe uma ideia própria.
> Cole no agente: *"use o caso modelo da pasta caso-modelo/ como base do brief"*.

## Problema
Estudantes se preparando para o ENEM raramente treinam em condições reais: os simulados existentes são soltos (sem timer), não cobrem as duas áreas por dia de prova e não mostram onde o estudante está fraco. Quem estuda às cegas perde tempo revisando o que já sabe.

## Público-alvo
Estudantes de ensino médio e cursinhos pré-ENEM (incluindo alunos da Ânima), acessando principalmente pelo celular.

## Solução proposta
Um **web app de simulado do ENEM** que reproduz a prova real: dois blocos por dia de simulado (Linguagens/Ciências Humanas + Redação, Matemática/Ciências da Natureza), com **timer de 4h30 por bloco**, navegação entre questões, correção automática e **diagnóstico de desempenho por área do conhecimento**.

## Objetivos e sucesso
- Estudante completa um simulado completo em condições de prova real
- Recebe, ao final, um raio-x do desempenho por área (com acertos/erros)
- Consegue revisar somente as questões que errou, com gabarito comentado

## Dentro do escopo (MVP)
- Simulado com banco de questões pré-cadastrado (ex.: 90 questões por bloco, em JSON)
- Timer por bloco, marcar questão para revisar, responder e avançar
- Correção automática + resultado geral e por área
- Tela de revisão com gabarito comentado das questões erradas
- Funciona bem no celular (responsivo)

## Fora do escopo (MVP)
- Contas/login, histórico entre sessões (dados ficam na sessão/localStorage)
- Redação com correção automática
- Cadastro de questões pela interface (banco vem pronto, em arquivo)

## Restrições
- Idioma: português (BR)
- Rodar como site web simples (pode ser estático) — sem servidor pesado no MVP
- Conteúdo das questões: lícito e autoral (ou de uso liberado), com referência à área do ENEM

---

*DTCOM × NoCode × QWize — caso modelo para o bootcamp Hackathon Ânima*