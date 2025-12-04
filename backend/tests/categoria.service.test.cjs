// tests/categoria.service.test.cjs

// 1) Mockar os módulos de repositório ANTES de importar o service
jest.mock('../repositories/categoriaRepository.js', () => ({
  __esModule: true,
  default: {
    getAllCategorias: jest.fn(),
    getCategoria: jest.fn(),
    getCategoriaByNome: jest.fn(),
    createCategoria: jest.fn(),
    updateCategoria: jest.fn(),
    deleteCategoria: jest.fn()
  }
}));

jest.mock('../repositories/produtoRepository.js', () => ({
  __esModule: true,
  default: {
    getProdutosByCategoria: jest.fn()
  }
}));

// 2) Agora importe os módulos (os mocks estarão ativos)
const categoriaRepoMod = await import('../repositories/categoriaRepository.js');
const produtoRepoMod = await import('../repositories/produtoRepository.js');

const categoriaRepository = categoriaRepoMod.default;
const produtoRepository = produtoRepoMod.default;

const svcMod = await import('../services/categoriaServices.js');
const categoriaServices = svcMod.default;

describe('categoriaServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createCategoria', async () => {
    categoriaRepository.getCategoriaByNome.mockResolvedValue(null);
    categoriaRepository.createCategoria.mockResolvedValue({ id_categoria: 1, nome: 'Tecnologia' });

    const res = await categoriaServices.createCategoria('Tecnologia');

    expect(res).toBeDefined();
    expect(res.nome).toBe('Tecnologia');
    expect(categoriaRepository.createCategoria).toHaveBeenCalledTimes(1);
  });

  test('getCategoria', async () => {
    categoriaRepository.getCategoria.mockResolvedValue({ id_categoria: 2, nome: 'Acessórios' });

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
    categoriaRepository.getCategoria.mockResolvedValue({ id_categoria: 3, nome: 'Old' });
    categoriaRepository.getCategoriaByNome.mockResolvedValue(null);
    categoriaRepository.updateCategoria.mockResolvedValue({ id_categoria: 3, nome: 'Novo' });

    const res = await categoriaServices.updateCategoria(3, 'Novo');

    expect(res).toBeDefined();
    expect(res.nome).toBe('Novo');
    expect(categoriaRepository.updateCategoria).toHaveBeenCalledTimes(1);
  });

  test('deleteCategoria_with_products_throws', async () => {
    categoriaRepository.getCategoria.mockResolvedValue({ id_categoria: 4, nome: 'Com Produto' });
    produtoRepository.getProdutosByCategoria.mockResolvedValue([{ id_produto: 1 }]);

    await expect(categoriaServices.deleteCategoria(4)).rejects.toThrow('Não é possível excluir esta categoria pois ela está associada a produtos.');
  });

  test('deleteCategoria_success', async () => {
    categoriaRepository.getCategoria.mockResolvedValue({ id_categoria: 5, nome: 'Sem Produto' });
    produtoRepository.getProdutosByCategoria.mockResolvedValue([]);
    categoriaRepository.deleteCategoria.mockResolvedValue({ id_categoria: 5, nome: 'Sem Produto' });

    const res = await categoriaServices.deleteCategoria(5);

    expect(res).toBeDefined();
    expect(categoriaRepository.deleteCategoria).toHaveBeenCalledTimes(1);
  });
});
