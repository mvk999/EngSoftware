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
Projeto desenvolvido para fins acadêmicos, com foco na aplicação prática de tecnologias web modernas.\\  
**Pelos Alunos:**\\  
Marcos Vinícius Pereira\\  
Arthur Soares Marques\\  
Diego Alves Oliveira

---

## 🔧 Regras e Padrões de Uso do Git

### 1. **Regras de Commit:**
   - Todos os commits devem seguir o padrão **Conventional Commits**.
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

