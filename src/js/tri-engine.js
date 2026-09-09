/**
 * Motor de Cálculo da Teoria de Resposta ao Item (TRI)
 * Modelo Logístico de 3 Parâmetros (3PL) do ENEM
 */

export const TRI_CONST_D = 1.7;

/**
 * Calcula a probabilidade de acerto Pi(theta) segundo o modelo 3PL:
 * P_i(theta) = c_i + (1 - c_i) / (1 + exp(-D * a_i * (theta - b_i)))
 * 
 * @param {number} theta - Proficiência na escala normalizada (~ -3 a +3)
 * @param {number} a - Parâmetro de discriminação
 * @param {number} b - Parâmetro de dificuldade
 * @param {number} c - Parâmetro de acerto ao acaso (chute)
 * @returns {number} Probabilidade de acerto entre c e 1
 */
export function calculateProbability3PL(theta, a, b, c) {
  const z = -TRI_CONST_D * a * (theta - b);
  // Evitar overflow exponencial
  if (z > 30) return c;
  if (z < -30) return 1;
  const expZ = Math.exp(z);
  return c + (1 - c) / (1 + expZ);
}

/**
 * Estima a proficiência (theta) do estudante a partir das respostas dadas aos itens.
 * Utiliza o método de Máxima Verossimilhança / Newton-Raphson com regularização Bayesiana (EAP simplificado).
 * 
 * @param {Array<{ correct: boolean, a: number, b: number, c: number }>} responses
 * @param {number} initialTheta - Estimativa inicial
 * @returns {number} theta estimado
 */
export function estimateTheta(responses, initialTheta = 0.0) {
  if (!responses || responses.length === 0) return 0.0;

  let correctCount = 0;
  for (const r of responses) {
    if (r.correct) correctCount++;
  }

  // Casos extremos de acerto total ou zero acertos
  if (correctCount === 0) return -2.8;
  if (correctCount === responses.length) return 3.2;

  let theta = initialTheta;
  const maxIterations = 25;
  const tolerance = 0.005;

  for (let iter = 0; iter < maxIterations; iter++) {
    let firstDerivative = 0; // Log-likelihood primeira derivada
    let secondDerivative = 0; // Informação de Fisher (segunda derivada negativa)

    for (const item of responses) {
      const { a, b, c, correct } = item;
      const P = calculateProbability3PL(theta, a, b, c);
      const Q = 1 - P;

      if (P <= 0 || Q <= 0) continue;

      // Derivada de P em relação a theta:
      // dP/dtheta = D * a * (P - c) * (1 - P) / (1 - c)
      const dP = (TRI_CONST_D * a * (P - c) * Q) / (1 - c);
      
      const u = correct ? 1 : 0;
      const term1 = ((u - P) / (P * Q)) * dP;
      firstDerivative += term1;

      // Informação esperada de Fisher (aprox. da segunda derivada)
      const info = (dP * dP) / (P * Q);
      secondDerivative -= info;
    }

    // Regularizador Bayesiano com prior N(0, 1) para estabilidade
    firstDerivative -= theta;
    secondDerivative -= 1;

    if (Math.abs(secondDerivative) < 1e-6) break;

    const delta = firstDerivative / secondDerivative;
    theta = theta - delta;

    // Clamp de segurança do theta
    if (theta > 3.5) theta = 3.5;
    if (theta < -3.5) theta = -3.5;

    if (Math.abs(delta) < tolerance) break;
  }

  return theta;
}

/**
 * Converte a proficiência theta (~ -3 a +3) para a escala ENEM (0–1000).
 * Escala padrão: Média = 500, Desvio Padrão = 100
 * @param {number} theta
 * @returns {number} Nota na escala ENEM arredondada com 1 casa decimal
 */
export function thetaToEnemScore(theta) {
  const rawScore = 500 + 100 * theta;
  // Clamp de acordo com os limites históricos do ENEM (mínimo em torno de 300, máx ~ 1000)
  const clamped = Math.min(1000, Math.max(300, rawScore));
  return Math.round(clamped * 10) / 10;
}

/**
 * Calcula os resultados TRI completos para o simulado
 * @param {Array<Object>} questions - Questões do simulado
 * @param {Object} userAnswers - Mapeamento de id da questão para alternativa selecionada { q1: 'A', ... }
 * @returns {Object} Estatísticas gerais, nota TRI e desempenho por área
 */
export function computeExamResults(questions, userAnswers = {}) {
  const areaGroups = {};

  let totalQuestions = questions.length;
  let totalAnswered = 0;
  let totalCorrect = 0;

  const allItemResponses = [];

  for (const q of questions) {
    const chosen = userAnswers[q.id];
    const isAnswered = chosen !== undefined && chosen !== null && chosen !== '';
    const isCorrect = isAnswered && chosen === q.correct;

    if (isAnswered) totalAnswered++;
    if (isCorrect) totalCorrect++;

    const a = q.tri_params?.a ?? 1.2;
    const b = q.tri_params?.b ?? 0.0;
    const c = q.tri_params?.c ?? 0.2;

    const responseItem = {
      questionId: q.id,
      area: q.area,
      discipline: q.discipline,
      topic: q.topic,
      chosen,
      correctAnswer: q.correct,
      correct: isCorrect,
      a,
      b,
      c
    };

    allItemResponses.push(responseItem);

    if (!areaGroups[q.area]) {
      areaGroups[q.area] = {
        name: q.area,
        total: 0,
        answered: 0,
        correct: 0,
        responses: []
      };
    }

    areaGroups[q.area].total++;
    if (isAnswered) areaGroups[q.area].answered++;
    if (isCorrect) areaGroups[q.area].correct++;
    areaGroups[q.area].responses.push(responseItem);
  }

  // Estimação geral
  const generalTheta = estimateTheta(allItemResponses);
  const generalScore = thetaToEnemScore(generalTheta);

  // Estimação por área
  const areaResults = {};
  for (const [areaName, data] of Object.entries(areaGroups)) {
    const areaTheta = estimateTheta(data.responses);
    const areaScore = thetaToEnemScore(areaTheta);
    const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 1000) / 10 : 0;

    areaResults[areaName] = {
      name: areaName,
      total: data.total,
      answered: data.answered,
      correct: data.correct,
      percentage,
      theta: Math.round(areaTheta * 100) / 100,
      score: areaScore
    };
  }

  return {
    totalQuestions,
    totalAnswered,
    totalCorrect,
    overallPercentage: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 1000) / 10 : 0,
    generalTheta: Math.round(generalTheta * 100) / 100,
    generalScore,
    areas: areaResults,
    responses: allItemResponses
  };
}
