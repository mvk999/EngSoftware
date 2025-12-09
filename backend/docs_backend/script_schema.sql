/* ============================================================
   BANCO DE DADOS — Vought Tech
   Schema atualizado com tabela de endereços
============================================================ */

/* ------------------------------------------------------------
   1) TABELA: usuarios
------------------------------------------------------------ */
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario  SERIAL PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    cpf         VARCHAR(11)  NOT NULL UNIQUE,
    senha       VARCHAR(255) NOT NULL,
    tipo        VARCHAR(10)  NOT NULL CHECK (tipo IN ('CLIENTE','ADMIN')),
    criado_em   TIMESTAMP DEFAULT NOW()
);

/* ------------------------------------------------------------
   2) TABELA: categorias
------------------------------------------------------------ */
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SERIAL PRIMARY KEY,
    nome         VARCHAR(50) NOT NULL UNIQUE
);
/* ------------------------------------------------------------
   3) TABELA: enderecos
------------------------------------------------------------ */
CREATE TABLE IF NOT EXISTS enderecos (
    id_endereco SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    rua VARCHAR(120) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(80) NOT NULL,
    cidade VARCHAR(80) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    cep VARCHAR(9) NOT NULL,

    CONSTRAINT fk_endereco_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);
/* ------------------------------------------------------------
   4) TABELA: produtos
------------------------------------------------------------ */
CREATE TABLE IF NOT EXISTS produtos (
    id_produto   SERIAL PRIMARY KEY,
    id_categoria INT NOT NULL,
    nome         VARCHAR(100) NOT NULL,
    descricao    TEXT,
    preco        DECIMAL(10,2) NOT NULL,
    estoque      INT NOT NULL CHECK (estoque >= 0),
    imagem       VARCHAR(255),

    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
        ON DELETE RESTRICT
);

/* ------------------------------------------------------------
   5) TABELA: carrinho
------------------------------------------------------------ */
CREATE TABLE IF NOT EXISTS carrinho (
    id_carrinho SERIAL PRIMARY KEY,
    id_cliente  INT NOT NULL,
    id_produto  INT NOT NULL,
    quantidade  INT NOT NULL CHECK (quantidade > 0),

    CONSTRAINT fk_carrinho_cliente FOREIGN KEY (id_cliente)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_carrinho_produto FOREIGN KEY (id_produto)
        REFERENCES produtos(id_produto),

    CONSTRAINT unique_cliente_produto UNIQUE (id_cliente, id_produto)
);

/* ------------------------------------------------------------
   6) TABELA: pedidos
------------------------------------------------------------ */
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido    SERIAL PRIMARY KEY,
    id_cliente   INT NOT NULL,
    data_pedido  TIMESTAMP NOT NULL DEFAULT NOW(),
    status       VARCHAR(20) NOT NULL CHECK (status IN
                    ('pendente','processando','enviado','entregue','cancelado')),
    valor_total  DECIMAL(10,2) NOT NULL DEFAULT 0,
    endereco_id  INT,  -- Relaciona o endereço do pedido

    CONSTRAINT fk_pedido_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES usuarios(id_usuario),

    CONSTRAINT fk_pedido_endereco
        FOREIGN KEY (endereco_id)
        REFERENCES enderecos(id_endereco) -- Fazendo o relacionamento com a tabela de endereços
);

/* ------------------------------------------------------------
   7) TABELA: itens_pedido
------------------------------------------------------------ */
CREATE TABLE IF NOT EXISTS itens_pedido (
    id_item        SERIAL PRIMARY KEY,
    id_pedido      INT NOT NULL,
    id_produto     INT NOT NULL,
    quantidade     INT NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10,2) NOT NULL CHECK (preco_unitario >= 0),

    CONSTRAINT fk_item_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES pedidos(id_pedido)
        ON DELETE CASCADE,

    CONSTRAINT fk_item_produto
        FOREIGN KEY (id_produto)
        REFERENCES produtos(id_produto)
);

/* ------------------------------------------------------------
   8) TABELA: auth_failures
------------------------------------------------------------ */
CREATE TABLE IF NOT EXISTS auth_failures (
    email         VARCHAR(100) PRIMARY KEY,
    tentativas    INT NOT NULL DEFAULT 0,
    bloqueado_ate TIMESTAMP NULL
);

/* ------------------------------------------------------------
   9) TABELA: tokens_reset
------------------------------------------------------------ */
CREATE TABLE IF NOT EXISTS tokens_reset (
    id_token       SERIAL PRIMARY KEY,
    id_usuario     INT NOT NULL UNIQUE,
    token_hash     TEXT NOT NULL,
    data_expiracao TIMESTAMP NOT NULL,
    usado          BOOLEAN DEFAULT false,

    CONSTRAINT fk_token_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);



/* ------------------------------------------------------------
   10) ÍNDICES
------------------------------------------------------------ */
CREATE INDEX IF NOT EXISTS idx_produtos_nome
    ON produtos (nome);

CREATE INDEX IF NOT EXISTS idx_pedidos_cliente
    ON pedidos (id_cliente);

CREATE INDEX IF NOT EXISTS idx_carrinho_cliente
    ON carrinho (id_cliente);

CREATE INDEX IF NOT EXISTS idx_endereco_usuario
    ON enderecos (id_usuario);