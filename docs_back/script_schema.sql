-- Script gerado a partir do Documento de Requisitos (Dicionário de Dados). :contentReference[oaicite:1]{index=1}

-- 1) (Opcional) criar o banco se desejar
-- Execute apenas se quiser que o script crie também o DB.
-- CREATE DATABASE vought;
-- \c vought

-- 2) TABELA: usuarios (Tabela: Usuários)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(10) NOT NULL, -- CLIENTE ou ADMIN
    criado_em TIMESTAMP DEFAULT NOW()
);

-- 3) TABELA: enderecos (Tabela: Endereços)
CREATE TABLE IF NOT EXISTS enderecos (
    id_endereco SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(10),
    complemento VARCHAR(50),
    bairro VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    CONSTRAINT fk_endereco_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- 4) TABELA: categorias (Tabela: Categorias)
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- 5) TABELA: produtos (Tabela: Produtos)
CREATE TABLE IF NOT EXISTS produtos (
    id_produto SERIAL PRIMARY KEY,
    id_categoria INT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL,
    CONSTRAINT fk_produto_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- 6) TABELA: pedidos (Tabela: Pedidos)
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_endereco INT,
    data_pedido TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_pedido_endereco FOREIGN KEY (id_endereco) REFERENCES enderecos(id_endereco)
);

-- 7) TABELA: itens_pedido (Tabela: Itens_Pedido)
CREATE TABLE IF NOT EXISTS itens_pedido (
    id_item SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_item_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    CONSTRAINT fk_item_produto FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

-- 8) TABELA: carrinho (Tabela: Carrinho)
-- (No documento o carrinho é descrito com ID_Carrinho, ID_Cliente, ID_Produto, Quantidade)
CREATE TABLE IF NOT EXISTS carrinho (
    id_carrinho SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    CONSTRAINT fk_carrinho_cliente FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_carrinho_produto FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

-- 9) TABELA: tokens_reset (Tabela: Tokens_Reset)
CREATE TABLE IF NOT EXISTS tokens_reset (
    id_token SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    data_expiracao TIMESTAMP NOT NULL,
    CONSTRAINT fk_token_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Índices úteis (opcionais)
CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos (nome);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos (id_cliente);
CREATE INDEX IF NOT EXISTS idx_enderecos_usuario ON enderecos (id_usuario);
