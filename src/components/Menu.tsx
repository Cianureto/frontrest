import * as React from 'react';
import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Produto } from '../types';
import { clienteAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';

const Menu: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const { addItem } = useCart();

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const data = await clienteAPI.getProdutos();
      setProdutos(data);
    } catch (error: any) {
      setError('Erro ao carregar produtos');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorias = ['todas', ...Array.from(new Set(produtos.map(p => p.categoria)))];

  const produtosFiltrados = categoriaFiltro === 'todas' 
    ? produtos 
    : produtos.filter(p => p.categoria === categoriaFiltro);

  const handleAddToCart = (produto: Produto) => {
    addItem(produto, 1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Carregando cardápio...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cardápio</h1>
          <p className="text-gray-600">Escolha os produtos que deseja pedir</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaFiltro(categoria)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoriaFiltro === categoria
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {categoria === 'todas' ? 'Todas' : categoria}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Produtos */}
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {categoriaFiltro === 'todas' 
                ? 'Nenhum produto disponível no momento.'
                : `Nenhum produto encontrado na categoria "${categoriaFiltro}".`
              }
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtosFiltrados
              .filter(produto => produto.disponivel)
              .map((produto) => (
                <div
                  key={produto.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Imagem do produto */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    {produto.imagem ? (
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Sem imagem</span>
                      </div>
                    )}
                  </div>

                  {/* Informações do produto */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {produto.nome}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {produto.descricao}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">
                        {formatPrice(produto.preco)}
                      </span>
                      
                      <button
                        onClick={() => handleAddToCart(produto)}
                        className="flex items-center space-x-1 bg-primary-500 text-white px-3 py-2 rounded-md hover:bg-primary-600 transition-colors"
                      >
                        <ShoppingCart size={16} />
                        <span className="text-sm">Adicionar</span>
                      </button>
                    </div>

                    <div className="mt-2">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {produto.categoria}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Produtos indisponíveis */}
        {produtosFiltrados.filter(p => !p.disponivel).length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Produtos Indisponíveis</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {produtosFiltrados
                .filter(produto => !produto.disponivel)
                .map((produto) => (
                  <div
                    key={produto.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden opacity-60"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      {produto.imagem ? (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Sem imagem</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {produto.nome}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {produto.descricao}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-400">
                          {formatPrice(produto.preco)}
                        </span>
                        
                        <span className="text-red-500 text-sm font-medium">
                          Indisponível
                        </span>
                      </div>

                      <div className="mt-2">
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {produto.categoria}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu; 