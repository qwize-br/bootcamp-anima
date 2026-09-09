import { ExamTimer } from './timer.js';
import { loadState, saveState, clearState } from './storage.js';
import { computeExamResults } from './tri-engine.js';
import { generatePedagogicalDiagnostic } from './diagnostic.js';
import { renderQuestion, renderResults, renderReviewList } from './ui.js';

export class SimuladoApp {
  constructor() {
    this.currentScreen = 'screen-home';
    this.selectedBlock = 'dia-1';
    this.questions = [];
    this.currentQuestionIndex = 0; // 0-indexed (0 a 89)
    this.answers = {}; // { q1: 'A', ... }
    this.flagged = {}; // { q1: true, ... }
    this.timer = null;
    this.isReviewOnlyErrors = true;
    this.examResults = null;
    this.diagnostic = null;
  }

  async init() {
    this.bindEvents();
    const restored = this.restoreSession();
    if (!restored) {
      this.goToScreen('screen-home');
    }
  }

  bindEvents() {
    // Topbar brand click
    const brand = document.querySelector('.brand');
    if (brand) {
      brand.addEventListener('click', () => {
        if (this.currentScreen === 'screen-exam') {
          if (confirm('Deseja pausar e voltar ao início? O progresso da prova será salvo.')) {
            this.goToScreen('screen-home');
          }
        } else {
          this.goToScreen('screen-home');
        }
      });
    }

    // Seletor de blocos
    document.querySelectorAll('.block-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.block-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedBlock = card.dataset.block;
      });
    });

    // Iniciar Simulado
    const btnStart = document.getElementById('btn-start-exam');
    if (btnStart) {
      btnStart.addEventListener('click', () => this.startExam());
    }

    // Navegação de questões
    const btnPrev = document.getElementById('btn-prev-question');
    const btnNext = document.getElementById('btn-next-question');
    const btnFinish = document.getElementById('btn-finish-exam');
    const btnFlag = document.getElementById('btn-flag-review');

    if (btnPrev) btnPrev.addEventListener('click', () => this.prevQuestion());
    if (btnNext) btnNext.addEventListener('click', () => this.nextQuestion());
    if (btnFinish) btnFinish.addEventListener('click', () => this.openFinishModal());
    if (btnFlag) btnFlag.addEventListener('click', () => this.toggleFlagReview());

    // Evento disparado pelo ui.js quando o usuário clica numa alternativa
    document.addEventListener('exam:option-selected', (e) => {
      const currentQ = this.questions[this.currentQuestionIndex];
      if (!currentQ) return;
      this.answers[currentQ.id] = e.detail.letter;
      this.persistSession();
    });

    // Modais
    const btnModalCancel = document.getElementById('btn-modal-cancel');
    const btnModalConfirm = document.getElementById('btn-modal-confirm');
    if (btnModalCancel) btnModalCancel.addEventListener('click', () => this.closeFinishModal());
    if (btnModalConfirm) btnModalConfirm.addEventListener('click', () => this.confirmFinishExam());

    // Botões da tela de resultado
    const btnGoReview = document.getElementById('btn-go-review');
    const btnNewExam = document.getElementById('btn-new-exam');
    if (btnGoReview) btnGoReview.addEventListener('click', () => this.goToReview());
    if (btnNewExam) btnNewExam.addEventListener('click', () => this.resetSimulado());

    // Botões da tela de revisão
    const pillAll = document.getElementById('pill-all');
    const pillErrors = document.getElementById('pill-errors');
    const btnBackResult = document.getElementById('btn-back-result');

    if (pillAll) pillAll.addEventListener('click', () => this.filterReview(false));
    if (pillErrors) pillErrors.addEventListener('click', () => this.filterReview(true));
    if (btnBackResult) btnBackResult.addEventListener('click', () => this.goToScreen('screen-result'));
  }

  goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    this.currentScreen = screenId;

    const timerBadge = document.getElementById('topbar-timer');
    if (timerBadge) {
      timerBadge.style.display = (screenId === 'screen-exam') ? 'flex' : 'none';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async loadQuestions(blockId) {
    try {
      const response = await fetch(`./src/data/${blockId}.json`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      return data.questions || [];
    } catch (err) {
      console.error('Falha ao carregar banco de questões:', err);
      return [];
    }
  }

  async startExam(blockId = this.selectedBlock, initialRemaining = 16200, currentIndex = 0) {
    this.selectedBlock = blockId;
    this.questions = await this.loadQuestions(blockId);

    if (this.questions.length === 0) {
      alert('Não foi possível carregar as questões do simulado.');
      return;
    }

    this.currentQuestionIndex = currentIndex;

    if (this.timer) {
      this.timer.stop();
    }

    this.timer = new ExamTimer({
      initialSeconds: initialRemaining,
      onTick: (seconds, formatted) => {
        const timerDisplay = document.getElementById('timer-display');
        const timerBadge = document.getElementById('topbar-timer');
        if (timerDisplay) timerDisplay.textContent = formatted;

        if (timerBadge) {
          timerBadge.classList.toggle('timer-warning', seconds <= 1800 && seconds > 600);
          timerBadge.classList.toggle('timer-danger', seconds <= 600);
        }

        // Salvar a cada tick de forma resiliente
        this.persistSession();
      },
      onExpire: () => {
        alert('Tempo esgotado! Seu simulado será finalizado automaticamente.');
        this.confirmFinishExam();
      }
    });

    this.timer.start();
    this.goToScreen('screen-exam');
    this.showCurrentQuestion();
  }

  showCurrentQuestion() {
    const q = this.questions[this.currentQuestionIndex];
    if (!q) return;

    const selected = this.answers[q.id] || null;
    const isFlagged = Boolean(this.flagged[q.id]);
    renderQuestion(q, selected, isFlagged);

    const btnPrev = document.getElementById('btn-prev-question');
    const btnNext = document.getElementById('btn-next-question');
    if (btnPrev) btnPrev.disabled = this.currentQuestionIndex === 0;
    if (btnNext) btnNext.disabled = this.currentQuestionIndex === this.questions.length - 1;

    this.persistSession();
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.showCurrentQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.showCurrentQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleFlagReview() {
    const q = this.questions[this.currentQuestionIndex];
    if (!q) return;

    this.flagged[q.id] = !this.flagged[q.id];
    const flagBtn = document.getElementById('btn-flag-review');
    const isFlagged = this.flagged[q.id];

    if (flagBtn) {
      flagBtn.classList.toggle('active-flag', isFlagged);
      flagBtn.innerHTML = isFlagged ? '🚩 Marcada' : '🔖 Revisar depois';
    }

    this.persistSession();
  }

  openFinishModal() {
    let blankCount = 0;
    let reviewCount = 0;

    for (const q of this.questions) {
      if (!this.answers[q.id]) blankCount++;
      if (this.flagged[q.id]) reviewCount++;
    }

    const blankEl = document.getElementById('modal-blank-count');
    const reviewEl = document.getElementById('modal-review-count');
    if (blankEl) blankEl.textContent = blankCount;
    if (reviewEl) reviewEl.textContent = reviewCount;

    const modal = document.getElementById('finish-modal');
    if (modal) modal.classList.add('active');
  }

  closeFinishModal() {
    const modal = document.getElementById('finish-modal');
    if (modal) modal.classList.remove('active');
  }

  confirmFinishExam() {
    this.closeFinishModal();
    if (this.timer) {
      this.timer.stop();
    }

    this.examResults = computeExamResults(this.questions, this.answers);
    this.diagnostic = generatePedagogicalDiagnostic(this.questions, this.examResults.responses);

    renderResults(this.examResults, this.diagnostic);
    this.goToScreen('screen-result');

    this.persistSession(true); // Finalizado
  }

  goToReview() {
    this.isReviewOnlyErrors = true;
    renderReviewList(this.questions, this.answers, this.isReviewOnlyErrors);
    this.goToScreen('screen-review');
  }

  filterReview(onlyErrors) {
    this.isReviewOnlyErrors = onlyErrors;
    const pillAll = document.getElementById('pill-all');
    const pillErrors = document.getElementById('pill-errors');

    if (pillAll) pillAll.classList.toggle('active', !onlyErrors);
    if (pillErrors) pillErrors.classList.toggle('active', onlyErrors);

    renderReviewList(this.questions, this.answers, onlyErrors);
  }

  resetSimulado() {
    if (confirm('Deseja iniciar um novo simulado? O histórico atual será reiniciado.')) {
      clearState();
      this.questions = [];
      this.answers = {};
      this.flagged = {};
      this.examResults = null;
      this.diagnostic = null;
      if (this.timer) this.timer.stop();
      this.goToScreen('screen-home');
    }
  }

  persistSession(isFinished = false) {
    const state = {
      blockId: this.selectedBlock,
      currentQuestionIndex: this.currentQuestionIndex,
      remainingSeconds: this.timer ? this.timer.remainingSeconds : 16200,
      answers: this.answers,
      flagged: this.flagged,
      isFinished,
      currentScreen: this.currentScreen,
      examResults: this.examResults,
      diagnostic: this.diagnostic
    };
    saveState(state);
  }

  async restoreSession() {
    const saved = loadState();
    if (!saved) return false;

    this.selectedBlock = saved.blockId || 'dia-1';
    this.currentQuestionIndex = saved.currentQuestionIndex || 0;
    this.answers = saved.answers || {};
    this.flagged = saved.flagged || {};
    this.examResults = saved.examResults || null;
    this.diagnostic = saved.diagnostic || null;

    if (saved.isFinished && saved.examResults && saved.diagnostic) {
      this.questions = await this.loadQuestions(this.selectedBlock);
      renderResults(this.examResults, this.diagnostic);
      if (saved.currentScreen === 'screen-review') {
        this.goToReview();
      } else {
        this.goToScreen('screen-result');
      }
      return true;
    }

    if (saved.remainingSeconds > 0) {
      await this.startExam(this.selectedBlock, saved.remainingSeconds, this.currentQuestionIndex);
      return true;
    }

    return false;
  }
}

// Inicialização imediata ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  const app = new SimuladoApp();
  app.init();
  window.simuladoApp = app;
});
