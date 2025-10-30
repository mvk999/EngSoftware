# Projeto: Especificação de Requisitos (ERS) - Vought Tech E-commerce

Este repositório contém o documento formal de **Especificação de Requisitos de Software (ERS)** para um sistema fictício de e-commerce de produtos de tecnologia, a "Vought Tech". Arquivo nomeado como "RequisitosRFeRNF

## 1. Objetivo do Documento

O objetivo deste documento é definir e catalogar formalmente todos os requisitos funcionais, não-funcionais e regras de negócio necessárias para guiar o desenvolvimento do software. Ele serve como a "fonte da verdade" para a equipe de desenvolvimento e stakeholders, garantindo que o produto final atenda a todos os critérios definidos.


## 2. Autores

* Marcos Vinícius Pereira
* Arthur Soares Marques
* Diego Alves Oliveira

## 3. Escopo do Sistema (Vought Tech)

O sistema de e-commerce definido neste ERS inclui as seguintes funcionalidades principais:

* **Gerenciamento de Contas:** Cadastro, login (obrigatório) e recuperação de senha para Clientes e Administradores.
* **Catálogo de Produtos:** Gerenciamento CRUD de Categorias e Produtos.
* **Jornada de Compra (Estética):** Funcionalidades de busca, filtro, carrinho de compras e um checkout simulado (sem processamento de pagamento real).
* **Painel Administrativo:** Interface para administradores processarem pedidos (dando baixa no estoque) e gerenciarem o catálogo.

## 4. Estrutura do Documento ERS

O documento `.pdf` está estruturado para atender a diretrizes específicas de Engenharia de Software, incluindo:

* **Requisitos Funcionais (RFs):** 13+ requisitos detalhados, incluindo operações CRUD em 1 tabela (ex: `Categorias`) e em 3+ tabelas (ex: `Pedidos` + `Itens_Pedido` + `Produtos`).
* **Requisitos Não-Funcionais (RNFs):** 4+ RNFs definidos, cobrindo áreas críticas como **Desempenho**, **Integridade de Dados**, **Segurança** e **Disponibilidade**.
* **Regras de Negócio (RBRs):** Definição de regras que regem o sistema (ex: `RBR-001` - Obrigatoriedade do Login).
* **Padrões de Verificação:** Uma seção dedicada (Seção 4) que define as regras para a própria documentação (baseado em Magela), incluindo a obrigatoriedade de `Fonte` e `Prioridade` para cada requisito.
* **Rastreabilidade:** Uma diretriz explícita que conecta os requisitos deste documento (ex: `RF-007`) aos protótipos de tela do projeto.