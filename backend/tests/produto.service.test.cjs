describe('produtoServices', () => {
  let produto;
  let produtoServices;
  let produtoRepository;
  let categoriaRepository;

  beforeEach(async () => {
    jest.clearAllMocks();

    const prodRepoMod = await import('../repositories/produtoRepository.js');
    const catRepoMod = await import('../repositories/categoriaRepository.js');

    produtoRepository = prodRepoMod.default;
    categoriaRepository = catRepoMod.default;

    // replace repository functions with jest.fn()
    produtoRepository.getProduto = jest.fn();
    produtoRepository.getProdutos = jest.fn();
    produtoRepository.createProduto = jest.fn();
    produtoRepository.getProdutoByNomeECategoria = jest.fn();
    produtoRepository.updateProduto = jest.fn();
    produtoRepository.deleteProduto = jest.fn();

    // ADICIONAR AS FUNÇÕES QUE O SERVICE USA
    produtoRepository.isReferencedInItensPedido = jest.fn();
    produtoRepository.isReferencedInCarrinho = jest.fn();

    // MOCK PADRÃO = NÃO REFERENCIADO
    produtoRepository.isReferencedInItensPedido.mockResolvedValue(false);
    produtoRepository.isReferencedInCarrinho.mockResolvedValue(false);

    categoriaRepository.getCategoria = jest.fn();

    const serviceMod = await import('../services/produtoServices.js');
    produtoServices = serviceMod.default;

    produto = {
      id_produto: 1,
      nome: 'Notebook',
      preco: 12.5,
      descricao: 'Tecnologia',
      imagem: 'imagem.png',
      estoque: 10,
      id_categoria: 1
    };
  });

  test('createProduto', async () => {
    categoriaRepository.getCategoria.mockResolvedValue({ id_categoria: 1 });
    produtoRepository.getProdutoByNomeECategoria.mockResolvedValue(null);
    produtoRepository.createProduto.mockResolvedValue(produto);

    const res = await produtoServices.createProduto(
      produto.nome,
      produto.preco,
      produto.id_categoria,
      produto.descricao,
      produto.estoque,
      produto.imagem
    );

    expect(res).toBeDefined();
    expect(res.nome).toBe('Notebook');
    expect(produtoRepository.createProduto).toHaveBeenCalledTimes(1);
  });

  test('getProduto', async () => {
    produtoRepository.getProduto.mockResolvedValue(produto);

    const res = await produtoServices.getProduto(1);

    expect(res).toBeDefined();
    expect(res.id_produto).toBe(1);
    expect(produtoRepository.getProduto).toHaveBeenCalledTimes(1);
  });

  test('getProduto_NotFound', async () => {
    produtoRepository.getProduto.mockResolvedValue(null);

    await expect(produtoServices.getProduto(1)).rejects.toThrow('Produto não encontrado.');
  });

  test('updateProduto', async () => {
    produtoRepository.getProduto.mockResolvedValue(produto);
    produtoRepository.getProdutoByNomeECategoria.mockResolvedValue(null);
    produtoRepository.updateProduto.mockResolvedValue(produto);
    categoriaRepository.getCategoria.mockResolvedValue({ id_categoria: 1 });

    const res = await produtoServices.updateProduto(
      1,
      produto.nome,
      produto.preco,
      produto.id_categoria,
      produto.descricao,
      produto.estoque,
      produto.imagem
    );

    expect(res).toBeDefined();
    expect(res.nome).toBe('Notebook');
    expect(produtoRepository.updateProduto).toHaveBeenCalledTimes(1);
  });

  test('deleteProduto', async () => {
    produtoRepository.getProduto.mockResolvedValue(produto);

    // garante que os mocks usados no service retornam false
    produtoRepository.isReferencedInItensPedido.mockResolvedValue(false);
    produtoRepository.isReferencedInCarrinho.mockResolvedValue(false);

    produtoRepository.deleteProduto.mockResolvedValue(produto);

    const res = await produtoServices.deleteProduto(1);

    expect(res).toBeDefined();
    expect(produtoRepository.deleteProduto).toHaveBeenCalledTimes(1);
  });

  test('getProdutos', async () => {
    produtoRepository.getProdutos.mockResolvedValue([produto]);

    const lista = await produtoServices.getProdutos();

    expect(lista.length).toBe(1);
    expect(lista[0].nome).toBe('Notebook');
    expect(produtoRepository.getProdutos).toHaveBeenCalledTimes(1);
  });
});
