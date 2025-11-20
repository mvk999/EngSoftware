async function getAllProdutos(req, res) {
    try {
        const resultado = await produtoServices.getAllProdutos();
        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) return res.status(err.statusCode).send(err.message);
        res.status(500).send("Erro ao buscar produtos.");
    }
}

async function createProduto(req, res) {
    try {
        const { nome, preco, categoriaId, descricao, estoque } = req.body;

        if (!nome || !preco || !categoriaId) {
            return res.status(400).send("Nome, preço e categoria são obrigatórios.");
        }

        const resultado = await produtoServices.createProduto(
            nome,
            preco,
            categoriaId,
            descricao,
            estoque
        );

        res.status(201).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) return res.status(err.statusCode).send(err.message);
        res.status(500).send("Erro ao criar produto.");
    }
}

async function updateProduto(req, res) {
    try {
        const { id } = req.params;
        const { nome, preco, categoriaId, descricao, estoque } = req.body;

        if (!id) return res.status(400).send("Informe o ID do produto.");

        const resultado = await produtoServices.updateProduto(
            id,
            nome,
            preco,
            categoriaId,
            descricao,
            estoque
        );

        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) return res.status(err.statusCode).send(err.message);
        res.status(500).send("Erro ao atualizar produto.");
    }
}

async function deleteProduto(req, res) {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send("Informe o ID do produto.");

        const resultado = await produtoServices.deleteProduto(id);
        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) return res.status(err.statusCode).send(err.message);
        res.status(500).send("Erro ao excluir produto.");
    }
}

export default {
    getAllProdutos,
    createProduto,
    updateProduto,
    deleteProduto
};
