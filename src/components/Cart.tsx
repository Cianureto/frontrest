import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const navigate = useNavigate();
  const [loading] = useState(false);

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
      <div className="min-h-screen gradient-bg py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Carrinho vazio
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Adicione alguns produtos ao seu carrinho para começar.
            </p>
            <button
              onClick={handleContinueShopping}
              className="btn-primary"
            >
              Ver cardápio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={handleContinueShopping}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 px-4 py-2 rounded-xl"
            >
              <ArrowLeft size={20} />
              <span>Voltar ao cardápio</span>
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Seu Carrinho
            </h1>
            <p className="text-gray-600 text-lg">
              {itemCount} {itemCount === 1 ? 'item' : 'itens'} no carrinho
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de itens */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Package className="w-6 h-6 text-blue-600" />
                <span>Itens do pedido</span>
              </h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.produto.id}
                    className="flex items-center space-x-4 p-6 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                  >
                    {/* Imagem do produto */}
                    <div className="flex-shrink-0">
                      {item.produto.imagem ? (
                        <img
                          src={item.produto.imagem}
                          alt={item.produto.nome}
                          className="w-20 h-20 object-cover rounded-xl shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-md">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Informações do produto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.produto.nome}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {item.produto.descricao}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        {formatPrice(item.produto.preco)} cada
                      </p>
                    </div>

                    {/* Controles de quantidade */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.produto.id, item.quantidade - 1)}
                        className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span className="w-16 text-center text-lg font-bold text-gray-900">
                        {item.quantidade}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.produto.id, item.quantidade + 1)}
                        className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Preço total do item */}
                    <div className="text-right">
                      <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(item.produto.preco * item.quantidade)}
                      </p>
                    </div>

                    {/* Botão remover */}
                    <button
                      onClick={() => removeItem(item.produto.id)}
                      className="flex-shrink-0 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
                      title="Remover item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Botão limpar carrinho */}
              {items.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    Limpar carrinho
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Resumo do pedido */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span>Resumo do pedido</span>
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.produto.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantidade}x {item.produto.nome}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(item.produto.preco * item.quantidade)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
                className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processando...</span>
                  </div>
                ) : (
                  'Finalizar pedido'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 