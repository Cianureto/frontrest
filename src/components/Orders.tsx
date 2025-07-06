import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react';
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
          text: 'Pendente'
        };
      case 'preparando':
        return {
          icon: Package,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'Preparando'
        };
      case 'pronto':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Pronto'
        };
      case 'entregue':
        return {
          icon: Truck,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Entregue'
        };
      case 'cancelado':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: 'Cancelado'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Carregando pedidos...</div>
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
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBackToMenu}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>← Voltar ao cardápio</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
          <p className="text-gray-600">
            Acompanhe o status dos seus pedidos
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {pedidos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum pedido encontrado</h2>
            <p className="text-gray-600 mb-6">
              Você ainda não fez nenhum pedido. Que tal começar agora?
            </p>
            <button
              onClick={handleBackToMenu}
              className="bg-primary-500 text-white px-6 py-3 rounded-md hover:bg-primary-600 transition-colors"
            >
              Ver cardápio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de pedidos */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Histórico de pedidos
              </h2>
              <div className="space-y-4">
                {pedidos.map((pedido) => {
                  const statusInfo = getStatusInfo(pedido.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div
                      key={pedido.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleViewPedido(pedido.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
                            <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Pedido #{pedido.id}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(pedido.data_pedido)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                          <Eye size={16} className="text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Itens:</span>
                          <span className="font-medium">{pedido.itens.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold text-primary-600">
                            {formatPrice(pedido.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detalhes do pedido selecionado */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Detalhes do pedido
              </h2>
              
              {selectedPedido ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pedido #{selectedPedido.id}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(selectedPedido.status).bgColor} ${getStatusInfo(selectedPedido.status).color}`}>
                        {getStatusInfo(selectedPedido.status).text}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Data:</span> {formatDate(selectedPedido.data_pedido)}
                      </div>
                      {selectedPedido.observacoes && (
                        <div>
                          <span className="font-medium">Observações:</span> {selectedPedido.observacoes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Itens do pedido:</h4>
                    {selectedPedido.itens.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.quantidade}x {item.produto.nome}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.preco_unitario)} cada
                          </p>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(item.preco_unitario * item.quantidade)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(selectedPedido.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Selecione um pedido para ver os detalhes
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