---
status: validated
owner: Maria Hill
created: 2026-09-09
---

# PRD — Simulado Enem Aprovejá

## Visão do Produto
Web app focado em mobile para realização de simulado fiel ao exame real do ENEM com 90 questões de múltipla escolha (A–E) cronometradas em 4h30 por dia de prova, correção automática com cálculo de nota estimada pela Teoria de Resposta ao Item (TRI) e tela de revisão contínua com comentários explicativos.

## Metas
1. **Fidelidade de Exame:** Simular a pressão de tempo real do ENEM com cronômetro contínuo de 4h30 para 90 questões.
2. **Resiliência de Estado:** Garantir tolerância zero a recarregamento acidental do navegador com persistência no `localStorage`.
3. **Avaliação TRI Realista:** Exibir pontuação calculada por modelo TRI logístico (escala 0–1000) discriminando acertos por área de conhecimento.
4. **Aprendizado Ativo no Erro:** Prover fluxo direto de revisão contínua com contraste visual (vermelho para erro do aluno, verde para gabarito) e justificativa didática.

## Escopo

### In Scope
- **Seleção de Bloco:** Escolha entre Dia 1 (Linguagens e Códigos + Ciências Humanas) e Dia 2 (Ciências da Natureza + Matemática), cada um com 90 questões oficiais.
- **Ambiente de Prova:**
  - Header fixo com cronômetro regressivo contínuo (iniciando em 04:30:00).
  - Indicador sequencial de questão ("Questão X de 90") e botão de marcação "Revisar Depois".
  - Exibição de enunciado, texto base/apoio e 5 alternativas (A, B, C, D, E).
  - Navegação linear ("Anterior" / "Próxima").
- **Finalização e Alerta:**
  - Botão "Finalizar Prova" com modal de confirmação indicando total de questões em branco e marcadas para revisão.
  - Finalização automática imediata caso o cronômetro atinja 00:00:00.
- **Relatório e Diagnóstico Didático Enriquecido:**
  - Nota geral e nota por área de conhecimento estimada pelo modelo TRI (escala 0–1000).
  - Total de acertos brutos e percentual por área.
  - Reconhecimento explícito dos **Pontos Fortes** (temas com alta taxa de acerto e consistência TRI).
  - Mapeamento de **Atenção Prioritária (Déficits)** com identificação cirúrgica dos tópicos com mais erros.
  - **Plano de Ação Didático** com recomendação contextual de materiais e tópicos de revisão.
- **Revisão de Prova:**
  - Visualização em lista contínua das questões.
  - Filtro "Apenas Erros" ativado por padrão ou selecionável.
  - Destaque em vermelho da alternativa assinalada pelo aluno (em caso de erro) e em verde do gabarito oficial com comentário pedagógico.

### Out of Scope
- Simulado rápido / reduzido (somente o modelo integral de 90 questões).
- Redação e correção textual dissertativa.
- Autenticação/login e sincronização em banco de dados na nuvem (dados 100% locais no navegador).
- Painel para criação/edição dinâmica de questões por professores.
- Painel lateral em grade de 90 botões (adotada navegação sequencial limpa no topo).

---

## Critérios de Aceite (ACs)

### Epic 01 — Recepção e Início do Simulado
- **AC-01-1:** Dado que o estudante acessa o app, Quando a tela inicial é renderizada, Então visualiza o título "Simulado Enem Aprovejá", instruções resumidas da prova, escolha do dia (Dia 1 ou Dia 2) e o botão "Iniciar Prova".
- **AC-01-2:** Dado que o estudante seleciona o bloco e clica em "Iniciar Prova", Quando o simulado é instanciado, Então o banco de 90 questões correspondente é carregado, o cronômetro inicia em 4h30m00s e a Questão 1 é exibida.

