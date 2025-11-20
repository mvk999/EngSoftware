function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

function validarCPF(cpf) {
    return /^[0-9]{11}$/.test(cpf);
}

function validarTexto(texto, min = 1) {
    return texto && texto.trim().length >= min;
}

function validarNumero(valor) {
    return !isNaN(valor) && Number(valor) >= 0;
}

function validarId(id) {
    return Number.isInteger(Number(id)) && Number(id) > 0;
}

export default {
    validarEmail,
    validarCPF,
    validarTexto,
    validarNumero,
    validarId
};
