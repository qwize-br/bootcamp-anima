---
status: ready-for-dev
author: Tony Stark + Maria Hill
created: 2026-09-09
target_agents:
  - Shuri (Senior Developer / Implementer)
  - Hawkeye (Test Architect / TEA)
sprint_ref: .wize/implementation/sprint-status.yaml
---

# Documento de Handoff — Simulado Enem Aprovejá

> **Instrução para os Agentes de Implementação (Shuri & Hawkeye):**
> Este documento consolida todo o alinhamento de negócio, critérios de aceite, decisões de UX e contratos técnicos para a implementação da aplicação. Antes de codificar qualquer arquivo, leia as diretrizes deste handoff.

---

## 1. Fontes Canônicas de Verdade

| Artefato | Caminho | Finalidade |
| :--- | :--- | :--- |
| **Mockup de Referência** | [mockup.html](file:///home/andrefrd/bootcamp-anima/mockup.html) | **Gabarito visual e comportamental**. O design system, hierarquia tipográfica, layout mobile e espaçamentos validados pelo usuário devem ser replicados fielmente. |
| **Brief de Produto** | [.wize/planning/brief.md](file:///home/andrefrd/bootcamp-anima/.wize/planning/brief.md) | Visão, público-alvo, metas e não-metas. |
| **PRD Canônico** | [.wize/planning/prd.md](file:///home/andrefrd/bootcamp-anima/.wize/planning/prd.md) | Critérios de Aceite (ACs) no formato `Dado/Quando/Então`. |
| **Arquitetura Técnica** | [.wize/solutioning/architecture.md](file:///home/andrefrd/bootcamp-anima/.wize/solutioning/architecture.md) | Estrutura de dados, modelo TRI 3PL, persistência no `localStorage` e árvore de arquivos. |
| **Backlog de Sprints** | [.wize/implementation/sprint-status.yaml](file:///home/andrefrd/bootcamp-anima/.wize/implementation/sprint-status.yaml) | Status de execução de cada história (E01 a E06). |

---

## 2. Decisões de Produto & Regras Críticas

1. **Escopo Fixo de 90 Questões:**
   - Apenas simulados integrais de 90 questões cronometradas em 4h30 (16.200s). Não há simulado curto no MVP.
2. **Sem Redação no MVP:**
   - O Dia 1 é composto estritamente pelas 90 questões de múltipla escolha (Linguagens + Humanas).
3. **Layout Mobile Desencavalado:**
   - Barra superior (topbar) compacta (52px).
   - Sub-header de questão balanceado: indicador "Questão X de 90" e badge de área à esquerda; botão "Revisar depois" compacto à direita, **sem encavalar**.
4. **Navegação Sequencial Limpa:**
   - Botões "← Anterior", "Finalizar Prova" e "Próxima →". Não utilizar grid lateral de 90 botões.
5. **Modal de Confirmação Obrigatório:**
   - Ao clicar em "Finalizar Prova", exibir alerta com total exato de questões em branco e marcadas para revisão.
6. **Motor Matemático TRI Oficial (Modelo Logístico 3PL):**
   - Estimação de proficiência com parâmetros de discriminação ($a$), dificuldade ($b$) e casualidade ($c$).
   - Conversão direta para a escala ENEM (0–1000 pontos).
7. **Diagnóstico Pedagógico Rico na Tela de Resultados:**
   - **Pontos Fortes:** Elogio explícito e lista de temas dominados com alta taxa de acerto.
   - **Atenção Prioritária (Déficits):** Lista cirúrgica dos conteúdos onde os erros se concentraram com indicador "Revisão Urgente".
   - **Guia de Estudo Recomendado:** Passos acionáveis de revisão teórica e exercícios.
8. **Revisão Contínua de Questões:**
   - Lista vertical de questões resolvidas com alternância de filtro ("Todas" vs "Apenas Erros").
   - Destaque em vermelho para erro do aluno, verde para gabarito oficial e caixa didática de justificativa.
9. **Resiliência Total:**
   - Estado armazenado na chave `simulado_enem_state_v1` do `localStorage`. Tolerância a reload ou fechamento acidental da aba.

---

## 3. Arquitetura Alvo & Divisão de Módulos

```text
/
├── index.html                  # App Shell semântico e viewport mobile
├── src/
│   ├── css/
│   │   ├── reset.css           # Normalização de estilos
│   │   ├── tokens.css          # Paleta de cores, raio de borda, tipografia (Plus Jakarta Sans + Space Grotesk)
│   │   └── app.css             # Componentes, header fixo, cards de questão, diagnóstico e revisão
│   ├── js/
│   │   ├── app.js              # Inicialização, router de telas e orquestração de eventos
│   │   ├── storage.js          # Driver do localStorage (leitura, escrita atômica, reset)
│   │   ├── timer.js            # Engine de cronômetro (drift-safe com timestamp real)
│   │   ├── tri-engine.js       # Algoritmo matemático TRI (3PL) e conversão para escala 0–1000
│   │   ├── diagnostic.js       # Classificador temático de pontos fortes, déficits e guia de estudo
│   │   └── ui.js               # Renderizadores da questão, alternativas, modais e lista contínua
│   └── data/
│       ├── dia-1.json          # 90 questões (Linguagens + Humanas) com topic e study_reference
│       └── dia-2.json          # 90 questões (Natureza + Matemática) com topic e study_reference
```

---

## 4. Contrato de Validação para Testes (Hawkeye / TEA)

Cada história deve ter sua conformidade verificada contra os ACs do PRD:
- **Testes Unitários:**
  - `tri-engine.test.js`: Validar cálculo da probabilidade 3PL, clamp nos limites de nota (300 a 1000) e penalização de acertos casuais.
  - `diagnostic.test.js`: Validar agrupamento por `topic`, cálculo percentual e threshold de pontos fortes ($\ge 80\%$) vs prioritários ($\le 50\%$).
  - `storage.test.js`: Validar serialização/deserialização e recuperação de sessão interrompida.
- **Testes de Integração / E2E (Playwright ou automação de navegador):**
  - Fluxo completo: Home → Seleção de Dia → Responder 90 questões → Finalizar Prova via Modal → Visualizar Raio-X TRI e Diagnóstico → Acessar Revisão e filtrar erros.
  - Teste de Reload: Recarregar página na questão 15 com 4h10m restantes e verificar persistência intacta.

---

## 5. Protocolo de Git e Execução

- **Branch de Trabalho:** `feature/simulado-enem` (PROIBIDO COMMITS DIRETOS NA `main`).
- **Padrão de Commits Semânticos:**
  - `feat: ...`, `fix: ...`, `test: ...`, `docs: ...` referenciando os IDs das stories (ex: `feat(exam): renderizador compacto de questoes (E02-S02)`).
- **Finalização:** Ao concluir a implementação das stories do sprint, realizar push da branch e orientar o usuário a abrir o Pull Request no GitHub.
