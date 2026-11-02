/**
 * Sistema Web de Cadastro de Usuários
 * Controle de Interface, Validações, Máscaras e Eventos
 */

// Estado da aplicação
const state = {
  searchQuery: '',
  statusFilter: 'todos',
  roleFilter: 'todos',
  sortBy: 'data_desc',
  currentPage: 1,
  itemsPerPage: 8,
  editingUserId: null,
  deletingUserId: null
};

// Paleta de cores para avatares
const AVATAR_COLORS = [
  'bg-indigo-500 text-white',
  'bg-emerald-500 text-white',
  'bg-blue-500 text-white',
  'bg-violet-500 text-white',
  'bg-rose-500 text-white',
  'bg-amber-500 text-white',
  'bg-cyan-500 text-white',
  'bg-teal-500 text-white'
];

/**
 * Inicialização ao carregar o DOM
 */
document.addEventListener('DOMContentLoaded', () => {
  initMasks();
  initEventListeners();
  renderApp();
  initLucide();
});

/**
 * Atualiza os ícones Lucide se a biblioteca estiver carregada
 */
function initLucide() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/**
 * Inicializa máscaras de entrada (CPF e Telefone)
 */
function initMasks() {
  const cpfInput = document.getElementById('user-cpf');
  const telInput = document.getElementById('user-telefone');

  if (cpfInput) {
    cpfInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);
      
      if (v.length > 9) {
        v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
      } else if (v.length > 6) {
        v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (v.length > 3) {
        v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      }
      e.target.value = v;
    });
  }

  if (telInput) {
    telInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);

      if (v.length > 10) {
        // (11) 98765-4321
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        // (11) 9876-5432
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/^(\d*)/, '($1');
      }
      e.target.value = v;
    });
  }
}

/**
 * Configura todos os ouvintes de eventos da página
 */
function initEventListeners() {
  // Pesquisa
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      state.currentPage = 1;
      renderUsersList();
    });
  }

  // Filtro de Status
  const filterStatus = document.getElementById('filter-status');
  if (filterStatus) {
    filterStatus.addEventListener('change', (e) => {
      state.statusFilter = e.target.value;
      state.currentPage = 1;
      renderUsersList();
    });
  }

  // Filtro de Cargo
  const filterRole = document.getElementById('filter-role');
  if (filterRole) {
    filterRole.addEventListener('change', (e) => {
      state.roleFilter = e.target.value;
      state.currentPage = 1;
      renderUsersList();
    });
  }

  // Ordenação
  const sortSelect = document.getElementById('sort-by');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderUsersList();
    });
  }

  // Limpar filtros
  const btnResetFilters = document.getElementById('btn-reset-filters');
  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', () => {
      state.searchQuery = '';
      state.statusFilter = 'todos';
      state.roleFilter = 'todos';
      state.sortBy = 'data_desc';
      state.currentPage = 1;

      if (searchInput) searchInput.value = '';
      if (filterStatus) filterStatus.value = 'todos';
      if (filterRole) filterRole.value = 'todos';
      if (sortSelect) sortSelect.value = 'data_desc';

      renderUsersList();
      showToast('Filtros restaurados.', 'info');
    });
  }

  // Botão Novo Usuário
  const btnNovo = document.getElementById('btn-novo-usuario');
  if (btnNovo) {
    btnNovo.addEventListener('click', () => openUserModal());
  }

  // Menu Dropdown de Dados (Backup / Restauração)
  const btnDados = document.getElementById('btn-dados-menu');
  const dropdownDados = document.getElementById('dados-menu-dropdown');
  if (btnDados && dropdownDados) {
    btnDados.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownDados.classList.toggle('hidden');
    });
    document.addEventListener('click', () => {
      dropdownDados.classList.add('hidden');
    });
  }


  // Submissão do Formulário de Usuário
  const form = document.getElementById('form-usuario');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Botões de Fechamento de Modais
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });

  // Fechar modais ao clicar no backdrop escuro
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
      }
    });
  });

  // Fechar modal com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      });
    }
  });

  // Confirmação de exclusão
  const btnConfirmDelete = document.getElementById('btn-confirm-delete');
  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', handleConfirmDelete);
  }

  // Exportar CSV
  const btnExportCsv = document.getElementById('btn-export-csv');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      try {
        storage.exportToCSV();
        showToast('Download do arquivo CSV iniciado!', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Exportar JSON
  const btnExportJson = document.getElementById('btn-export-json');
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      try {
        storage.exportToJSON();
        showToast('Backup JSON exportado com sucesso!', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Abrir Modal Importar JSON
  const btnOpenImport = document.getElementById('btn-open-import');
  if (btnOpenImport) {
    btnOpenImport.addEventListener('click', () => {
      openModal('modal-import');
    });
  }

  // Ação de Importar JSON
  const formImport = document.getElementById('form-import-json');
  if (formImport) {
    formImport.addEventListener('submit', handleImportJson);
  }

  // Restaurar dados de demonstração
  const btnResetData = document.getElementById('btn-reset-data');
  if (btnResetData) {
    btnResetData.addEventListener('click', () => {
      if (confirm('Deseja restaurar os dados de demonstração? Isso substituirá a lista atual.')) {
        storage.resetToDefault();
        renderApp();
        showToast('Dados de demonstração restaurados!', 'success');
      }
    });
  }

  // Limpar todos os dados
  const btnClearAll = document.getElementById('btn-clear-all');
  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      if (confirm('Atenção: Tem certeza de que deseja apagar TODOS os usuários cadastrados?')) {
        storage.clear();
        renderApp();
        showToast('Todos os registros foram excluídos.', 'info');
      }
    });
  }
}

