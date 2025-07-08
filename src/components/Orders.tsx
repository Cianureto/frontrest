import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, TrendingUp, Calendar } from 'lucide-react';
import { Pedido } from '../types';
import { clienteAPI } from '../services/api';

const Orders: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarPedidos();
    const interval = setInterval(() => {
      carregarPedidos();
    }, 5000); // Atualiza a cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const data = await clienteAPI.getPedidos();
      setPedidos(data);
    } catch (error: any) {
      setError('Erro ao carregar pedidos');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pendente':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200',
          text: 'Pendente'
        };
      case 'preparando':
        return {
          icon: Package,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200',
          text: 'Preparando'
        };
      case 'pronto':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
          text: 'Pronto'
        };
      case 'entregue':
        return {
          icon: Truck,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
          text: 'Entregue'
        };
      case 'cancelado':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200',
          text: 'Cancelado'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200',
          text: status
        };
    }
  };

  const handleViewPedido = async (pedidoId: number) => {
    try {
      const pedido = await clienteAPI.getPedido(pedidoId);
      setSelectedPedido(pedido);
    } catch (error: any) {
      console.error('Erro ao carregar detalhes do pedido:', error);
    }
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg text-gray-600 font-medium">Carregando pedidos...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToMenu}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 px-4 py-2 rounded-xl"
            >
              <span>← Voltar ao cardápio</span>
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Meus Pedidos
            </h1>
            <p className="text-gray-600 text-lg">
              Acompanhe o status dos seus pedidos
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>{error}</span>
          </div>
        )}

        {pedidos.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent mb-4">
              Nenhum pedido encontrado
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Você ainda não fez nenhum pedido. Que tal começar agora?
            </p>
            <button
              onClick={handleBackToMenu}
              className="btn-primary"
            >
              Ver cardápio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lista de pedidos */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <span>Histórico de pedidos</span>
              </h2>
              <div className="space-y-4">
                {pedidos.map((pedido) => {
                  const statusInfo = getStatusInfo(pedido.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div
                      key={pedido.id}
                      className="card p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
                      onClick={() => handleViewPedido(pedido.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${statusInfo.bgColor} rounded-xl flex items-center justify-center border-2 ${statusInfo.borderColor}`}>
                            <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              Pedido #{pedido.id}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(pedido.data_pedido)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} border ${statusInfo.borderColor}`}>
                            {statusInfo.text}
                          </span>
                          <Eye size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
                        </div>
                        <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {formatPrice(pedido.total)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detalhes do pedido selecionado */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Eye className="w-6 h-6 text-blue-600" />
                <span>Detalhes do pedido</span>
              </h2>
              
              {selectedPedido ? (
                <div className="card p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Pedido #{selectedPedido.id}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(selectedPedido.data_pedido)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="w-4 h-4" />
                        <span>{selectedPedido.itens.length} {selectedPedido.itens.length === 1 ? 'item' : 'itens'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {selectedPedido.itens.map((item) => (
                      <div key={item.produto_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            {item.quantidade}x {item.produto.nome}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(item.preco_unitario * item.quantidade)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(selectedPedido.total)}
                      </span>
                    </div>
                  </div>

                  {selectedPedido.observacoes && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-medium text-blue-900 mb-2">Observações:</h4>
                      <p className="text-blue-800">{selectedPedido.observacoes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione um pedido</h3>
                  <p className="text-gray-600">
                    Clique em um pedido para ver os detalhes
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 