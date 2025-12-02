import pedidoService from "../services/pedidoServices.js";
import { AppError } from "../utils/error.js";

// =========================
// ADMIN — listar todos
// =========================
async function getAllPedidos(req, res) {
  try {
    const pedidos = await pedidoService.getAllPedidos();
    return res.status(200).json(pedidos);
  } catch (err) {
    console.error("pedidoController.getAllPedidos:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao buscar pedidos." });
  }
}

// =========================
// ADMIN — pedido por ID
// =========================
async function getPedido(req, res) {
  try {
    const { id } = req.params;
    const pedido = await pedidoService.getPedido(id);
    return res.status(200).json(pedido);
  } catch (err) {
    console.error("pedidoController.getPedido:", err);
    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao buscar pedido." });
  }
}

// =========================
// CLIENTE — histórico próprio
// =========================
async function getPedidosByCliente(req, res) {
  try {
    const clienteId = req.user.id;
    const pedidos = await pedidoService.getPedidosByCliente(clienteId);
    return res.status(200).json(pedidos);
  } catch (err) {
    console.error("pedidoController.getPedidosByCliente:", err);
    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao buscar pedidos." });
  }
}

// =========================
// CLIENTE — criar pedido
// =========================
async function criarPedido(req, res) {
  try {
    const clienteId = req.user && req.user.id;  // vindo do token
    const enderecoId = req.body.enderecoId ?? req.body.endereco_id;

    if (!enderecoId) {
      return res.status(400).json({ message: "Endereço é obrigatório." });
    }

    const pedido = await pedidoService.criarPedido(clienteId, enderecoId);

    // Ajuste: retornar objeto completo com itens e valorTotal
    return res.status(201).json({
      idPedido: pedido.id_pedido,
      clienteId: pedido.id_cliente,
      status: pedido.status,
      valorTotal: pedido.valor_total,
      endereco: pedido.endereco,
      itens: pedido.itens
    });
  } catch (err) {
    console.error("pedidoController.criarPedido:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao criar pedido." });
  }
}

// =========================
// ADMIN — atualizar status
// =========================
async function atualizarStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validos = [
      "pendente",
      "processando",
      "enviado",
      "entregue",
      "cancelado"
    ];

    if (!validos.includes(status)) {
      return res.status(400).json({
        message: "Status inválido. Utilize: " + validos.join(", ")
      });
    }

    const atualizado = await pedidoService.atualizarStatus(
      id,
      status,
      req.user.id // admin responsável
    );

    return res.status(200).json(atualizado);
  } catch (err) {
    console.error("pedidoController.atualizarStatus:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao atualizar status." });
  }
}

// =========================
// CLIENTE — cancelar pedido próprio
// =========================
async function cancelarPedidoCliente(req, res) {
  try {
    const { id } = req.params;
    const clienteId = req.user.id;

    const resultado = await pedidoService.cancelarPedidoCliente(
      id,
      clienteId
    );

    return res.status(200).json(resultado);
  } catch (err) {
    console.error("pedidoController.cancelarPedidoCliente:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao cancelar pedido." });
  }
}

// =========================
// ADMIN — cancelar pedido
// =========================
async function cancelarPedidoAdmin(req, res) {
  try {
    const { id } = req.params;

    const resultado = await pedidoService.cancelarPedidoAdmin(id);

    return res.status(200).json(resultado);
  } catch (err) {
    console.error("pedidoController.cancelarPedidoAdmin:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res
      .status(500)
      .json({ message: "Erro ao cancelar pedido (admin)." });
  } 
}

// =========================
// CLIENTE — atualizar item do pedido
// =========================
async function atualizarItemPedido(req, res) {
  try {
    const { pedidoId, produtoId } = req.params;
    const { quantidade } = req.body;

    if (!quantidade) {
      return res.status(400).json({ message: "Quantidade é obrigatória." });
    }

    const atualizado = await pedidoService.atualizarItemPedido(
      pedidoId,
      produtoId,
      quantidade
    );

    // Ajuste: retornar objeto completo com itens e valorTotal
    return res.status(200).json({
      idPedido: atualizado.id_pedido,
      clienteId: atualizado.id_cliente,
      status: atualizado.status,
      valorTotal: atualizado.valor_total,
      endereco: atualizado.endereco,
      itens: atualizado.itens
    });
  } catch (err) {
    console.error("pedidoController.atualizarItemPedido:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao atualizar item do pedido." });
  }
}

// =========================
// ADMIN — deletar pedido
// =========================
async function deletarPedido(req, res) {
  try {
    const { id } = req.params;

    const resultado = await pedidoService.deletarPedido(id);

    return res.status(200).json(resultado);
  } catch (err) {
    console.error("pedidoController.deletarPedido:", err);

    if (err instanceof AppError)
      return res.status(err.statusCode).json({ message: err.message });

    return res.status(500).json({ message: "Erro ao deletar pedido." });
  }
}

export default {
  getAllPedidos,
  getPedido,
  getPedidosByCliente,
  criarPedido,
  atualizarStatus,
  cancelarPedidoCliente,
  cancelarPedidoAdmin,
  atualizarItemPedido,
  deletarPedido
};