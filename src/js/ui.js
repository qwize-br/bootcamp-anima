/**
 * Renderizador de UI para o Simulado Enem Aprovejá
 */

export function renderQuestion(question, selectedOption = null, isFlagged = false) {
  const container = document.getElementById('screen-exam');
  if (!container || !question) return;

  const indexLabel = document.getElementById('question-index-label');
  const areaLabel = document.getElementById('question-area-label');
  const flagBtn = document.getElementById('btn-flag-review');
  const contextEl = document.getElementById('q-context');
  const stemEl = document.getElementById('q-stem');
  const optionsEl = document.getElementById('q-options');

  if (indexLabel) indexLabel.textContent = `Questão ${question.index} de 90`;
  if (areaLabel) areaLabel.textContent = `${question.area} • ${question.discipline}`;

  if (flagBtn) {
    flagBtn.classList.toggle('active-flag', Boolean(isFlagged));
    flagBtn.innerHTML = isFlagged ? '🚩 Marcada' : '🔖 Revisar depois';
  }

  if (contextEl) {
    contextEl.textContent = question.context || '';
    contextEl.style.display = question.context ? 'block' : 'none';
  }

  if (stemEl) {
    stemEl.textContent = question.question;
  }

  if (optionsEl) {
    optionsEl.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E'];

    letters.forEach(letter => {
      const text = question.options[letter];
      if (!text) return;

      const item = document.createElement('div');
      item.className = 'option-item';
      if (selectedOption === letter) {
        item.classList.add('selected');
      }

      item.innerHTML = `
        <span class="option-key">${letter}</span>
        <span class="option-text">${text}</span>
      `;

      item.addEventListener('click', () => {
        document.querySelectorAll('#q-options .option-item').forEach(it => it.classList.remove('selected'));
        item.classList.add('selected');
        document.dispatchEvent(new CustomEvent('exam:option-selected', { detail: { letter } }));
      });

      optionsEl.appendChild(item);
    });
  }
}

export function renderResults(results, diagnostic) {
  const generalScoreEl = document.getElementById('result-general-score');
  const generalSummaryEl = document.getElementById('result-general-summary');
  const areasGridEl = document.getElementById('result-areas-grid');
  const strengthsListEl = document.getElementById('result-strengths-list');
  const focusListEl = document.getElementById('result-focus-list');
  const studyGuideEl = document.getElementById('result-study-guide');

  if (generalScoreEl) generalScoreEl.textContent = results.generalScore.toFixed(1);
  if (generalSummaryEl) {
    generalSummaryEl.innerHTML = `Você acertou <strong>${results.totalCorrect} de ${results.totalQuestions} questões</strong> (${results.overallPercentage}%)`;
  }

  if (areasGridEl) {
    areasGridEl.innerHTML = '';
    Object.values(results.areas).forEach(area => {
      const card = document.createElement('div');
      card.className = 'area-card';
      card.innerHTML = `
        <div class="area-card-title">${area.name}</div>
        <div class="area-card-score">${area.score.toFixed(1)} <span style="font-size: 0.75rem; font-weight: normal; color: #94A3B8;">pts TRI</span></div>
        <div class="area-card-ratio">${area.correct}/${area.total} acertos (${area.percentage}%)</div>
      `;
      areasGridEl.appendChild(card);
    });
  }

  // Pontos Fortes
  if (strengthsListEl) {
    strengthsListEl.innerHTML = '';
    if (diagnostic.strengths.length === 0) {
      strengthsListEl.innerHTML = `<div class="topic-item"><span class="topic-name">Continue praticando para consolidar seus pontos fortes.</span></div>`;
    } else {
      diagnostic.strengths.forEach(s => {
        const item = document.createElement('div');
        item.className = 'topic-item';
        item.innerHTML = `
          <span class="topic-name">${s.topic} (${s.discipline})</span>
          <span class="topic-tag tag-mastered">${s.badge}</span>
        `;
        strengthsListEl.appendChild(item);
      });
    }
  }

  // Atenção Prioritária (Déficits)
  if (focusListEl) {
    focusListEl.innerHTML = '';
    if (diagnostic.priorityFocus.length === 0) {
      focusListEl.innerHTML = `<div class="topic-item"><span class="topic-name">Nenhum déficit crítico identificado! Excelente desempenho geral.</span></div>`;
    } else {
      diagnostic.priorityFocus.forEach(f => {
        const item = document.createElement('div');
        item.className = 'topic-item';
        item.innerHTML = `
          <div>
            <div class="topic-name">${f.topic} (${f.discipline})</div>
            <div style="font-size: 0.7rem; color: #94A3B8;">${f.summary}</div>
          </div>
          <span class="topic-tag tag-urgent">${f.badge}</span>
        `;
        focusListEl.appendChild(item);
      });
    }
  }

  // Guia de Estudo
  if (studyGuideEl) {
    studyGuideEl.innerHTML = '';
    if (diagnostic.studyGuide.length === 0) {
      studyGuideEl.innerHTML = `Mantenha o ritmo realizando simulados periódicos para sustentar sua proficiência.`;
    } else {
      let html = `<strong>📚 Guia de Estudo Recomendado:</strong><div style="margin-top: 6px; display: flex; flex-direction: column; gap: 6px;">`;
      diagnostic.studyGuide.forEach(g => {
        html += `<div><strong>${g.step}.</strong> ${g.action} <span style="color: #94A3B8;">${g.recommendation}</span></div>`;
      });
      html += `</div>`;
      studyGuideEl.innerHTML = html;
    }
  }
}

