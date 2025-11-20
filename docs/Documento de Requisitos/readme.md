# Vought Tech

**Vought Tech** é um e-commerce voltado para a venda de produtos tecnológicos.  
O objetivo do sistema é permitir que usuários naveguem e realizem compras de itens como periféricos, eletrônicos e acessórios, de forma prática e intuitiva.  

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
- **Linguagem:** JavaScript + HTML + CSS + React + Vite
- **Framework:** [React](https://reactjs.org/)  
- **Versão NodeJS:** 22.11.1
- **Versão NPM:** 10.9.3
- **Gerenciador de pacotes:** npm  

### Backend
- **Linguagem:** JavaScript (Node.js)  
- **Versão:** 22.21.0  
- **Framework do servidor:** [Express.js](https://expressjs.com/)  
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)  
- **Versão:** 17.5

### Ambiente de Desenvolvimento
- **Servidor local:** Node.js 
- **Banco de dados local:** PostgreSQL   
- **Controle de versão:** Git + GitHub  

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
     feat: [Marcos] adiciona autenticação de usuário
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

### 1. Clonar o Repositório

Clone este repositório para a sua máquina local utilizando o comando:

Entendido. Aqui está o código bruto do Markdown. Copie o conteúdo dentro do bloco de código abaixo e salve como um arquivo .md (ex: README.md).

Markdown

# Projeto: Especificação de Requisitos (ERS) - Vought Tech E-commerce

Este repositório funciona como o centralizador de todo o projeto **Vought Tech**, incluindo o documento formal de **Especificação de Requisitos de Software (ERS)** para o sistema de e-commerce de produtos de tecnologia fictício. O arquivo principal do projeto, nomeado "RequisitosRFeRNF", está incluído aqui, juntamente com outros materiais e recursos relacionados ao desenvolvimento do sistema.

## 1. Objetivo do Documento

O objetivo deste documento é definir e catalogar formalmente todos os requisitos funcionais, não funcionais e regras de negócio necessárias para guiar o desenvolvimento do software **Vought Tech**. Ele serve como a "fonte da verdade" para a equipe de desenvolvimento e stakeholders, garantindo que o produto final atenda a todos os critérios estabelecidos.

---

## 2. Escopo do Sistema (Vought Tech)

O sistema de e-commerce **Vought Tech** inclui as seguintes funcionalidades principais:

* **Gerenciamento de Contas:**
  Cadastro, login (obrigatório) e recuperação de senha para Clientes e Administradores.
* **Catálogo de Produtos:**
  Gerenciamento CRUD de Categorias e Produtos.
* **Jornada de Compra (Estética):**
  Funcionalidades de busca, filtro, carrinho de compras e um checkout simulado (sem processamento de pagamento real).
* **Painel Administrativo:**
  Interface para administradores processarem pedidos (dando baixa no estoque) e gerenciarem o catálogo.

## 3. Estrutura do Documento ERS

O **ERS** foi estruturado para atender às diretrizes e boas práticas de Engenharia de Software, garantindo a clareza e rastreabilidade dos requisitos. A seguir, a organização detalhada do documento:

#### 1. **Requisitos Funcionais (RFs)**

#### 2. **Requisitos Não-Funcionais (RNFs)**

#### 3. **Regras de Negócio (RBRs)**

#### 4. **Padrões de Verificação**

#### 5. **Rastreabilidade**

---

# Localização no Projeto

No seu projeto, a documentação do **ERS** está organizada da seguinte forma:

- **Pasta `docs/`**: Contém os documentos principais do projeto.
  - **Documento `Requisitos.md`**: Onde está a versão completa do **ERS**.
  - **Pasta `Documento de Requisitos/`**: Onde estão o **Documento Requisitos Final** adotados, incluindo as regras e práticas de codificação, uso de Git, e outros padrões do projeto.
  - **Pasta `Padrões Adotados/`**: Onde estão os **Regras de Verificação e Análise de Requisito** adotados, incluindo as regras e práticas de codificação, uso de Git, e outros padrões do projeto.


---

# Configuração e Execução do Projeto

Siga os passos abaixo para configurar o ambiente de desenvolvimento local.

## 1. Clonar o Repositório

Faça o clone do projeto e entre na pasta raiz:

```bash
git clone https://github.com/mvk999/EngSoftware.git
cd EngSoftware
```

---

# Configuração e Execução do Projeto

Siga os passos abaixo para configurar o ambiente de desenvolvimento local.

## 1. Clonar o Repositório

Faça o clone do projeto e entre na pasta raiz:

```bash
git clone https://github.com/mvk999/EngSoftware.git
cd EngSoftware
```

---

## 2. Instalação das Dependências

### Backend (Node.js)
Navegue até a pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

### Frontend (React)
Navegue até a pasta do frontend e instale as dependências:

```bash
cd ../frontend
npm install
```

---

## 3. Configurar o Banco de Dados

1. Crie um banco de dados **PostgreSQL**.
2. No diretório `backend`, crie um arquivo `.env` ou edite o arquivo de configuração do banco.
3. Configure as credenciais de conexão (Host, User, Password, Database).

---

## 4. Rodar o Projeto

Recomenda-se abrir dois terminais separados.

### Terminal 1: Backend

Inicie o servidor Node.js:

```bash
cd backend
npm start
```

### Terminal 2: Frontend

Inicie o servidor React:

```bash
cd frontend
npm start
```
---

Agora, o sistema estará rodando em http://localhost:3000 para o frontend e http://localhost:8080 para o backend.

---

## Equipe de Desenvolvimento
Projeto desenvolvido para fins acadêmicos, com foco na aplicação prática de tecnologias web modernas.  
**Pelos Alunos:**  
Marcos Vinícius Pereira  
Arthur Soares Marques  
Diego Alves Oliveira

---