### Epic 02 — Realização da Prova e Cronometragem
- **AC-02-1:** Dado que a prova está em andamento, Quando cada segundo transcorre, Então o cronômetro no topo decrementa em tempo real e persiste o tempo restante no `localStorage`.
- **AC-02-2:** Dado que o estudante lê uma questão, Quando observa a interface, Então visualiza o enunciado formatado, textos de suporte e as alternativas de A a E em layout mobile compacto sem rolagem excessiva.
- **AC-02-3:** Dado que o estudante clica em uma alternativa, Quando a opção é selecionada, Então a escolha é salva de imediato no estado e no `localStorage`.
- **AC-02-4:** Dado que o estudante clica em "Revisar depois", Quando a flag é alternada, Então o botão compacto à direita do sub-header reflete o estado ativo sem encavalar com o título da questão ou badge de área.
- **AC-02-5:** Dado que o estudante navega pelos botões "Anterior" e "Próxima", Quando clica em um deles, Então a questão correspondente é exibida mantendo as respostas já gravadas.

### Epic 03 — Finalização e Confirmação
- **AC-03-1:** Dado que o estudante clica em "Finalizar Prova", Quando restam questões não respondidas ou marcadas para revisão, Então um modal de confirmação é aberto exibindo a contagem exata de questões em branco e marcadas para revisão, com opções "Continuar" e "Entregar".
- **AC-03-2:** Dado que o cronômetro regressivo atinge 00:00:00, Quando o tempo se esgota, Então a prova é finalizada automaticamente sem necessidade de clique do usuário e o app transiciona para o cálculo de resultado.

### Epic 04 — Motor de Correção TRI e Diagnóstico Pedagógico
- **AC-04-1:** Dado que a prova foi finalizada, Quando o motor de correção executa, Então calcula a nota estimada pelo modelo logístico de TRI (0 a 1000) ponderando parâmetros de dificuldade e acerto ao acaso para cada uma das áreas do bloco.
- **AC-04-2:** Dado que o cálculo concluiu, Quando a tela de resultados é exibida, Então o aluno vê a Nota Geral estimada TRI, o total de acertos brutos e o card analítico por área do conhecimento.
- **AC-04-3:** Dado que a tela de resultados é exibida, Quando o diagnóstico pedagógico é gerado, Então exibe a seção de **Pontos Fortes** com temas de maior aproveitamento e a seção de **Atenção Prioritária** listando os tópicos de maior índice de erro.
- **AC-04-4:** Dado que existem temas na seção de Atenção Prioritária, Quando o estudante analisa seu déficit, Então visualiza um **Guia de Estudo Recomendado** com materiais sugeridos para revisão imediata.

### Epic 05 — Revisão Contínua e Justificativa Didática
- **AC-05-1:** Dado que o estudante clica em "Revisar Questões" a partir do resultado, Quando a tela de revisão abre, Então visualiza uma lista contínua com as questões resolvidas, destacando a resposta selecionada pelo estudante (vermelho se errou) e o gabarito oficial (verde).
- **AC-05-2:** Dado que o estudante está na revisão, Quando o filtro "Apenas Erros" é acionado, Então a lista oculta questões acertadas e mostra apenas os erros com suas justificativas didáticas comentadas.

### Epic 06 — Resiliência de Sessão e Responsividade Mobile
- **AC-06-1:** Dado que o estudante está no meio da prova e recarrega a página ou fecha o navegador, Quando retorna à URL da aplicação, Então o simulado retoma na mesma questão, com o tempo restante exato preservado e todas as respostas assinaladas intactas.
- **AC-06-2:** Dado um viewport mobile típico (360px a 430px de largura), Quando o aluno interage com qualquer tela, Então não ocorre rolagem horizontal indesejada e todos os textos e botões permanecem confortáveis para leitura e toque.

---

## Restrições e Dados
- **Fontes de Questões:** Dataset de questões oficiais do ENEM (formato JSON, baseado nas compilações abertas `maritaca-ai/enem` / INEP).
- **Arquitetura:** Aplicação Web estática executada no navegador do cliente (SPA em Vanilla JS ou Vite bundle leve).
- **Idioma:** pt-BR.
- **Tamanho das Histórias:** Cada história fatiada em Phase 3 deve caber em 1 Pull Request atômico com testes.
