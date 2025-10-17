import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  deleteUser as deleteAuthUser,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

/**
 * Cria um novo usuário no Firebase Authentication e Firestore
 * @param {Object} userData - Dados do usuário (nome, dataNascimento, renda, email, senha)
 * @returns {Promise<Object>} - Resultado da operação
 */
export const criarUsuario = async (userData) => {
  try {
    const { email, senha, nome, dataNascimento, renda } = userData;

    // Cria usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Salva dados adicionais no Firestore
    await setDoc(doc(db, 'usuarios', user.uid), {
      nome,
      dataNascimento,
      renda,
      email,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    });

    return { sucesso: true, usuario: user };
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return { sucesso: false, erro: tratarErroFirebase(error) };
  }
};

/**
 * Autentica um usuário no Firebase
 * @param {string} email - E-mail do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise<Object>} - Resultado da operação
 */
export const autenticarUsuario = async (email, senha) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return { sucesso: true, usuario: userCredential.user };
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return { sucesso: false, erro: tratarErroFirebase(error) };
  }
};

/**
 * Busca os dados de um usuário no Firestore
 * @param {string} uid - ID do usuário
 * @returns {Promise<Object>} - Dados do usuário
 */
export const buscarDadosUsuario = async (uid) => {
  try {
    const docRef = doc(db, 'usuarios', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { sucesso: true, dados: docSnap.data() };
    } else {
      return { sucesso: false, erro: 'Usuário não encontrado' };
    }
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return { sucesso: false, erro: tratarErroFirebase(error) };
  }
};

/**
 * Atualiza os dados de um usuário no Firestore
 * @param {string} uid - ID do usuário
 * @param {Object} dadosAtualizados - Dados a serem atualizados
 * @returns {Promise<Object>} - Resultado da operação
 */
export const atualizarUsuario = async (uid, dadosAtualizados) => {
  try {
    const docRef = doc(db, 'usuarios', uid);
    await updateDoc(docRef, {
      ...dadosAtualizados,
      atualizadoEm: new Date().toISOString()
    });

    return { sucesso: true };
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return { sucesso: false, erro: tratarErroFirebase(error) };
  }
};

/**
 * Atualiza a senha de um usuário
 * @param {string} novaSenha - Nova senha
 * @returns {Promise<Object>} - Resultado da operação
 */
export const atualizarSenha = async (novaSenha) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { sucesso: false, erro: 'Usuário não autenticado' };
    }

    await updatePassword(user, novaSenha);
    return { sucesso: true };
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return { sucesso: false, erro: tratarErroFirebase(error) };
  }
};

/**
 * Exclui um usuário do Firebase Authentication e Firestore
 * @param {string} uid - ID do usuário
 * @returns {Promise<Object>} - Resultado da operação
 */
export const excluirUsuario = async (uid) => {
  try {
    const user = auth.currentUser;
    if (!user || user.uid !== uid) {
      return { sucesso: false, erro: 'Usuário não autenticado ou ID inválido' };
    }

    // Exclui dados do Firestore
    await deleteDoc(doc(db, 'usuarios', uid));

    // Exclui usuário do Authentication
    await deleteAuthUser(user);

    return { sucesso: true };
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return { sucesso: false, erro: tratarErroFirebase(error) };
  }
};

/**
 * Faz logout do usuário
 * @returns {Promise<Object>} - Resultado da operação
 */
export const fazerLogout = async () => {
  try {
    await signOut(auth);
    return { sucesso: true };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return { sucesso: false, erro: tratarErroFirebase(error) };
  }
};

/**
 * Observa mudanças no estado de autenticação
 * @param {Function} callback - Função a ser chamada quando o estado mudar
 * @returns {Function} - Função para cancelar a observação
 */
export const observarEstadoAutenticacao = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Trata erros do Firebase e retorna mensagens amigáveis
 * @param {Error} error - Erro do Firebase
 * @returns {string} - Mensagem de erro amigável
 */
const tratarErroFirebase = (error) => {
  const erros = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/operation-not-allowed': 'Operação não permitida.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'E-mail ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/requires-recent-login': 'Esta operação requer login recente. Faça login novamente.',
  };

  return erros[error.code] || `Erro: ${error.message}`;
};
