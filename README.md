# Vought Tech

**Vought Tech** é um e-commerce voltado para a venda de produtos tecnológicos.  
O objetivo do sistema é permitir que usuários naveguem e realizem compras de itens como periféricos, eletrônicos e acessórios, de forma prática e intuitiva.  

Este projeto está sendo desenvolvido como parte da **Tarefa #2**, contemplando a estrutura inicial do sistema, definição de tecnologias e configuração dos ambientes de desenvolvimento.

---

## Descrição do Produto

A aplicação consiste em um **e-commerce desktop** focado em produtos tech.  
O sistema contará com funcionalidades como:
- Catálogo de produtos com informações detalhadas;  
- Sistema de autenticação de usuários;  
- Gerenciamento de carrinho de compras;  
- Processamento de pedidos (sem integração de pagamento nesta etapa);  
- Painel administrativo para controle de produtos e usuários (em desenvolvimento).

---

## Tecnologias Utilizadas

### Frontend
- **Linguagem:** JavaScript  
- **Framework:** [React](https://reactjs.org/)  
- **Versão:** 18+  
- **Gerenciador de pacotes:** npm  

### Backend
- **Linguagem:** JavaScript (Node.js)  
- **Versão:** 20+  
- **Framework do servidor:** [Express.js](https://expressjs.com/)  
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)  

### Ambiente de Desenvolvimento
- **Servidor local:** Node.js + Express  
- **Banco de dados local:** PostgreSQL  
- **IDE recomendada:** Visual Studio Code  
- **Controle de versão:** Git + GitHub  

---

## Status do Projeto
Em desenvolvimento 
Atualmente, estão sendo implementadas as camadas de **frontend em React** e **backend em Node.js** com integração ao **PostgreSQL local**.

---

## Equipe de Desenvolvimento
Projeto desenvolvido para fins acadêmicos, com foco na aplicação prática de tecnologias web modernas.  
**Pelos Alunos:**  
Marcos Vinícius Pereira  
Arthur Soares Marques  
Diego Alves Oliveira

---

##  Regras e Padrões de Uso do Git

### 1. **Regras de Commit:**
   - Todos os commits devem seguir o padrão **Conventional Commits**.
   - Nome do integrante do grupo entre [], por exemplo, [João] ....
   - Use um formato claro e descritivo para a mensagem de commit:
     - `feat:` para novos recursos;
     - `fix:` para correções de bugs;
     - `docs:` para mudanças na documentação;
     - `style:` para ajustes de estilo (não afetam a lógica do código);
     - `refactor:` para mudanças no código que não alteram a funcionalidade;
     - `test:` para inclusão ou modificação de testes;
     - `chore:` para ajustes de infraestrutura ou dependências.
   - Exemplo de mensagem de commit:
     ```bash
     feat: adiciona autenticação de usuário
     ```

### 2. **Uso de Branches:**
   - Use branches para todas as novas funcionalidades ou correções de bugs.
   - Nomeie suas branches de forma clara e objetiva:
     - `feature/nome-da-feature` para novas funcionalidades;
     - `bugfix/nome-do-bug` para correções de bugs;
     - `hotfix/nome-do-hotfix` para correções urgentes em produção.
   - Exemplo de criação de branch:
     ```bash
     git checkout -b feature/adicionar-carrinho
     ```

### 3. **Estrutura de Pastas:**
   - Organize o código de forma modular:
     - `frontend/` para arquivos relacionados ao frontend (React).
     - `backend/` para arquivos relacionados ao backend (Node.js, Express).
     - `docs/` para documentação.
   - Mantenha a documentação atualizada e estruturada dentro da pasta `docs/`.

---

## Como Rodar o Projeto

### 1. **Pré-requisitos:**
   - Certifique-se de ter o **Node.js** e o **PostgreSQL** instalados no seu sistema.
     - Para instalar o **Node.js**, acesse: [Node.js Official Site](https://nodejs.org/).
     - Para instalar o **PostgreSQL**, acesse: [PostgreSQL Official Site](https://www.postgresql.org/download/).

### 2. **Clonando o Repositório:**
   - Clone este repositório para o seu ambiente local:
     ```bash
     git clone https://github.com/mvk999/EngSoftware.git
     ```

### 3. **Instalação das Dependências:**
   - Acesse a pasta do projeto:
     ```bash
     cd vought-tech
     ```
   - Instale as dependências do projeto:
     - Para o **frontend** (React):
       ```bash
       cd frontend
       npm install
       ```
     - Para o **backend** (Node.js):
       ```bash
       cd backend
       npm install
       ```

### 4. **Configuração do Banco de Dados:**
   - Crie o banco de dados no PostgreSQL:
     ```bash
     createdb vought_tech
     ```
   - Se necessário, crie a estrutura do banco de dados com os scripts SQL apropriados.

### 5. **Rodando o Backend:**
   - No terminal, dentro da pasta do **backend**, inicie o servidor backend:
     ```bash
     npm run start:backend
     ```

### 6. **Rodando o Frontend:**
   - No terminal, dentro da pasta do **frontend**, inicie o servidor frontend:
     ```bash
     npm run start:frontend
     ```

### 7. **Acessando o Projeto:**
   - O **frontend** estará acessível no navegador em: `http://localhost:3000/`
   - O **backend** estará disponível em: `http://localhost:5000/`

---