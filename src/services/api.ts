import axios from 'axios';
import { Cliente, Produto, Pedido } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cliente_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const clienteAPI = {
  // Autenticação
  login: async (telefone: string): Promise<{ cliente: Cliente; token: string }> => {
    const response = await api.post('/api/customers/login', { phone: telefone });
    return {
      cliente: response.data.customer,
      token: response.data.token
    };
  },

  cadastrar: async (dados: {
    nome: string;
    telefone: string;
    email?: string;
    endereco?: string;
    idade: number;
  }): Promise<{ cliente: Cliente; token: string }> => {
    // Primeiro cadastra o cliente
    await api.post('/api/customers/register', {
      name: dados.nome,
      phone: dados.telefone,
      address: dados.endereco || '',
      age: dados.idade
    });

    // Depois faz login
    const loginResponse = await api.post('/api/customers/login', { 
      phone: dados.telefone 
    });

    return {
      cliente: loginResponse.data.customer,
      token: loginResponse.data.token
    };
  },

  // Produtos
  getProdutos: async (): Promise<Produto[]> => {
    const response = await api.get('/api/menu');
    return response.data.map((item: any) => ({
      id: item.id,
      nome: item.name,
      descricao: item.description || '',
      preco: item.price,
      categoria: item.category || 'Geral',
      disponivel: item.available === 1,
      imagem: item.image
    }));
  },

  // Pedidos
  criarPedido: async (dados: {
    itens: Array<{ produto_id: number; quantidade: number }>;
    observacoes?: string;
    cliente?: any;
  }): Promise<Pedido> => {
    // Primeiro buscar os produtos para obter os preços
    const produtos = await clienteAPI.getProdutos();
    
    const items = dados.itens.map(item => {
      const produto = produtos.find((p: Produto) => p.id === item.produto_id);
      return {
        menu_item_id: item.produto_id,
        quantity: item.quantidade,
        price: produto?.preco || 0,
        notes: dados.observacoes || ''
      };
    });

    const response = await api.post('/api/orders', {
      customer_name: dados.cliente?.nome || 'Cliente',
      customer_phone: dados.cliente?.telefone || '0000000000',
      items
    });

    return {
      id: response.data.id,
      cliente_id: 0, // Será preenchido pelo backend
      cliente: {
        id: 0,
        nome: 'Cliente',
        telefone: '0000000000',
        data_cadastro: new Date().toISOString()
      },
      itens: response.data.items.map((item: any) => ({
        produto_id: item.menu_item_id,
        produto: produtos.find((p: Produto) => p.id === item.menu_item_id) || {
          id: item.menu_item_id,
          nome: 'Produto',
          descricao: '',
          preco: item.price,
          categoria: 'Geral',
          disponivel: true
        },
        quantidade: item.quantity,
        preco_unitario: item.price
      })),
      total: response.data.total,
      status: response.data.status,
      data_pedido: new Date().toISOString(),
      observacoes: dados.observacoes
    };
  },

  getPedidos: async (telefone?: string): Promise<Pedido[]> => {
    if (!telefone) return [];
    const response = await api.get(`/api/customers/${telefone}/orders`);
    const produtos = await clienteAPI.getProdutos();
    return response.data.map((order: any) => ({
      id: order.id,
      cliente_id: 0,
      cliente: {
        id: 0,
        nome: order.customer_name || 'Cliente',
        telefone: order.customer_phone || '0000000000',
        data_cadastro: new Date().toISOString()
      },
      itens: order.items.map((item: any) => ({
        produto_id: item.menu_item_id,
        produto: produtos.find((p: Produto) => p.id === item.menu_item_id) || {
          id: item.menu_item_id,
          nome: 'Produto',
          descricao: '',
          preco: item.price,
          categoria: 'Geral',
          disponivel: true
        },
        quantidade: item.quantity,
        preco_unitario: item.price
      })),
      total: order.total,
      status: order.status,
      data_pedido: order.created_at,
      observacoes: ''
    }));
  },

  getPedido: async (id: number): Promise<Pedido> => {
    const response = await api.get(`/api/orders/${id}`);
    const produtos = await clienteAPI.getProdutos();
    
    return {
      id: response.data.id,
      cliente_id: 0,
      cliente: {
        id: 0,
        nome: response.data.customer_name || 'Cliente',
        telefone: response.data.customer_phone || '0000000000',
        data_cadastro: new Date().toISOString()
      },
      itens: response.data.items.map((item: any) => ({
        produto_id: item.menu_item_id,
        produto: produtos.find((p: Produto) => p.id === item.menu_item_id) || {
          id: item.menu_item_id,
          nome: 'Produto',
          descricao: '',
          preco: item.price,
          categoria: 'Geral',
          disponivel: true
        },
        quantidade: item.quantity,
        preco_unitario: item.price
      })),
      total: response.data.total,
      status: response.data.status,
      data_pedido: response.data.created_at,
      observacoes: ''
    };
  },
};

export default api; 