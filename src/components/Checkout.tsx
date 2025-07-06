import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pedido realizado com sucesso!
            </h2>
            <p className="text-gray-600 mb-4">
              Seu pedido #{pedidoId} foi enviado e está sendo preparado.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Total do pedido:</strong> {formatPrice(total)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Itens:</strong> {items.length} {items.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleViewOrders}
                className="flex-1 bg-primary-500 text-white px-6 py-3 rounded-md hover:bg-primary-600 transition-colors"
              >
                Ver meus pedidos
              </button>
              <button
                onClick={handleBackToMenu}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Carrinho vazio
            </h2>
            <p className="text-gray-600 mb-6">
              Adicione produtos ao carrinho antes de finalizar o pedido.
            </p>
            <button
              onClick={handleBackToMenu}
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
              onClick={() => navigate('/carrinho')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Voltar ao carrinho</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar pedido</h1>
          <p className="text-gray-600">Confirme os detalhes do seu pedido</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informações do pedido
              </h2>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações do cliente */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Dados do cliente
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Nome:</span>
                      <span className="ml-2 text-gray-900">{cliente?.nome}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Telefone:</span>
                      <span className="ml-2 text-gray-900">{cliente?.telefone}</span>
                    </div>
                    {cliente?.email && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Email:</span>
                        <span className="ml-2 text-gray-900">{cliente.email}</span>
                      </div>
                    )}
                    {cliente?.endereco && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Endereço:</span>
                        <span className="ml-2 text-gray-900">{cliente.endereco}</span>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Instruções especiais, pedidos de modificação, etc."
                  />
                </div>

                {/* Botão finalizar */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 text-white py-3 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processando...' : 'Confirmar pedido'}
                </button>
              </form>
            </div>
          </div>

          {/* Resumo do pedido */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Resumo do pedido
              </h2>

              {/* Lista de itens */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.produto.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.quantidade}x {item.produto.nome}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.produto.preco)} cada
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(item.produto.preco * item.quantidade)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Informações importantes
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Seu pedido será preparado assim que confirmado</li>
                  <li>• Você receberá atualizações sobre o status</li>
                  <li>• O tempo de preparo pode variar conforme a demanda</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 