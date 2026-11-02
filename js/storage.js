/**
 * Módulo de Gerenciamento do Armazenamento Local (LocalStorage)
 * Responsável por operações CRUD, persistência e exportação/importação de dados.
 */

const STORAGE_KEY = 'cadastro_usuarios_db_v1';

// Dados iniciais para demonstração (se o storage estiver vazio)
const USUARIOS_INICIAIS = [
  {
    id: 'usr_001',
    nome: 'Ana Carolina Martins',
    email: 'ana.martins@exemplo.com.br',
    telefone: '(11) 98765-4321',
    cpf: '123.456.789-01',
    dataNascimento: '1992-05-14',
    cargo: 'Gerente de Projetos',
    status: 'ativo',
    observacoes: 'Responsável pela coordenação dos times de frontend e backend.',
    criadoEm: '2026-09-15T10:30:00.000Z',
    atualizadoEm: '2026-09-15T10:30:00.000Z'
  },
  {
    id: 'usr_002',
    nome: 'Carlos Eduardo Oliveira',
    email: 'carlos.oliveira@exemplo.com.br',
    telefone: '(21) 99123-4567',
    cpf: '234.567.890-12',
    dataNascimento: '1988-11-20',
    cargo: 'Desenvolvedor Sênior',
    status: 'ativo',
    observacoes: 'Especialista em TypeScript, Node.js e arquitetura em nuvem.',
    criadoEm: '2026-09-20T14:15:00.000Z',
    atualizadoEm: '2026-10-01T09:00:00.000Z'
  },
  {
    id: 'usr_003',
    nome: 'Mariana Souza Santos',
    email: 'mariana.souza@exemplo.com.br',
    telefone: '(31) 97654-3210',
    cpf: '345.678.901-23',
    dataNascimento: '1995-03-08',
    cargo: 'UX/UI Designer',
    status: 'pendente',
    observacoes: 'Aguardando validação do portfólio e documentação de admissão.',
    criadoEm: '2026-10-12T16:45:00.000Z',
    atualizadoEm: '2026-10-12T16:45:00.000Z'
  },
  {
    id: 'usr_004',
    nome: 'Lucas Gabriel Ferreira',
    email: 'lucas.ferreira@exemplo.com.br',
    telefone: '(41) 98888-7766',
    cpf: '456.789.012-34',
    dataNascimento: '2000-08-25',
    cargo: 'Analista de QA',
    status: 'inativo',
    observacoes: 'Em licença temporária para capacitação técnica.',
    criadoEm: '2026-08-01T08:00:00.000Z',
    atualizadoEm: '2026-10-20T11:20:00.000Z'
  },
  {
    id: 'usr_005',
    nome: 'Beatriz Lima Rocha',
    email: 'beatriz.lima@exemplo.com.br',
    telefone: '(61) 99555-4433',
    cpf: '567.890.123-45',
    dataNascimento: '1993-12-02',
    cargo: 'Administrador do Sistema',
    status: 'ativo',
    observacoes: 'Acesso total de gestão de usuários e configurações.',
    criadoEm: '2026-07-10T11:00:00.000Z',
    atualizadoEm: '2026-07-10T11:00:00.000Z'
  }
];

class StorageService {
  constructor() {
    this.init();
  }

