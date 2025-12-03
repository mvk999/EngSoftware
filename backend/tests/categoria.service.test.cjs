describe('categoriaServices', () => {
  let categoriaServices;
  let categoriaRepository;
  let produtoRepository;

  beforeEach(async () => {
    jest.clearAllMocks();

    const catRepoMod = await import('../repositories/categoriaRepository.js');
    const prodRepoMod = await import('../repositories/produtoRepository.js');

    categoriaRepository = catRepoMod.default;
    produtoRepository = prodRepoMod.default;

    categoriaRepository.getAllCategorias = jest.fn();
    categoriaRepository.getCategoria = jest.fn();
    categoriaRepository.getCategoriaByNome = jest.fn();
    categoriaRepository.createCategoria = jest.fn();
    categoriaRepository.updateCategoria = jest.fn();
    categoriaRepository.deleteCategoria = jest.fn();

    produtoRepository.getProdutosByCategoria = jest.fn();

    const svc = await import('../services/categoriaServices.js');
    categoriaServices = svc.default;
  });

  test('createCategoria', async () => {
    categoriaRepository.getCategoriaByNome.mockResolvedValue(null);
    categoriaRepository.createCategoria.mockResolvedValue({ id: 1, nome: 'Tecnologia' });

    const res = await categoriaServices.createCategoria('Tecnologia');

    expect(res).toBeDefined();
    expect(res.nome).toBe('Tecnologia');
    expect(categoriaRepository.createCategoria).toHaveBeenCalledTimes(1);
  });

  test('getCategoria', async () => {
    categoriaRepository.getCategoria.mockResolvedValue({ id: 2, nome: 'Acessórios' });

    const res = await categoriaServices.getCategoria(2);

    expect(res).toBeDefined();
    expect(res.nome).toBe('Acessórios');
    expect(categoriaRepository.getCategoria).toHaveBeenCalledTimes(1);
  });

  test('getCategoria_NotFound', async () => {
    categoriaRepository.getCategoria.mockResolvedValue(null);

    await expect(categoriaServices.getCategoria(99)).rejects.toThrow('Categoria não encontrada.');
  });

  test('updateCategoria', async () => {
    categoriaRepository.getCategoria.mockResolvedValue({ id: 3, nome: 'Old' });
    categoriaRepository.getCategoriaByNome.mockResolvedValue(null);
    categoriaRepository.updateCategoria.mockResolvedValue({ id: 3, nome: 'Novo' });

    const res = await categoriaServices.updateCategoria(3, 'Novo');

    expect(res).toBeDefined();
    expect(res.nome).toBe('Novo');
    expect(categoriaRepository.updateCategoria).toHaveBeenCalledTimes(1);
  });

  test('deleteCategoria_with_products_throws', async () => {
    categoriaRepository.getCategoria.mockResolvedValue({ id: 4, nome: 'Com Produto' });
    produtoRepository.getProdutosByCategoria.mockResolvedValue([{ id_produto: 1 }]);

    await expect(categoriaServices.deleteCategoria(4)).rejects.toThrow('Não é possível excluir esta categoria pois ela está associada a produtos.');
  });

  test('deleteCategoria_success', async () => {
    categoriaRepository.getCategoria.mockResolvedValue({ id: 5, nome: 'Sem Produto' });
    produtoRepository.getProdutosByCategoria.mockResolvedValue([]);
    categoriaRepository.deleteCategoria.mockResolvedValue({ id: 5, nome: 'Sem Produto' });

    const res = await categoriaServices.deleteCategoria(5);

    expect(res).toBeDefined();
    expect(categoriaRepository.deleteCategoria).toHaveBeenCalledTimes(1);
  });
});
