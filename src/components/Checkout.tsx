import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, CreditCard, User, Phone, Mail, MapPin } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { clienteAPI } from '../services/api';

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { cliente } = useAuth();
  const navigate = useNavigate();
  
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pedidoId, setPedidoId] = useState<number | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const pedidoData = {
        itens: items.map(item => ({
          produto_id: item.produto.id,
          quantidade: item.quantidade
        })),
        observacoes: observacoes.trim() || undefined,
        cliente: cliente
      };

      const pedido = await clienteAPI.criarPedido(pedidoData);
      setPedidoId(pedido.id);
      setSuccess(true);
      clearCart();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao finalizar pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const handleViewOrders = () => {
    navigate('/pedidos');
  };

  if (success) {
    return (
      <div className="min-h-screen gradient-bg py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Pedido realizado com sucesso!
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Seu pedido #{pedidoId} foi enviado e está sendo preparado.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Total do pedido:</strong> {formatPrice(total)}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Itens:</strong> {items.length} {items.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleViewOrders}
                className="btn-primary flex-1"
              >
                Ver meus pedidos
              </button>
              <button
                onClick={handleBackToMenu}
                className="btn-secondary flex-1"
              >
                Fazer novo pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen gradient-bg py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Carrinho vazio
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Adicione produtos ao carrinho antes de finalizar o pedido.
            </p>
            <button
              onClick={handleBackToMenu}
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
              onClick={() => navigate('/carrinho')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 px-4 py-2 rounded-xl"
            >
              <ArrowLeft size={20} />
              <span>Voltar ao carrinho</span>
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Finalizar pedido
            </h1>
            <p className="text-gray-600 text-lg">Confirme os detalhes do seu pedido</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div>
            <div className="card p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <span>Informações do pedido</span>
              </h2>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações do cliente */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>Dados do cliente</span>
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Nome:</span>
                        <span className="ml-2 text-gray-900">{cliente?.nome}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Telefone:</span>
                        <span className="ml-2 text-gray-900">{cliente?.telefone}</span>
                      </div>
                    </div>
                    {cliente?.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Email:</span>
                          <span className="ml-2 text-gray-900">{cliente.email}</span>
                        </div>
                      </div>
                    )}
                    {cliente?.endereco && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Endereço:</span>
                          <span className="ml-2 text-gray-900">{cliente.endereco}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    id="observacoes"
                    rows={4}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="input-field resize-none"
                    placeholder="Adicione observações especiais para o seu pedido..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Finalizando pedido...</span>
                    </div>
                  ) : (
                    'Confirmar pedido'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Resumo do pedido */}
          <div>
            <div className="card p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <span>Resumo do pedido</span>
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.produto.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <span className="text-gray-900 font-medium">
                        {item.quantidade}x {item.produto.nome}
                      </span>
                    </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 