  /**
   * Inicializa o armazenamento caso não exista nada salvo
   */
  init() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveAll(USUARIOS_INICIAIS);
      }
    } catch (error) {
      console.error('Erro ao acessar localStorage:', error);
    }
  }

  /**
   * Obtém todos os usuários salvos
   * @returns {Array} Lista de usuários
   */
  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao ler usuários:', error);
      return [];
    }
  }

  /**
   * Encontra um usuário por ID
   * @param {string} id
   * @returns {Object|null}
   */
  getById(id) {
    const users = this.getAll();
    return users.find(u => u.id === id) || null;
  }

  /**
   * Salva a lista completa no localStorage
   * @param {Array} users 
   */
  saveAll(users) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      throw new Error('Falha ao gravar no armazenamento local. Limite atingido?');
    }
  }

  /**
   * Adiciona um novo usuário
   * @param {Object} userData 
   * @returns {Object} Usuário criado
   */
  create(userData) {
    const users = this.getAll();

    // Valida e-mail duplicado
    const emailExistente = users.some(
      u => u.email.trim().toLowerCase() === userData.email.trim().toLowerCase()
    );
    if (emailExistente) {
      throw new Error(`O e-mail "${userData.email}" já está cadastrado.`);
    }

    // Valida CPF duplicado se fornecido
    if (userData.cpf) {
      const cpfLimpo = userData.cpf.replace(/\D/g, '');
      const cpfExistente = users.some(u => (u.cpf || '').replace(/\D/g, '') === cpfLimpo);
      if (cpfLimpo && cpfExistente) {
        throw new Error(`O CPF "${userData.cpf}" já pertence a outro usuário.`);
      }
    }

    const novoUsuario = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      nome: userData.nome.trim(),
      email: userData.email.trim().toLowerCase(),
      telefone: userData.telefone ? userData.telefone.trim() : '',
      cpf: userData.cpf ? userData.cpf.trim() : '',
      dataNascimento: userData.dataNascimento || '',
      cargo: userData.cargo || 'Outro',
      status: userData.status || 'ativo',
      observacoes: userData.observacoes ? userData.observacoes.trim() : '',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };

    // Insere no início da lista para visualização imediata
    users.unshift(novoUsuario);
    this.saveAll(users);
    return novoUsuario;
  }

  /**
   * Atualiza um usuário existente
   * @param {string} id 
   * @param {Object} updateData 
   * @returns {Object} Usuário atualizado
   */
  update(id, updateData) {
    const users = this.getAll();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      throw new Error('Usuário não encontrado para atualização.');
    }

    // Valida duplicidade de e-mail com outros usuários
    if (updateData.email) {
      const emailDup = users.some(
        u => u.id !== id && u.email.trim().toLowerCase() === updateData.email.trim().toLowerCase()
      );
      if (emailDup) {
        throw new Error(`O e-mail "${updateData.email}" já está sendo usado por outro usuário.`);
      }
    }

    // Valida duplicidade de CPF com outros usuários
    if (updateData.cpf) {
      const cpfLimpo = updateData.cpf.replace(/\D/g, '');
      const cpfDup = users.some(
        u => u.id !== id && (u.cpf || '').replace(/\D/g, '') === cpfLimpo
      );
      if (cpfLimpo && cpfDup) {
        throw new Error(`O CPF "${updateData.cpf}" já está cadastrado em outro usuário.`);
      }
    }

    const usuarioAtualizado = {
      ...users[index],
      ...updateData,
      atualizadoEm: new Date().toISOString()
    };

    users[index] = usuarioAtualizado;
    this.saveAll(users);
    return usuarioAtualizado;
  }

  /**
   * Remove um usuário pelo ID
   * @param {string} id 
   * @returns {boolean}
   */
  delete(id) {
    const users = this.getAll();
    const novosUsuarios = users.filter(u => u.id !== id);
    if (novosUsuarios.length === users.length) {
      throw new Error('Usuário não encontrado para exclusão.');
    }
    this.saveAll(novosUsuarios);
    return true;
  }

  /**
   * Remove todos os usuários
   */
  clear() {
    this.saveAll([]);
  }

  /**
   * Restaura os dados padrão de demonstração
   */
  resetToDefault() {
    this.saveAll(USUARIOS_INICIAIS);
  }

  /**
   * Exporta os usuários como arquivo JSON para download
   */
  exportToJSON() {
    const users = this.getAll();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `usuarios_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  /**
   * Exporta os usuários para CSV com suporte a UTF-8 (acentuação correta no Excel)
   */
  exportToCSV() {
    const users = this.getAll();
    if (users.length === 0) {
      throw new Error('Nenhum usuário cadastrado para exportar.');
    }

    const headers = ['ID', 'Nome', 'Email', 'Telefone', 'CPF', 'Data de Nascimento', 'Cargo', 'Status', 'Data de Cadastro', 'Observações'];
    
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = users.map(u => [
      escapeCsv(u.id),
      escapeCsv(u.nome),
      escapeCsv(u.email),
      escapeCsv(u.telefone),
      escapeCsv(u.cpf),
      escapeCsv(u.dataNascimento),
      escapeCsv(u.cargo),
      escapeCsv(u.status),
      escapeCsv(new Date(u.criadoEm).toLocaleDateString('pt-BR')),
      escapeCsv(u.observacoes)
    ]);

    // \uFEFF adiciona o BOM para o Excel abrir com acentuação UTF-8 correta
    const csvContent = '\uFEFF' + [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `usuarios_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  }

  /**
   * Importa lista de usuários a partir de uma string JSON
   * @param {string} jsonString 
   * @returns {number} Quantidade de registros importados
   */
  importFromJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        throw new Error('O arquivo JSON deve conter uma lista (array) de usuários.');
      }

      // Validação básica dos objetos importados
      const validUsers = parsed.map((item, index) => {
        if (!item.nome || !item.email) {
          throw new Error(`Registro na linha ${index + 1} inválido: nome e email são obrigatórios.`);
        }
        return {
          id: item.id || ('usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6)),
          nome: String(item.nome).trim(),
          email: String(item.email).trim().toLowerCase(),
          telefone: item.telefone ? String(item.telefone).trim() : '',
          cpf: item.cpf ? String(item.cpf).trim() : '',
          dataNascimento: item.dataNascimento || '',
          cargo: item.cargo || 'Outro',
          status: ['ativo', 'inativo', 'pendente'].includes(item.status) ? item.status : 'ativo',
          observacoes: item.observacoes ? String(item.observacoes).trim() : '',
          criadoEm: item.criadoEm || new Date().toISOString(),
          atualizadoEm: new Date().toISOString()
        };
      });

      this.saveAll(validUsers);
      return validUsers.length;
    } catch (e) {
      throw new Error('Falha ao processar arquivo JSON: ' + e.message);
    }
  }
}

// Instância global do serviço de armazenamento
const storage = new StorageService();
if (typeof window !== 'undefined') {
  window.storage = storage;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageService, storage };
}

