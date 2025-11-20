import carrinhoServices from "../services/carrinhoServices.js";
import { AppError } from "../utils/error.js";

async function getCarrinho(req, res) {
    try {
        // pegar variáveis
        const { clienteId } = req.params;

        // validar
        if (!clienteId) {
            return res.status(400).send("Informe o ID do cliente.");
        }

        // chamar service
        const resultado = await carrinhoServices.getCarrinho(clienteId);

        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro ao buscar carrinho.");
    }
}

async function adicionarItem(req, res) {
    try {
        // pegar variáveis
        const { clienteId } = req.params;
        const { produtoId, quantidade } = req.body;

        // validar
        if (!clienteId || !produtoId || !quantidade) {
            return res.status(400).send("clienteId, produtoId e quantidade são obrigatórios.");
        }

        // chamar service
        const resultado = await carrinhoServices.adicionarItem(clienteId, produtoId, quantidade);

        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro ao adicionar item ao carrinho.");
    }
}

async function atualizarItem(req, res) {
    try {
        // pegar variáveis
        const { clienteId, produtoId } = req.params;
        const { quantidade } = req.body;

        // validar
        if (!clienteId || !produtoId || !quantidade) {
            return res.status(400).send("clienteId, produtoId e quantidade são obrigatórios.");
        }

        // chamar service
        const resultado = await carrinhoServices.atualizarItem(clienteId, produtoId, quantidade);

        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro ao atualizar item do carrinho.");
    }
}

async function removerItem(req, res) {
    try {
        // pegar variáveis
        const { clienteId, produtoId } = req.params;

        // validar
        if (!clienteId || !produtoId) {
            return res.status(400).send("clienteId e produtoId são obrigatórios.");
        }

        // chamar service
        const resultado = await carrinhoServices.removerItem(clienteId, produtoId);

        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro ao remover item do carrinho.");
    }
}

async function limparCarrinho(req, res) {
    try {
        // pegar variáveis
        const { clienteId } = req.params;

        // validar
        if (!clienteId) {
            return res.status(400).send("Informe o ID do cliente.");
        }

        // chamar service
        await carrinhoServices.limparCarrinho(clienteId);

        res.status(200).send("Carrinho esvaziado com sucesso.");

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro ao limpar carrinho.");
    }
}

export default {
    getCarrinho,
    adicionarItem,
    atualizarItem,
    removerItem,
    limparCarrinho
};
