describe('clienteServices', () => {
  let clienteServices;
  let clienteRepository;

  beforeEach(async () => {
    jest.clearAllMocks();

    const cliRepoMod = await import('../repositories/clienteRepository.js');
    clienteRepository = cliRepoMod.default;

    clienteRepository.getClienteByEmail = jest.fn();
    clienteRepository.getClienteByCPF = jest.fn();
    clienteRepository.createCliente = jest.fn();
    clienteRepository.getCliente = jest.fn();

    const svc = await import('../services/clienteServices.js');
    clienteServices = svc.default;
  });

  test('createCliente_success', async () => {
    clienteRepository.getClienteByEmail.mockResolvedValue(null);
    clienteRepository.getClienteByCPF.mockResolvedValue(null);
    clienteRepository.createCliente.mockResolvedValue({ id: 1, nome: 'João', email: 'joao@example.com' });

    const res = await clienteServices.createCliente('João', 'joao@example.com', '12345678901', 'abcdef');

    expect(res).toBeDefined();
    expect(res.email).toBe('joao@example.com');
    expect(clienteRepository.createCliente).toHaveBeenCalledTimes(1);
  });

  test('createCliente_invalid_email', async () => {
    await expect(clienteServices.createCliente('Ana', 'invalid-email', '12345678901', 'abcdef'))
      .rejects.toThrow('Email inválido.');
  });

  test('createCliente_duplicate_email', async () => {
    clienteRepository.getClienteByEmail.mockResolvedValue({ id: 2, email: 'ana@example.com' });

    await expect(clienteServices.createCliente('Ana', 'ana@example.com', '12345678902', 'abcdef'))
      .rejects.toThrow('Email já está em uso.');
  });

  test('createCliente_duplicate_cpf', async () => {
    clienteRepository.getClienteByEmail.mockResolvedValue(null);
    clienteRepository.getClienteByCPF.mockResolvedValue({ id: 3, cpf: '12345678903' });

    await expect(clienteServices.createCliente('Carlos', 'carlos@example.com', '12345678903', 'abcdef'))
      .rejects.toThrow('CPF já cadastrado.');
  });

  test('getClienteById_success', async () => {
    clienteRepository.getCliente.mockResolvedValue({ id: 10, nome: 'Mariana' });

    const res = await clienteServices.getClienteById(10);

    expect(res).toBeDefined();
    expect(res.nome).toBe('Mariana');
    expect(clienteRepository.getCliente).toHaveBeenCalledTimes(1);
  });

  test('getClienteById_not_found', async () => {
    clienteRepository.getCliente.mockResolvedValue(null);

    await expect(clienteServices.getClienteById(999)).rejects.toThrow('Cliente não encontrado.');
  });
});
