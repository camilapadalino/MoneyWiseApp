/**
 * Valida formato de e-mail
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} - true se válido, false caso contrário
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida formato de data de nascimento (DD/MM/AAAA)
 * @param {string} data - Data a ser validada
 * @returns {boolean} - true se válido, false caso contrário
 */
export const validarDataNascimento = (data) => {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(data)) return false;

  const [, dia, mes, ano] = data.match(regex);
  const diaNum = parseInt(dia, 10);
  const mesNum = parseInt(mes, 10);
  const anoNum = parseInt(ano, 10);

  // Verifica se os valores estão dentro dos limites válidos
  if (mesNum < 1 || mesNum > 12) return false;
  if (diaNum < 1 || diaNum > 31) return false;
  if (anoNum < 1900 || anoNum > new Date().getFullYear()) return false;

  // Verifica se a data é válida
  const dataObj = new Date(anoNum, mesNum - 1, diaNum);
  return (
    dataObj.getDate() === diaNum &&
    dataObj.getMonth() === mesNum - 1 &&
    dataObj.getFullYear() === anoNum
  );
};

/**
 * Valida se a senha tem pelo menos 6 caracteres
 * @param {string} senha - Senha a ser validada
 * @returns {boolean} - true se válido, false caso contrário
 */
export const validarSenha = (senha) => {
  return senha && senha.length >= 6;
};

/**
 * Valida se a renda é um número positivo
 * @param {string} renda - Renda a ser validada
 * @returns {boolean} - true se válido, false caso contrário
 */
export const validarRenda = (renda) => {
  const rendaNum = parseFloat(renda.replace(/\./g, '').replace(',', '.'));
  return !isNaN(rendaNum) && rendaNum > 0;
};

/**
 * Valida se o nome tem pelo menos 3 caracteres
 * @param {string} nome - Nome a ser validado
 * @returns {boolean} - true se válido, false caso contrário
 */
export const validarNome = (nome) => {
  return nome && nome.trim().length >= 3;
};

/**
 * Formata a renda para exibição
 * @param {string} renda - Renda a ser formatada
 * @returns {string} - Renda formatada
 */
export const formatarRenda = (renda) => {
  const rendaNum = parseFloat(renda.replace(/\./g, '').replace(',', '.'));
  if (isNaN(rendaNum)) return '0,00';
  return rendaNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
