async function createCliente(req, res) {
    try {
        const { nome, email, cpf, senha } = req.body;

        if (!nome || !email || !cpf || !senha) {
            return res.status(400).send("Nome, email, CPF e senha são obrigatórios.");
        }

        const resultado = await clienteServices.createCliente(nome, email, cpf, senha);

        res.status(201).send(resultado);

    } catch (err) {
        console.log(err);
        if (err instanceof AppError) {
            return res.status(err.statusCode).send(err.message);
        }
        res.status(500).send("Erro ao criar cliente.");
    }
}
export default {
    createCliente
};

import clienteServices from "../services/clienteServices.js";
import { AppError } from "../utils/error.js";
