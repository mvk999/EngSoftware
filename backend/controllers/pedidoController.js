import pedidoServices from "../services/pedidoServices.js";
import { AppError } from "../utils/error.js";

async function getAllPedidos(req, res) {
    try {
        const resultado = await pedidoServices.getAllPedidos();
        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) return res.status(err.statusCode).send(err.message);
        res.status(500).send("Erro ao buscar pedidos.");
    }
}

async function getPedido(req, res) {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send("Informe o ID do pedido.");

        const resultado = await pedidoServices.getPedido(id);
        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) return res.status(err.statusCode).send(err.message);
        res.status(500).send("Erro ao buscar pedido.");
    }
}

async function criarPedido(req, res) {
    try {
        const { clienteId } = req.params;

        if (!clienteId) return res.status(400).send("Informe o ID do cliente.");

        const resultado = await pedidoServices.criarPedido(clienteId);
        res.status(201).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) return res.status(err.statusCode).send(err.message);
        res.status(500).send("Erro ao criar pedido.");
    }
}

async function atualizarStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id || !status) return res.status(400).send("ID e status são obrigatórios.");

        const resultado = await pedidoServices.atualizarStatus(id, status);
        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) return res.status(err.statusCode).send(err.message);
        res.status(500).send("Erro ao atualizar status do pedido.");
    }
}

async function cancelarPedido(req, res) {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send("Informe o ID do pedido.");

        const resultado = await pedidoServices.cancelarPedido(id);
        res.status(200).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) return res.status(err.statusCode).send(err.message);
        res.status(500).send("Erro ao cancelar pedido.");
    }
}

export default {
    getAllPedidos,
    getPedido,
    criarPedido,
    atualizarStatus,
    cancelarPedido
};
