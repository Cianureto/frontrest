export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  endereco?: string;
  data_cadastro: string;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  disponivel: boolean;
  imagem?: string;
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

export interface Pedido {
  id: number;
  cliente_id: number;
  cliente: Cliente;
  itens: Array<{
    produto_id: number;
    produto: Produto;
    quantidade: number;
    preco_unitario: number;
  }>;
  total: number;
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';
  data_pedido: string;
  observacoes?: string;
}

export interface AuthContextType {
  cliente: Cliente | null;
  login: (telefone: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface CartContextType {
  items: ItemCarrinho[];
  addItem: (produto: Produto, quantidade: number) => void;
  removeItem: (produtoId: number) => void;
  updateQuantity: (produtoId: number, quantidade: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
} 