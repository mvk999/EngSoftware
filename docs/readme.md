# 📚 Documentação do Projeto – EngSoftware

Este diretório (`docs/`) contém toda a **documentação do projeto** em Markdown, organizada para uso no **Obsidian** (ou direto pelo GitHub).

---

## 🗂 Estrutura

docs/
│── README.md
│── Requisitos.md
│── HistoriasUsuario.md
│── templates/
││ ├── HU_template.md
││ └── TelaFigma_template.md
│── sprints/
││ ├── Sprint1/
││ │ ├── HU01.md
││ │ ├── HU02.md
││ │ ├── HU03.md
││ │ └── HU04.md
││ └── Sprint2/
││ ├── HU05.md
││ ├── HU06.md
││ ├── HU07.md
││ └── HU08.md
│── figma/
│ ├── TelaLogin.md
│ ├── TelaCatalogoProdutos.md
│ ├── TelaCadastroUsuario.md
│ └── TelaDetalhesProduto.md

yaml
Copiar código

- **`Requisitos.md`**: requisitos funcionais e não funcionais.
- **`HistoriasUsuario.md`**: índice com links para todas as HUs.
- **`sprints/`**: HUs organizadas por sprint.
- **`figma/`**: páginas com links e notas das telas do Figma.
- **`templates/`**: modelos prontos para duplicar.

---

## 🔧 Abrir no Obsidian

1. Obsidian → **Abrir pasta como Vault** → selecione `docs/`.
2. Use o **Graph View** para navegar (HUs linkam para requisitos e telas do Figma).

---

## ✍️ Como criar uma nova HU

1. Duplique `templates/HU_template.md`.
2. Renomeie para `sprints/SprintX/HUYY.md` (ex.: `sprints/Sprint1/HU04.md`).
3. Preencha os campos.
4. Adicione o link em `HistoriasUsuario.md`.

---

## 🧩 Convenções

- **IDs de HU**: `HU01`, `HU02`, …
- **Commits**: mensagens claras, ex.: `📝 HU03: critérios de aceite`.
- **Links internos**: use `[[HU01]]`, `[[TelaLogin]]`, `[[Requisitos]]` para o Obsidian montar o grafo.

---

## ⚠️ Sobre o `.obsidian/`

- Ignore workspace e plugins para evitar conflitos entre máquinas.
- Já há um `.gitignore` específico em `docs/.gitignore`.

---
docs/Requisitos.md
markdown
Copiar código
# 📄 Requisitos

> Documento base de requisitos do sistema.

## 1. Escopo Resumido
- E-commerce tech com catálogo, carrinho, checkout, autenticação com perfis **Usuário** e **Admin**.

## 2. Personas (resumo)
- **Cliente**: navega, compra e acompanha pedidos.
- **Admin**: gerencia catálogo, estoque, preços e pedidos.

## 3. Requisitos Funcionais (RF)
- **RF-01**: Autenticar usuário com e-mail e senha.
- **RF-02**: Cadastrar novo usuário.
- **RF-03**: Listar catálogo de produtos com filtros.
- **RF-04**: Exibir detalhes do produto.
- **RF-05**: Adicionar/remover itens do carrinho.
- **RF-06**: Finalizar compra (checkout).
- **RF-07**: Consultar pedidos do usuário.
- **RF-08**: (Admin) CRUD de produtos.
- **RF-09**: (Admin) Gerenciar pedidos.

> Ver histórias de usuário: [[HistoriasUsuario]]

## 4. Requisitos Não Funcionais (RNF)
- **RNF-01**: Autenticação via JWT.
- **RNF-02**: Tempo de resposta de página < 2s em 95% das requisições.
- **RNF-03**: Disponibilidade ≥ 99%.
- **RNF-04**: LGPD: armazenar senhas com hash e sal; políticas de privacidade.
- **RNF-05**: Auditoria básica de ações administrativas.

## 5. Restrições
- Back-end: Spring Boot.
- Front-end: React.
- DB: MySQL.

## 6. Rastreabilidade (exemplos)
- **RF-01** ↔ [[HU01]] (Login) ↔ [[TelaLogin]]
- **RF-03** ↔ [[HU03]] (Catálogo) ↔ [[TelaCatalogoProdutos]]
- **RF-04** ↔ [[HU04]] (Detalhes) ↔ [[TelaDetalhesProduto]]

## 7. Critérios de Pronto (DoD)
- Código versionado e testado.
- Critérios de aceite das HUs atendidos.
- Documentação atualizada em `docs/`.
docs/HistoriasUsuario.md
markdown
Copiar código
# 🧑‍💻 Histórias de Usuário (Índice)

> Clique nas HUs para abrir (Obsidian/GitHub).

## Sprint 1
- [[HU01]] – Login de Usuário
- [[HU02]] – Cadastro de Usuário
- [[HU03]] – Catálogo de Produtos
- [[HU04]] – Detalhe de Produto

## Sprint 2
- [[HU05]] – Carrinho de Compras
- [[HU06]] – Checkout/Pagamento
- [[HU07]] – Meus Pedidos
- [[HU08]] – Admin: Gerenciar Produtos

> Demais histórias: [[HU13]] (se existir), etc.

## Telas Figma (atalhos)
- [[TelaLogin]]
- [[TelaCatalogoProdutos]]
- [[TelaCadastroUsuario]]
- [[TelaDetalhesProduto]]

## Requisitos
- [[Requisitos]]