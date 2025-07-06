import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/menu');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Carrinho vazio</h2>
            <p className="text-gray-600 mb-6">
              Adicione alguns produtos ao seu carrinho para começar.
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-primary-500 text-white px-6 py-3 rounded-md hover:bg-primary-600 transition-colors"
            >
              Ver cardápio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={handleContinueShopping}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Voltar ao cardápio</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Carrinho</h1>
          <p className="text-gray-600">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de itens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Itens do pedido
                </h2>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.produto.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      {/* Imagem do produto */}
                      <div className="flex-shrink-0">
                        {item.produto.imagem ? (
                          <img
                            src={item.produto.imagem}
                            alt={item.produto.nome}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Sem imagem</span>
                          </div>
                        )}
                      </div>

                      {/* Informações do produto */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.produto.nome}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {item.produto.descricao}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.produto.preco)} cada
                        </p>
                      </div>

                      {/* Controles de quantidade */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.produto.id, item.quantidade - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        
                        <span className="w-12 text-center text-lg font-medium">
                          {item.quantidade}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.produto.id, item.quantidade + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Preço total do item */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(item.produto.preco * item.quantidade)}
                        </p>
                      </div>

                      {/* Botão remover */}
                      <button
                        onClick={() => removeItem(item.produto.id)}
                        className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="Remover item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Botão limpar carrinho */}
                {items.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Limpar carrinho
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumo do pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Resumo do pedido
              </h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.produto.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantidade}x {item.produto.nome}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.produto.preco * item.quantidade)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
                className="w-full mt-6 bg-primary-500 text-white py-3 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Processando...' : 'Finalizar pedido'}
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Continuar comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 