// utils/validation.js

function validarEmail(email) {
    return !!email && /^\S+@\S+\.\S+$/.test(email);
}

function validarCPF(cpf) {
    return !!cpf && /^[0-9]{11}$/.test(cpf);
}

function validarTexto(texto, min = 1) {
    return !!texto && texto.trim().length >= min;
}

function validarNumero(valor) {
    return !(valor === null || valor === undefined) && !isNaN(valor);
}

function validarId(id) {
    return Number.isInteger(Number(id)) && Number(id) > 0;
}

function validarSenha(senha) {
    return typeof senha === "string" && senha.trim().length >= 6;
}

function validarQuantidade(qtd) {
    return Number.isInteger(Number(qtd)) && Number(qtd) > 0;
}

function validarPreco(preco) {
    return !isNaN(preco) && Number(preco) > 0;
}

export default {
    validarEmail,
    validarCPF,
    validarTexto,
    validarNumero,
    validarId,
    validarSenha,
    validarQuantidade,
    validarPreco
};
