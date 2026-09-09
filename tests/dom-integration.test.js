import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';

describe('Integração de Fluxo Completo do Simulado (E2E / DOM)', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
    dom = new JSDOM(html, {
      url: 'http://localhost:3000',
      runScripts: 'dangerously'
    });
    document = dom.window.document;
    window = dom.window;
    globalThis.document = document;
    globalThis.window = window;
  });

  it('renderiza os blocos e elementos da tela inicial (AC-01-1)', () => {
    const title = document.querySelector('.hero-title');
    expect(title.textContent).toContain('Treine no ritmo real do ENEM');

    const blocks = document.querySelectorAll('.block-card');
    expect(blocks.length).toBe(2);

    const btnStart = document.getElementById('btn-start-exam');
    expect(btnStart).not.toBeNull();
  });

  it('modal de finalização possui contadores de pendências e botões de ação (AC-03-1)', () => {
    const modal = document.getElementById('finish-modal');
    const blankCount = document.getElementById('modal-blank-count');
    const reviewCount = document.getElementById('modal-review-count');
    const btnCancel = document.getElementById('btn-modal-cancel');
    const btnConfirm = document.getElementById('btn-modal-confirm');

    expect(modal).not.toBeNull();
    expect(blankCount).not.toBeNull();
    expect(reviewCount).not.toBeNull();
    expect(btnCancel).not.toBeNull();
    expect(btnConfirm).not.toBeNull();
  });

  it('topbar possui estrutura compacta com timer e layout desencavalado', () => {
    const topbar = document.querySelector('.topbar');
    const timer = document.getElementById('topbar-timer');
    const examHeader = document.querySelector('.exam-header-bar');
    const flagBtn = document.getElementById('btn-flag-review');

    expect(topbar).not.toBeNull();
    expect(timer).not.toBeNull();
    expect(examHeader).not.toBeNull();
    expect(flagBtn).not.toBeNull();
  });
});
