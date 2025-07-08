import * as React from 'react';
import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Clock, TrendingUp } from 'lucide-react';
import { Produto } from '../types';
import { clienteAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Menu: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [topProdutos, setTopProdutos] = useState<Produto[]>([]);
  const [configuracoes, setConfiguracoes] = useState<any>(null);
  const { addItem } = useCart();

  useEffect(() => {
    carregarProdutos();
    clienteAPI.getTopProdutos().then(setTopProdutos).catch(() => setTopProdutos([]));
    clienteAPI.getConfiguracoes().then(setConfiguracoes).catch(() => setConfiguracoes(null));
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

  // Setas personalizadas para o carrossel
  const Arrow = (props: any) => {
    const { className, style, onClick, direction } = props;
    return (
      <button
        className={
          `${className} z-10 bg-white shadow-lg rounded-full flex items-center justify-center w-12 h-12 border-2 border-blue-200 hover:border-blue-500 transition-all duration-200` +
          (direction === 'left' ? ' -left-6' : ' -right-6')
        }
        style={{ ...style, display: 'flex', position: 'absolute', top: '40%' }}
        onClick={onClick}
        aria-label={direction === 'left' ? 'Anterior' : 'Próximo'}
        type="button"
      >
        {direction === 'left' ? (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        ) : (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        )}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg text-gray-600 font-medium">Carregando cardápio...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header do Restaurante */}
        {configuracoes && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start space-x-6">
              {configuracoes.photo && (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                  <img 
                    src={configuracoes.photo} 
                    alt={configuracoes.name || 'Restaurante'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {configuracoes.name || 'Restaurante'}
                </h1>
                {configuracoes.description && (
                  <p className="text-gray-600 text-lg mb-4">{configuracoes.description}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {configuracoes.phone && (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">{configuracoes.phone}</span>
                    </div>
                  )}
                  
                  {configuracoes.hours && (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">{configuracoes.hours}</span>
                    </div>
                  )}
                  
                  {configuracoes.address && (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">{configuracoes.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Carrossel de Mais Pedidos */}
        {topProdutos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
              <TrendingUp className="inline-block text-blue-600" /> Mais Pedidos
            </h2>
            <Slider
              dots={false}
              infinite={true}
              speed={500}
              slidesToShow={Math.min(3, topProdutos.length)}
              slidesToScroll={1}
              arrows={true}
              nextArrow={<Arrow direction="right" />}
              prevArrow={<Arrow direction="left" />}
              className="mx-auto max-w-4xl"
              responsive={[
                { breakpoint: 1024, settings: { slidesToShow: 2 } },
                { breakpoint: 640, settings: { slidesToShow: 1 } }
              ]}
            >
              {topProdutos.map((produto) => (
                <div key={produto.id} className="px-2">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center p-4 h-64 justify-between">
                    <div className="h-28 w-28 flex items-center justify-center mb-2">
                      {produto.imagem ? (
                        <img src={produto.imagem} alt={produto.nome} className="object-cover w-full h-full rounded-full border-2 border-blue-200" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                          <Star className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 text-center line-clamp-1">{produto.nome}</h3>
                    <span className="text-blue-600 font-bold text-xl">{formatPrice(produto.preco)}</span>
                    <button
                      onClick={() => handleAddToCart(produto)}
                      className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <ShoppingCart size={16} /> <span className="ml-2">Adicionar</span>
                    </button>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Nosso Cardápio
          </h1>
          <p className="text-gray-600 text-lg">Descubra sabores incríveis</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>{error}</span>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaFiltro(categoria)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  categoriaFiltro === categoria
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg'
                }`}
              >
                {categoria === 'todas' ? 'Todas as categorias' : categoria}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Produtos */}
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600">
              {categoriaFiltro === 'todas' 
                ? 'Nenhum produto disponível no momento.'
                : `Nenhum produto encontrado na categoria "${categoriaFiltro}".`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtosFiltrados
              .filter(produto => produto.disponivel)
              .map((produto) => (
                <div
                  key={produto.id}
                  className="card group hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  {/* Imagem do produto */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                    {produto.imagem ? (
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Star className="w-8 h-8 text-gray-400" />
                          </div>
                          <span className="text-gray-400 text-sm">Sem imagem</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Badge de categoria */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                        {produto.categoria}
                      </span>
                    </div>
                  </div>

                  {/* Informações do produto */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {produto.nome}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {produto.descricao}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(produto.preco)}
                      </span>
                      
                      <button
                        onClick={() => handleAddToCart(produto)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <ShoppingCart size={16} />
                        <span className="text-sm font-medium">Adicionar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Produtos indisponíveis */}
        {produtosFiltrados.filter(p => !p.disponivel).length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Produtos Indisponíveis</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {produtosFiltrados
                .filter(produto => !produto.disponivel)
                .map((produto) => (
                  <div
                    key={produto.id}
                    className="card opacity-60"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                      {produto.imagem ? (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Clock className="w-8 h-8 text-gray-400" />
                            </div>
                            <span className="text-gray-400 text-sm">Sem imagem</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute top-3 left-3">
                        <span className="bg-gray-500/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Indisponível
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {produto.nome}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {produto.descricao}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-400">
                          {formatPrice(produto.preco)}
                        </span>
                        
                        <button
                          disabled
                          className="flex items-center space-x-2 bg-gray-300 text-gray-500 px-4 py-2 rounded-xl cursor-not-allowed"
                        >
                          <Clock size={16} />
                          <span className="text-sm font-medium">Indisponível</span>
                        </button>
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