export function renderReviewList(questions, answers, onlyErrors = false) {
  const container = document.getElementById('review-items-container');
  const pillAll = document.getElementById('pill-all');
  const pillErrors = document.getElementById('pill-errors');

  if (!container) return;

  let totalQuestions = questions.length;
  let totalErrors = 0;

  const itemsData = questions.map(q => {
    const chosen = answers[q.id];
    const isAnswered = chosen !== undefined && chosen !== null && chosen !== '';
    const isCorrect = isAnswered && chosen === q.correct;
    if (!isCorrect) totalErrors++;

    return {
      question: q,
      chosen,
      isAnswered,
      isCorrect
    };
  });

  if (pillAll) pillAll.textContent = `Todas (${totalQuestions})`;
  if (pillErrors) pillErrors.textContent = `Apenas Erros (${totalErrors})`;

  container.innerHTML = '';

  itemsData.forEach(item => {
    const { question, chosen, isAnswered, isCorrect } = item;
    if (onlyErrors && isCorrect) return;

    const div = document.createElement('div');
    div.className = 'review-item';
    div.dataset.type = isCorrect ? 'correct' : 'wrong';

    let statusBadgeClass = isCorrect ? 'status-correct' : (isAnswered ? 'status-wrong' : 'status-blank');
    let statusText = isCorrect 
      ? `✓ Questão ${question.index} — Você acertou` 
      : (isAnswered ? `✕ Questão ${question.index} — Você errou` : `⚠️ Questão ${question.index} — Em branco`);

    let userResponseHtml = '';
    if (isAnswered) {
      const chosenText = question.options[chosen] || '';
      userResponseHtml = `
        <div class="review-choice ${isCorrect ? 'choice-correct' : 'choice-wrong'}">
          <strong>Sua resposta:</strong> ${chosen}) ${chosenText}
        </div>
      `;
    } else {
      userResponseHtml = `
        <div class="review-choice" style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); color: #FCD34D;">
          <strong>Sua resposta:</strong> Nenhuma alternativa selecionada (Em branco)
        </div>
      `;
    }

    const correctText = question.options[question.correct] || '';
    const correctResponseHtml = `
      <div class="review-choice choice-correct">
        <strong>Gabarito oficial:</strong> ${question.correct}) ${correctText}
      </div>
    `;

    div.innerHTML = `
      <div class="review-badge-status ${statusBadgeClass}">${statusText}</div>
      <div style="font-size: 0.72rem; color: #94A3B8; margin-bottom: 6px;">
        ${question.area} • ${question.discipline} • ${question.topic}
      </div>
      ${question.context ? `<div class="support-text" style="margin-bottom: 8px;">${question.context}</div>` : ''}
      <div class="question-stem" style="margin-bottom: 10px;">${question.question}</div>
      ${userResponseHtml}
      ${!isCorrect ? correctResponseHtml : ''}
      <div class="explanation-box">
        <div class="explanation-title">💡 Justificativa Didática</div>
        ${question.explanation}
      </div>
    `;

    container.appendChild(div);
  });
}
