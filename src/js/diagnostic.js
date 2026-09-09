/**
 * Motor de Diagnóstico Pedagógico
 * Identifica Pontos Fortes, Atenção Prioritária (Déficits) e Gera Guia de Estudos
 */

/**
 * Analisa as respostas por tópico e gera o diagnóstico pedagógico completo
 * @param {Array<Object>} questions - Banco de questões original com topics e study_reference
 * @param {Array<Object>} responses - Respostas processadas com flags de acerto
 * @returns {Object} { strengths: Array, priorityFocus: Array, studyGuide: Array }
 */
export function generatePedagogicalDiagnostic(questions, responses) {
  // Mapa de referências de estudo por tópico
  const topicReferences = {};
  for (const q of questions) {
    if (q.topic && q.study_reference && !topicReferences[q.topic]) {
      topicReferences[q.topic] = {
        discipline: q.discipline,
        area: q.area,
        study_reference: q.study_reference
      };
    }
  }

  // Agrupamento de acertos/erros por tópico
  const topicStats = {};
  for (const r of responses) {
    const topic = r.topic || 'Conhecimentos Gerais';
    if (!topicStats[topic]) {
      topicStats[topic] = {
        topic,
        area: r.area,
        discipline: r.discipline,
        total: 0,
        correct: 0,
        wrong: 0,
        avgDifficulty: 0,
        sumB: 0
      };
    }

    topicStats[topic].total++;
    topicStats[topic].sumB += (r.b ?? 0);
    if (r.correct) {
      topicStats[topic].correct++;
    } else {
      topicStats[topic].wrong++;
    }
  }

  const topicList = Object.values(topicStats).map(t => {
    const percentage = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
    const avgDifficulty = t.total > 0 ? t.sumB / t.total : 0;
    return {
      ...t,
      percentage,
      avgDifficulty
    };
  });

  // Pontos Fortes: tópicos com acerto >= 75% e pelo menos 2 questões (ou >= 80% no geral)
  const strengths = topicList
    .filter(t => (t.percentage >= 75 && t.total >= 2) || t.percentage >= 80)
    .sort((a, b) => b.percentage - a.percentage || b.total - a.total)
    .slice(0, 5)
    .map(s => ({
      topic: s.topic,
      discipline: s.discipline,
      percentage: s.percentage,
      correct: s.correct,
      total: s.total,
      badge: `${s.percentage}% de acertos`
    }));

  // Se o aluno acertou muitas e não sobrou temas no critério estrito, pegar os top aproveitamentos
  if (strengths.length === 0) {
    const topTopics = [...topicList].sort((a, b) => b.percentage - a.percentage).slice(0, 3);
    for (const t of topTopics) {
      if (t.percentage > 0) {
        strengths.push({
          topic: t.topic,
          discipline: t.discipline,
          percentage: t.percentage,
          correct: t.correct,
          total: t.total,
          badge: `${t.percentage}% de acertos`
        });
      }
    }
  }

  // Atenção Prioritária (Déficits): tópicos com taxa de acerto <= 60% com prioridade para maior número de erros
  const priorityFocus = topicList
    .filter(t => t.wrong > 0 && t.percentage <= 65)
    .sort((a, b) => b.wrong - a.wrong || a.percentage - b.percentage)
    .slice(0, 5)
    .map(d => ({
      topic: d.topic,
      discipline: d.discipline,
      percentage: d.percentage,
      wrong: d.wrong,
      total: d.total,
      badge: 'Revisão Urgente',
      summary: `Errou ${d.wrong} de ${d.total} questões deste tema`
    }));

  // Guia de Estudo Contextual: gerado a partir dos tópicos prioritários
  const studyGuide = [];
  const focusForGuide = priorityFocus.length > 0 ? priorityFocus : topicList.filter(t => t.wrong > 0).slice(0, 3);

  focusForGuide.forEach((item, index) => {
    const meta = topicReferences[item.topic];
    const refText = meta?.study_reference || `Módulo de ${item.discipline}: Revisão aprofundada de ${item.topic}`;
    studyGuide.push({
      step: index + 1,
      topic: item.topic,
      discipline: item.discipline,
      action: `Revise **${item.topic}** (${refText}).`,
      recommendation: `Pratique questões comentadas focando em identificar os distratores mais comuns de ${item.topic}.`
    });
  });

  return {
    strengths,
    priorityFocus,
    studyGuide
  };
}
