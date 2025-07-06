# App do Cliente - Restaurante

Aplicação frontend para clientes do sistema de restaurante, desenvolvida com React + TypeScript + Vite + Tailwind CSS.

## 🚀 Funcionalidades

- **Autenticação por telefone**: Login e cadastro de clientes
- **Cardápio interativo**: Visualização de produtos com filtros por categoria
- **Carrinho de compras**: Adicionar, remover e gerenciar itens
- **Finalização de pedidos**: Checkout com observações
- **Acompanhamento de pedidos**: Histórico e status dos pedidos
- **Interface responsiva**: Design moderno e adaptável

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Backend do restaurante rodando na porta 3000

## 🛠️ Instalação

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente (opcional):**
   Crie um arquivo `.env` na raiz do projeto:
   ```
   VITE_API_URL=http://localhost:3000
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acessar a aplicação:**
   Abra [http://localhost:3001](http://localhost:3001) no navegador

## 📁 Estrutura do Projeto

```
cliente-app/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Header.tsx      # Cabeçalho com navegação
│   │   ├── Login.tsx       # Autenticação
│   │   ├── Menu.tsx        # Cardápio
│   │   ├── Cart.tsx        # Carrinho
│   │   ├── Checkout.tsx    # Finalização
│   │   └── Orders.tsx      # Pedidos
│   ├── contexts/           # Contextos React
│   │   ├── AuthContext.tsx # Autenticação
│   │   └── CartContext.tsx # Carrinho
│   ├── services/           # Serviços de API
│   │   └── api.ts         # Comunicação com backend
│   ├── types/              # Tipos TypeScript
│   │   └── index.ts       # Interfaces
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Ponto de entrada
│   └── index.css          # Estilos globais
├── public/                # Arquivos estáticos
├── package.json           # Dependências
├── vite.config.ts         # Configuração Vite
├── tailwind.config.js     # Configuração Tailwind
└── tsconfig.json          # Configuração TypeScript
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa linter

## 🎨 Tecnologias Utilizadas

- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

## 🔌 Integração com Backend

O app se conecta ao backend através das seguintes rotas:

- `POST /cliente/login` - Login de cliente
- `POST /cliente/cadastrar` - Cadastro de cliente
- `GET /produtos` - Listar produtos
- `POST /pedidos` - Criar pedido
- `GET /pedidos/cliente` - Listar pedidos do cliente
- `GET /pedidos/:id` - Detalhes do pedido

## 🚀 Deploy

Para gerar build de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/` e podem ser servidos por qualquer servidor web estático.

## 📱 Responsividade

O app é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## 🔐 Autenticação

- Login/cadastro por telefone
- Validação de maioridade (18+)
- Token JWT para sessão
- Redirecionamento automático

## 🛒 Funcionalidades do Carrinho

- Adicionar/remover itens
- Ajustar quantidades
- Cálculo automático de total
- Persistência no localStorage
- Limpeza automática após pedido

## 📊 Status dos Pedidos

- **Pendente**: Pedido recebido
- **Preparando**: Em preparação
- **Pronto**: Pronto para entrega
- **Entregue**: Pedido finalizado
- **Cancelado**: Pedido cancelado 