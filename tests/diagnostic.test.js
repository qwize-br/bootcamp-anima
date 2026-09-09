import { describe, it, expect } from 'vitest';
import { generatePedagogicalDiagnostic } from '../src/js/diagnostic.js';

describe('diagnostic (Diagnóstico Pedagógico e Guia de Estudo)', () => {
  it('separa temas com alto acerto em Pontos Fortes e temas deficientes em Atenção Prioritária', () => {
    const questions = [
      { id: 'q1', topic: 'Funções da Linguagem', discipline: 'Português', study_reference: 'Cap. 1 - Comunicação' },
      { id: 'q2', topic: 'Funções da Linguagem', discipline: 'Português', study_reference: 'Cap. 1 - Comunicação' },
      { id: 'q3', topic: 'Era Vargas', discipline: 'História', study_reference: 'Cap. 12 - Era Vargas' },
      { id: 'q4', topic: 'Era Vargas', discipline: 'História', study_reference: 'Cap. 12 - Era Vargas' },
    ];

    const responses = [
      { questionId: 'q1', topic: 'Funções da Linguagem', discipline: 'Português', correct: true, b: 0.2 },
      { questionId: 'q2', topic: 'Funções da Linguagem', discipline: 'Português', correct: true, b: 0.5 },
      { questionId: 'q3', topic: 'Era Vargas', discipline: 'História', correct: false, b: 0.1 },
      { questionId: 'q4', topic: 'Era Vargas', discipline: 'História', correct: false, b: 0.6 },
    ];

    const diagnostic = generatePedagogicalDiagnostic(questions, responses);

    expect(diagnostic.strengths.length).toBeGreaterThanOrEqual(1);
    expect(diagnostic.strengths[0].topic).toBe('Funções da Linguagem');
    expect(diagnostic.strengths[0].percentage).toBe(100);

    expect(diagnostic.priorityFocus.length).toBeGreaterThanOrEqual(1);
    expect(diagnostic.priorityFocus[0].topic).toBe('Era Vargas');
    expect(diagnostic.priorityFocus[0].wrong).toBe(2);

    expect(diagnostic.studyGuide.length).toBeGreaterThanOrEqual(1);
    expect(diagnostic.studyGuide[0].action).toContain('Era Vargas');
  });
});
