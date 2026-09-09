import { describe, it, expect } from 'vitest';
import { calculateProbability3PL, estimateTheta, thetaToEnemScore, computeExamResults } from '../src/js/tri-engine.js';

describe('tri-engine (Modelo 3PL e escala ENEM)', () => {
  it('calculateProbability3PL respeita limites e assíntota de chute c', () => {
    // Quando theta é muito menor que b (estudante sem domínio), a probabilidade tende a c
    const pLow = calculateProbability3PL(-3.0, 1.5, 2.0, 0.2);
    expect(pLow).toBeGreaterThanOrEqual(0.2);
    expect(pLow).toBeLessThan(0.25);

    // Quando theta é muito maior que b (estudante de alto domínio), a probabilidade tende a 1.0
    const pHigh = calculateProbability3PL(3.0, 1.5, -1.0, 0.2);
    expect(pHigh).toBeGreaterThan(0.95);
    expect(pHigh).toBeLessThanOrEqual(1.0);
  });

  it('thetaToEnemScore converte corretamente e respeita clamp 300 a 1000', () => {
    expect(thetaToEnemScore(0.0)).toBe(500);
    expect(thetaToEnemScore(1.5)).toBe(650);
    expect(thetaToEnemScore(-2.0)).toBe(300);
    expect(thetaToEnemScore(-4.0)).toBe(300); // clamp inferior
    expect(thetaToEnemScore(6.0)).toBe(1000); // clamp superior
  });

  it('estimateTheta penaliza acertos inconsistentes e calcula proficiência crescente', () => {
    const easyItem = { a: 1.2, b: -1.5, c: 0.2 };
    const medItem = { a: 1.4, b: 0.0, c: 0.2 };
    const hardItem = { a: 1.6, b: 1.8, c: 0.2 };

    // Cenário A: Estudante que errou tudo
    const allWrong = estimateTheta([
      { ...easyItem, correct: false },
      { ...medItem, correct: false },
      { ...hardItem, correct: false },
    ]);
    expect(allWrong).toBeLessThan(-2.0);

    // Cenário B: Estudante consistente (acertou fácil e médio, errou difícil)
    const consistent = estimateTheta([
      { ...easyItem, correct: true },
      { ...medItem, correct: true },
      { ...hardItem, correct: false },
    ]);

    // Cenário C: Acertou todos
    const allCorrect = estimateTheta([
      { ...easyItem, correct: true },
      { ...medItem, correct: true },
      { ...hardItem, correct: true },
    ]);
    expect(allCorrect).toBeGreaterThan(consistent);
  });

  it('computeExamResults calcula acertos, áreas e nota geral ponderada', () => {
    const mockQuestions = [
      {
        id: 'q1',
        area: 'Linguagens',
        discipline: 'Português',
        topic: 'Gramática',
        correct: 'A',
        tri_params: { a: 1.2, b: -0.5, c: 0.2 }
      },
      {
        id: 'q2',
        area: 'Linguagens',
        discipline: 'Literatura',
        topic: 'Modernismo',
        correct: 'B',
        tri_params: { a: 1.3, b: 0.5, c: 0.2 }
      },
      {
        id: 'q3',
        area: 'Humanas',
        discipline: 'História',
        topic: 'Brasil República',
        correct: 'C',
        tri_params: { a: 1.5, b: 0.2, c: 0.2 }
      }
    ];

    const answers = {
      q1: 'A', // Acertou
      q2: 'A', // Errou
      q3: 'C'  // Acertou
    };

    const result = computeExamResults(mockQuestions, answers);
    expect(result.totalQuestions).toBe(3);
    expect(result.totalAnswered).toBe(3);
    expect(result.totalCorrect).toBe(2);
    expect(result.areas['Linguagens'].correct).toBe(1);
    expect(result.areas['Humanas'].correct).toBe(1);
    expect(result.generalScore).toBeGreaterThanOrEqual(300);
    expect(result.generalScore).toBeLessThanOrEqual(1000);
  });
});
