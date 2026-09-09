import { describe, it, expect, beforeEach } from 'vitest';
import { loadState, saveState, clearState, STORAGE_KEY } from '../src/js/storage.js';

describe('storage (Camada de persistência resiliente)', () => {
  const fakeStorage = {};

  beforeEach(() => {
    for (const key of Object.keys(fakeStorage)) {
      delete fakeStorage[key];
    }
    globalThis.localStorage = {
      getItem: (k) => fakeStorage[k] || null,
      setItem: (k, v) => { fakeStorage[k] = String(v); },
      removeItem: (k) => { delete fakeStorage[k]; }
    };
  });

  it('salva e recupera estado de prova sem perda de dados', () => {
    const state = {
      blockId: 'dia-1',
      currentQuestionIndex: 12,
      remainingSeconds: 14200,
      answers: { q1: 'A', q2: 'C' },
      flagged: { q2: true }
    };

    expect(saveState(state)).toBe(true);
    const loaded = loadState();
    expect(loaded).toEqual(state);
  });

  it('retorna null se não houver estado ou houver corrupção', () => {
    clearState();
    expect(loadState()).toBeNull();

    fakeStorage[STORAGE_KEY] = 'JSON_INVALIDO{{{';
    expect(loadState()).toBeNull();
  });
});