/**
 * Renderiza todos os blocos do sistema
 */
function renderApp() {
  updateMetrics();
  renderUsersList();
}

/**
 * Atualiza os cards com indicadores quantitativos
 */
function updateMetrics() {
  const users = storage.getAll();
  const total = users.length;
  const ativos = users.filter(u => u.status === 'ativo').length;
  const inativos = users.filter(u => u.status === 'inativo').length;
  const pendentes = users.filter(u => u.status === 'pendente').length;

  document.getElementById('metric-total').textContent = total;
  document.getElementById('metric-ativos').textContent = ativos;
  document.getElementById('metric-inativos').textContent = inativos;
  document.getElementById('metric-pendentes').textContent = pendentes;
}

/**
 * Filtra e ordena a lista de usuários com base no estado atual
 */
function getFilteredAndSortedUsers() {
  let users = storage.getAll();

  // Filtro de texto (nome, email, cargo, telefone, cpf)
  if (state.searchQuery) {
    users = users.filter(u => {
      const q = state.searchQuery;
      return (
        (u.nome && u.nome.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.cargo && u.cargo.toLowerCase().includes(q)) ||
        (u.telefone && u.telefone.includes(q)) ||
        (u.cpf && u.cpf.includes(q))
      );
    });
  }

  // Filtro de status
  if (state.statusFilter !== 'todos') {
    users = users.filter(u => u.status === state.statusFilter);
  }

  // Filtro de cargo
  if (state.roleFilter !== 'todos') {
    users = users.filter(u => u.cargo === state.roleFilter);
  }

  // Ordenação
  users.sort((a, b) => {
    switch (state.sortBy) {
      case 'nome_asc':
        return a.nome.localeCompare(b.nome, 'pt-BR');
      case 'nome_desc':
        return b.nome.localeCompare(a.nome, 'pt-BR');
      case 'data_asc':
        return new Date(a.criadoEm || 0) - new Date(b.criadoEm || 0);
      case 'data_desc':
      default:
        return new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0);
    }
  });

  return users;
}

/**
 * Renderiza a listagem de usuários na tabela e em cards mobile
 */
