/**
 * Drift-safe countdown timer engine
 */
export class ExamTimer {
  /**
   * @param {number} durationSeconds - Duração total em segundos (padrão 16200 = 4h30)
   * @param {Function} onTick - Callback invocado a cada segundo com (remainingSeconds, formattedTime)
   * @param {Function} onExpire - Callback invocado ao zerar o cronômetro
   */
  constructor({ initialSeconds = 16200, onTick = () => {}, onExpire = () => {} } = {}) {
    this.remainingSeconds = initialSeconds;
    this.onTick = onTick;
    this.onExpire = onExpire;
    this.intervalId = null;
    this.endTime = null;
  }

  start() {
    if (this.intervalId) return;
    this.endTime = Date.now() + this.remainingSeconds * 1000;

    // Disparo imediato
    this.tick();

    this.intervalId = setInterval(() => {
      this.tick();
    }, 500); // 500ms para garantir precisão e capturar o segundo exato
  }

  tick() {
    const now = Date.now();
    const diffMs = this.endTime - now;
    const currentRemaining = Math.max(0, Math.ceil(diffMs / 1000));

    if (currentRemaining !== this.remainingSeconds) {
      this.remainingSeconds = currentRemaining;
      this.onTick(this.remainingSeconds, ExamTimer.formatSeconds(this.remainingSeconds));

      if (this.remainingSeconds <= 0) {
        this.stop();
        this.onExpire();
      }
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setRemaining(seconds) {
    this.remainingSeconds = Math.max(0, seconds);
    if (this.intervalId) {
      this.endTime = Date.now() + this.remainingSeconds * 1000;
      this.tick();
    }
  }

  static formatSeconds(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
}
