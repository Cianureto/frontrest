import * as React from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Produto, ItemCarrinho, CartContextType } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<ItemCarrinho[]>([]);

  const addItem = (produto: Produto, quantidade: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.produto.id === produto.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      } else {
        return [...prevItems, { produto, quantidade }];
      }
    });
  };

  const removeItem = (produtoId: number) => {
    setItems(prevItems => prevItems.filter(item => item.produto.id !== produtoId));
  };

  const updateQuantity = (produtoId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(produtoId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.produto.id === produtoId
          ? { ...item, quantidade }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.produto.preco * item.quantidade), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantidade, 0);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 