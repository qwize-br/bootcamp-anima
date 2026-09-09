export const STORAGE_KEY = 'simulado_enem_state_v1';

/**
 * Retorna o estado salvo ou null se não houver ou estiver corrompido
 */
export function loadState(key = STORAGE_KEY) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Falha ao carregar estado do localStorage:', err);
    return null;
  }
}

/**
 * Salva o estado de forma atômica no localStorage
 */
export function saveState(state, key = STORAGE_KEY) {
  try {
    localStorage.setItem(key, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error('Falha ao salvar estado no localStorage:', err);
    return false;
  }
}

/**
 * Remove o estado salvo da sessão atual
 */
export function clearState(key = STORAGE_KEY) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error('Falha ao limpar estado do localStorage:', err);
    return false;
  }
}