function renderUsersList() {
  const filteredUsers = getFilteredAndSortedUsers();
  const totalCount = filteredUsers.length;

  // Atualiza contador de resultados
  const resultCountEl = document.getElementById('results-count');
  if (resultCountEl) {
    resultCountEl.textContent = `${totalCount} ${totalCount === 1 ? 'usuário encontrado' : 'usuários encontrados'}`;
  }

  // Paginação
  const totalPages = Math.ceil(totalCount / state.itemsPerPage) || 1;
  if (state.currentPage > totalPages) state.currentPage = totalPages;
  if (state.currentPage < 1) state.currentPage = 1;

  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  const pagedUsers = filteredUsers.slice(startIndex, startIndex + state.itemsPerPage);

  const tbody = document.getElementById('users-table-body');
  const cardsContainer = document.getElementById('users-cards-container');
  const emptyState = document.getElementById('empty-state');
  const tableWrapper = document.getElementById('table-wrapper');

  if (totalCount === 0) {
    if (tbody) tbody.innerHTML = '';
    if (cardsContainer) cardsContainer.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (tableWrapper) tableWrapper.classList.add('hidden');
    renderPagination(0, 1);
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (tableWrapper) tableWrapper.classList.remove('hidden');

  // Renderiza linhas da tabela Desktop
  if (tbody) {
    tbody.innerHTML = pagedUsers.map(user => createTableRowHtml(user)).join('');
  }

  // Renderiza cards Mobile
  if (cardsContainer) {
    cardsContainer.innerHTML = pagedUsers.map(user => createCardHtml(user)).join('');
  }

  // Renderiza paginação
  renderPagination(totalCount, totalPages);

  // Reinicializa os ícones do Lucide
  initLucide();
}

/**
 * Gera as iniciais do nome para o avatar
 */
function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Retorna classe de cor de avatar com base no nome
 */
function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Retorna o HTML do badge de status
 */
function getStatusBadge(status) {
  switch (status) {
    case 'ativo':
      return `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
          Ativo
        </span>`;
    case 'inativo':
      return `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
          Inativo
        </span>`;
    case 'pendente':
      return `
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
          Pendente
        </span>`;
    default:
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">${escapeHtml(status)}</span>`;
  }
}

/**
 * Gera HTML de uma linha da tabela
 */
function createTableRowHtml(user) {
  const avatarClass = getAvatarColor(user.nome);
  const initials = getInitials(user.nome);
  const dataFormatada = user.criadoEm ? new Date(user.criadoEm).toLocaleDateString('pt-BR') : '-';

  return `
    <tr class="table-row-hover transition-colors border-b border-slate-100">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${avatarClass} shadow-sm shrink-0">
            ${initials}
          </div>
          <div class="ml-3.5">
            <div class="text-sm font-semibold text-slate-800">${escapeHtml(user.nome)}</div>
            <div class="text-xs text-slate-500">${escapeHtml(user.email)}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-block px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
          ${escapeHtml(user.cargo || 'Não informado')}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        <div>${escapeHtml(user.telefone || '-')}</div>
        ${user.cpf ? `<div class="text-xs text-slate-400">CPF: ${escapeHtml(user.cpf)}</div>` : ''}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        ${getStatusBadge(user.status)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
        ${dataFormatada}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div class="flex items-center justify-end space-x-2">
          <button 
            type="button" 
            onclick="viewUserDetails('${user.id}')"
            class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Visualizar Detalhes"
          >
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
          <button 
            type="button" 
            onclick="editUser('${user.id}')"
            class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar Usuário"
          >
            <i data-lucide="pencil" class="w-4 h-4"></i>
          </button>
          <button 
            type="button" 
            onclick="confirmDeleteUser('${user.id}')"
            class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Excluir Usuário"
          >
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Gera HTML de um card para visualização Mobile
 */
function createCardHtml(user) {
  const avatarClass = getAvatarColor(user.nome);
  const initials = getInitials(user.nome);
  const dataFormatada = user.criadoEm ? new Date(user.criadoEm).toLocaleDateString('pt-BR') : '-';

  return `
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${avatarClass} shrink-0">
            ${initials}
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 text-sm">${escapeHtml(user.nome)}</h4>
            <p class="text-xs text-slate-500">${escapeHtml(user.email)}</p>
          </div>
        </div>
        ${getStatusBadge(user.status)}
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
        <div>
          <span class="text-slate-400 block">Cargo</span>
          <span class="font-medium text-slate-800">${escapeHtml(user.cargo || '-')}</span>
        </div>
        <div>
          <span class="text-slate-400 block">Telefone</span>
          <span class="font-medium text-slate-800">${escapeHtml(user.telefone || '-')}</span>
        </div>
        ${user.cpf ? `
          <div class="col-span-2">
            <span class="text-slate-400 block">CPF</span>
            <span class="font-medium text-slate-800">${escapeHtml(user.cpf)}</span>
          </div>
        ` : ''}
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
        <span>Cadastrado em: ${dataFormatada}</span>
        <div class="flex space-x-1">
          <button onclick="viewUserDetails('${user.id}')" class="p-1.5 text-slate-600 hover:text-indigo-600 rounded">
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
          <button onclick="editUser('${user.id}')" class="p-1.5 text-slate-600 hover:text-blue-600 rounded">
            <i data-lucide="pencil" class="w-4 h-4"></i>
          </button>
          <button onclick="confirmDeleteUser('${user.id}')" class="p-1.5 text-slate-600 hover:text-rose-600 rounded">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza os controles de paginação
 */
function renderPagination(totalCount, totalPages) {
  const container = document.getElementById('pagination-container');
  if (!container) return;

  if (totalCount === 0 || totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  const startRecord = (state.currentPage - 1) * state.itemsPerPage + 1;
  const endRecord = Math.min(state.currentPage * state.itemsPerPage, totalCount);

  let pageButtonsHtml = '';
  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === state.currentPage;
    pageButtonsHtml += `
      <button 
        type="button" 
        onclick="goToPage(${i})" 
        class="w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-sm' 
            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
        }"
      >
        ${i}
      </button>
    `;
  }

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 w-full py-4 px-2">
      <div class="text-xs text-slate-500">
        Exibindo <span class="font-semibold text-slate-700">${startRecord}</span> a <span class="font-semibold text-slate-700">${endRecord}</span> de <span class="font-semibold text-slate-700">${totalCount}</span> usuários
      </div>
      <div class="flex items-center space-x-1.5">
        <button 
          type="button"
          onclick="goToPage(${state.currentPage - 1})"
          ${state.currentPage === 1 ? 'disabled class="px-2.5 py-1.5 text-xs font-medium text-slate-300 border border-slate-200 rounded-lg cursor-not-allowed"' : 'class="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"'}
        >
          Anterior
        </button>
        ${pageButtonsHtml}
        <button 
          type="button"
          onclick="goToPage(${state.currentPage + 1})"
          ${state.currentPage === totalPages ? 'disabled class="px-2.5 py-1.5 text-xs font-medium text-slate-300 border border-slate-200 rounded-lg cursor-not-allowed"' : 'class="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"'}
        >
          Próxima
        </button>
      </div>
    </div>
  `;
}

/**
 * Muda para a página desejada
 */
function goToPage(page) {
  const filteredUsers = getFilteredAndSortedUsers();
  const totalPages = Math.ceil(filteredUsers.length / state.itemsPerPage) || 1;
  if (page < 1 || page > totalPages) return;
  state.currentPage = page;
  renderUsersList();
}

/**
 * Abre o modal de cadastro ou edição de usuário
 */
function openUserModal(user = null) {
  const modalTitle = document.getElementById('modal-usuario-title');
  const modalSubtitle = document.getElementById('modal-usuario-subtitle');
  const form = document.getElementById('form-usuario');
  const btnSubmit = document.getElementById('btn-submit-usuario');

  form.reset();
  clearFormErrors();

  if (user) {
    state.editingUserId = user.id;
    modalTitle.textContent = 'Editar Usuário';
    modalSubtitle.textContent = 'Atualize as informações do usuário selecionado.';
    btnSubmit.innerHTML = '<i data-lucide="check" class="w-4 h-4 mr-1.5"></i> Salvar Alterações';

    document.getElementById('user-id').value = user.id;
    document.getElementById('user-nome').value = user.nome || '';
    document.getElementById('user-email').value = user.email || '';
    document.getElementById('user-telefone').value = user.telefone || '';
    document.getElementById('user-cpf').value = user.cpf || '';
    document.getElementById('user-nascimento').value = user.dataNascimento || '';
    document.getElementById('user-cargo').value = user.cargo || 'Desenvolvedor';
    document.getElementById('user-status').value = user.status || 'ativo';
    document.getElementById('user-observacoes').value = user.observacoes || '';
  } else {
    state.editingUserId = null;
    modalTitle.textContent = 'Novo Usuário';
    modalSubtitle.textContent = 'Preencha os campos para cadastrar um novo usuário no sistema.';
    btnSubmit.innerHTML = '<i data-lucide="user-plus" class="w-4 h-4 mr-1.5"></i> Cadastrar Usuário';

    document.getElementById('user-id').value = '';
    document.getElementById('user-status').value = 'ativo';
  }

  openModal('modal-usuario');
  initLucide();
}

/**
 * Trata o envio do formulário de usuário (Criar ou Atualizar)
 */
function handleFormSubmit(e) {
  e.preventDefault();
  clearFormErrors();

  const formData = {
    nome: document.getElementById('user-nome').value.trim(),
    email: document.getElementById('user-email').value.trim(),
    telefone: document.getElementById('user-telefone').value.trim(),
    cpf: document.getElementById('user-cpf').value.trim(),
    dataNascimento: document.getElementById('user-nascimento').value,
    cargo: document.getElementById('user-cargo').value,
    status: document.getElementById('user-status').value,
    observacoes: document.getElementById('user-observacoes').value.trim()
  };

  // Validações
  let hasError = false;

  if (!formData.nome || formData.nome.length < 3) {
    setFieldError('user-nome', 'Informe o nome completo (mínimo de 3 letras).');
    hasError = true;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    setFieldError('user-email', 'Informe um endereço de e-mail válido.');
    hasError = true;
  }

  if (formData.cpf && formData.cpf.replace(/\D/g, '').length !== 11) {
    setFieldError('user-cpf', 'CPF incompleto (deve conter 11 dígitos).');
    hasError = true;
  }

  if (hasError) return;

  try {
    if (state.editingUserId) {
      storage.update(state.editingUserId, formData);
      showToast('Usuário atualizado com sucesso!', 'success');
    } else {
      storage.create(formData);
      showToast('Usuário cadastrado com sucesso!', 'success');
    }

    closeModal('modal-usuario');
    renderApp();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

/**
 * Prepara e abre a edição de um usuário
 */
function editUser(id) {
  const user = storage.getById(id);
  if (!user) {
    showToast('Usuário não localizado.', 'error');
    return;
  }
  openUserModal(user);
}

/**
 * Visualiza todos os detalhes do usuário em um modal
 */
function viewUserDetails(id) {
  const user = storage.getById(id);
  if (!user) {
    showToast('Usuário não encontrado.', 'error');
    return;
  }

  const avatarClass = getAvatarColor(user.nome);
  const initials = getInitials(user.nome);
  const criadoEm = user.criadoEm ? new Date(user.criadoEm).toLocaleString('pt-BR') : '-';
  const atualizadoEm = user.atualizadoEm ? new Date(user.atualizadoEm).toLocaleString('pt-BR') : '-';
  
  let nascFormatado = '-';
  if (user.dataNascimento) {
    const [ano, mes, dia] = user.dataNascimento.split('-');
    nascFormatado = `${dia}/${mes}/${ano}`;
  }

  const content = document.getElementById('view-user-details-content');
  if (content) {
    content.innerHTML = `
      <div class="flex items-center space-x-4 pb-4 border-b border-slate-100">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl ${avatarClass} shadow">
          ${initials}
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-800">${escapeHtml(user.nome)}</h3>
          <p class="text-sm text-slate-500">${escapeHtml(user.email)}</p>
          <div class="mt-1">${getStatusBadge(user.status)}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
        <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span class="text-xs text-slate-400 block">Cargo / Função</span>
          <span class="font-semibold text-slate-800">${escapeHtml(user.cargo || 'Não especificado')}</span>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span class="text-xs text-slate-400 block">Telefone / WhatsApp</span>
          <span class="font-semibold text-slate-800">${escapeHtml(user.telefone || 'Não cadastrado')}</span>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span class="text-xs text-slate-400 block">CPF</span>
          <span class="font-semibold text-slate-800">${escapeHtml(user.cpf || 'Não cadastrado')}</span>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span class="text-xs text-slate-400 block">Data de Nascimento</span>
          <span class="font-semibold text-slate-800">${nascFormatado}</span>
        </div>
      </div>

      <div class="mt-4 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
        <span class="text-xs text-slate-400 block mb-1">Observações</span>
        <p class="text-sm text-slate-700 whitespace-pre-wrap">${escapeHtml(user.observacoes || 'Nenhuma observação registrada.')}</p>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 text-xs text-slate-400">
        <div>Cadastrado em: <span class="font-medium text-slate-600 block">${criadoEm}</span></div>
        <div>Última alteração: <span class="font-medium text-slate-600 block">${atualizadoEm}</span></div>
      </div>
    `;
  }

  // Prepara botão de editar dentro do modal de visualização
  const btnEditFromView = document.getElementById('btn-edit-from-view');
  if (btnEditFromView) {
    btnEditFromView.onclick = () => {
      closeModal('modal-view-user');
      editUser(user.id);
    };
  }

  openModal('modal-view-user');
  initLucide();
}

/**
 * Abre confirmação de exclusão
 */
function confirmDeleteUser(id) {
  const user = storage.getById(id);
  if (!user) return;

  state.deletingUserId = id;
  const nameEl = document.getElementById('delete-user-name');
  if (nameEl) nameEl.textContent = user.nome;

  openModal('modal-confirm-delete');
}

/**
 * Executa a exclusão confirmada
 */
function handleConfirmDelete() {
  if (!state.deletingUserId) return;

  try {
    storage.delete(state.deletingUserId);
    showToast('Usuário excluído com sucesso.', 'info');
    closeModal('modal-confirm-delete');
    state.deletingUserId = null;
    renderApp();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/**
 * Trata importação de arquivo JSON
 */
function handleImportJson(e) {
  e.preventDefault();
  const fileInput = document.getElementById('import-json-file');
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    showToast('Selecione um arquivo .json para importar.', 'error');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const content = event.target.result;
      const totalImportados = storage.importFromJSON(content);
      showToast(`${totalImportados} registros importados com sucesso!`, 'success');
      closeModal('modal-import');
      fileInput.value = '';
      renderApp();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  reader.onerror = () => {
    showToast('Erro ao ler arquivo selecionado.', 'error');
  };

  reader.readAsText(file);
}

/**
 * Utilitários para exibição de erros no formulário
 */
function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (field) {
    field.classList.add('border-rose-500', 'focus:ring-rose-200');
    field.focus();
  }
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }
}

function clearFormErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
    el.classList.add('hidden');
  });
  document.querySelectorAll('#form-usuario input, #form-usuario select, #form-usuario textarea').forEach(el => {
    el.classList.remove('border-rose-500', 'focus:ring-rose-200');
  });
}

/**
 * Controle genérico de Modais
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    initLucide();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/**
 * Sistema de Notificações Toast
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const colors = {
    success: 'bg-emerald-600 text-white border-emerald-700',
    error: 'bg-rose-600 text-white border-rose-700',
    info: 'bg-slate-800 text-white border-slate-900'
  };

  const icons = {
    success: '<i data-lucide="check-circle" class="w-5 h-5 shrink-0"></i>',
    error: '<i data-lucide="alert-circle" class="w-5 h-5 shrink-0"></i>',
    info: '<i data-lucide="info" class="w-5 h-5 shrink-0"></i>'
  };

  toast.className = `toast-enter flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border text-sm max-w-sm pointer-events-auto transition-all ${colors[type] || colors.info}`;
  toast.innerHTML = `
    ${icons[type] || icons.info}
    <span class="flex-1 font-medium leading-tight">${escapeHtml(message)}</span>
    <button type="button" class="text-white/80 hover:text-white ml-2" onclick="this.parentElement.remove()">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  container.appendChild(toast);
  initLucide();

  // Auto-remove após 4 segundos
  setTimeout(() => {
    toast.classList.remove('toast-enter');
    toast.classList.add('toast-exit');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 250);
  }, 4000);
}

/**
 * Escapar strings HTML para prevenir XSS
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Expõe funções necessárias globalmente para os manipuladores inline do HTML
if (typeof window !== 'undefined') {
  window.viewUserDetails = viewUserDetails;
  window.editUser = editUser;
  window.confirmDeleteUser = confirmDeleteUser;
  window.goToPage = goToPage;
  window.openUserModal = openUserModal;
  window.closeModal = closeModal;
}

