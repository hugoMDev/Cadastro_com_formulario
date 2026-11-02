# Sistema Web de Cadastro de Usuários com Armazenamento Local

Aplicação web completa, moderna e responsiva para cadastro e gestão de usuários, com persistência de dados no `localStorage` do navegador, filtros em tempo real, validações e exportação de relatórios.

---

## 🚀 Como Executar o Projeto

Você tem duas formas muito simples de abrir e testar o sistema:

### Opção 1: Abrir diretamente no Navegador (Sem instalação necessária)
1. Navegue até a pasta do projeto:
   `c:\Users\Maysa Silva\Desktop\HUGO\workspace\Cadastro_com_formulario`
2. Dê um duplo clique no arquivo **`index.html`** (ou clique com o botão direito e selecione *Abrir com Google Chrome / Edge / Firefox*).
3. O sistema já estará funcionando imediatamente com dados de demonstração!

### Opção 2: Servidor Local (Opcional)
Se preferir rodar via terminal:
```bash
# Com Python 3:
python -m http.server 8080

# Ou com Node.js (npx):
npx serve .
```
Depois acesse `http://localhost:8080` no navegador.

---

## ✨ Principais Funcionalidades

### 1. Formulário de Cadastro e Edição
- **Campos completos**: Nome Completo, E-mail, Telefone/WhatsApp, CPF, Data de Nascimento, Cargo/Função, Status (Ativo, Pendente, Inativo) e Observações.
- **Máscaras automáticas**: Formatação instantânea de CPF (`000.000.000-00`) e Telefone (`(00) 00000-0000`).
- **Validações inteligentes**:
  - Verificação de campos obrigatórios.
  - Formato válido de e-mail com regex.
  - Validação de e-mail e CPF duplicados (impede cadastrar o mesmo e-mail duas vezes).
  - Feedback visual claro com mensagens de erro abaixo de cada campo.

### 2. Listagem em Tela e Visualização
- **Visão Desktop em Tabela**: Exibe avatar com iniciais coloridas, nome, e-mail, cargo em badge, contatos, status com ponto pulsante e data formatada.
- **Visão Mobile Responsiva em Cards**: Adaptada para smartphones e tablets, exibindo os dados de forma limpa e acessível.
- **Ficha Detalhada (Modal de Visualização)**: Permite conferir todas as informações de um usuário sem precisar editar.
- **Paginação Dinâmica**: Navegação fluida entre páginas configuráveis.

### 3. Filtros, Busca e Ordenação em Tempo Real
- **Barra de Pesquisa Global**: Busca instantânea por qualquer termo (nome, e-mail, telefone, CPF ou cargo).
- **Filtro por Status**: Filtre por *Todos*, *Ativo*, *Pendente* ou *Inativo*.
- **Filtro por Cargo**: Exiba apenas desenvolvedores, gerentes, designers, administradores, etc.
- **Ordenação Flexível**: Ordene por mais recentes, mais antigos, nome de A-Z ou nome de Z-A.
- **Botão Limpar Filtros**: Restaure a visualização completa com um único clique.

### 4. Persistência e Gestão de Dados (LocalStorage)
- **Persistência Local**: Todos os dados são salvos no `localStorage` do navegador e continuam salvos mesmo após fechar ou recarregar a página.
- **Exportação para CSV (Excel)**: Gera arquivo `.csv` compatível com o Microsoft Excel (com codificação UTF-8 com BOM para acentuação correta).
- **Backup e Restauração em JSON**: Exporte todos os dados como `.json` e importe-os em qualquer outro navegador.
- **Restauração de Amostras**: Botão para repovoar o banco com registros de demonstração quando desejar.
- **Limpeza Total com Confirmação**: Permite zerar a base de dados com segurança.

### 5. UI/UX e Feedback Visual
- **Cards de Métricas**: Indicadores no topo com contagem total de usuários, ativos, pendentes e inativos.
- **Notificações Toast**: Avisos flutuantes automáticos de sucesso, erro ou informação.
- **Modal de Confirmação**: Prevenção contra exclusões acidentais.

---

## 📁 Estrutura de Arquivos

```text
Cadastro_com_formulario/
├── index.html          # Estrutura HTML5 semântica e acessível da aplicação
├── css/
│   └── style.css       # Estilos customizados, animações de toasts e scrollbars
├── js/
│   ├── storage.js      # Camada de serviço do LocalStorage (CRUD, import/export)
│   └── app.js          # Lógica principal, validações, máscaras e controle de UI
└── README.md           # Documentação completa do projeto
```

---

## 🛠️ Tecnologias Utilizadas
- **HTML5** semântico
- **Tailwind CSS (CDN)** para estilização utilitária moderna
- **JavaScript Moderno (ES6+)** sem dependências de frameworks pesados
- **Lucide Icons** para ícones vetoriais elegantes
- **LocalStorage API** para armazenamento persistente no navegador

