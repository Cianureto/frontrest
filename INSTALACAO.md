# 🚀 Instruções de Instalação e Execução

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Backend do restaurante rodando na porta 3000

## 🛠️ Passo a Passo

### 1. Instalar Dependências

```bash
cd cliente-app
npm install
```

### 2. Verificar Backend

Certifique-se de que o backend está rodando:

```bash
# Na pasta raiz do projeto
cd backend
npm install
node index.js
```

O backend deve estar rodando em `http://localhost:3001`

### 3. Iniciar o Frontend

```bash
# Na pasta cliente-app
npm run dev
```

O frontend estará disponível em `http://localhost:3001`

### 4. Testar a Aplicação

1. Acesse `http://localhost:3001`
2. Você será redirecionado para a tela de login
3. Clique em "Criar nova conta" para cadastrar um cliente
4. Preencha os dados (nome, telefone, idade, etc.)
5. Após o cadastro, você será redirecionado para o cardápio
6. Adicione produtos ao carrinho
7. Finalize o pedido

## 🔧 Configurações

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` na raiz do `cliente-app`:

```env
VITE_API_URL=http://localhost:3001
```

### Porta do Backend

Se o backend estiver rodando em uma porta diferente de 3000, atualize o arquivo `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:SUA_PORTA';
```

## 🐛 Solução de Problemas

### Erro de CORS

Se aparecer erro de CORS, verifique se o backend tem CORS habilitado:

```javascript
// No backend/index.js
app.use(cors());
```

### Erro de Conexão

Se não conseguir conectar com o backend:

1. Verifique se o backend está rodando
2. Verifique a URL no arquivo `api.ts`
3. Verifique se não há firewall bloqueando

### Erro de Dependências

Se houver erro ao instalar dependências:

```bash
# Limpar cache
npm cache clean --force

# Deletar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📱 Funcionalidades Testáveis

### ✅ Autenticação
- [ ] Cadastro de novo cliente
- [ ] Login com telefone existente
- [ ] Validação de idade (18+)

### ✅ Cardápio
- [ ] Visualizar produtos
- [ ] Filtrar por categoria
- [ ] Adicionar ao carrinho

### ✅ Carrinho
- [ ] Adicionar/remover itens
- [ ] Ajustar quantidades
- [ ] Ver total

### ✅ Pedidos
- [ ] Finalizar pedido
- [ ] Ver histórico (quando implementado)

## 🔄 Fluxo Completo

1. **Cadastro**: Cliente se cadastra com telefone único
2. **Login**: Cliente faz login com telefone
3. **Cardápio**: Visualiza produtos disponíveis
4. **Carrinho**: Adiciona produtos e gerencia quantidades
5. **Checkout**: Confirma pedido com observações
6. **Pedidos**: Acompanha status dos pedidos

## 📊 Status dos Pedidos

- **Pendente**: Pedido recebido
- **Preparando**: Em preparação
- **Pronto**: Pronto para entrega
- **Entregue**: Pedido finalizado
- **Cancelado**: Pedido cancelado

## 🎨 Personalização

### Cores

As cores podem ser alteradas no arquivo `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#ed7a1a', // Cor principal
    // ... outras variações
  }
}
```

### Logo

Substitua o logo no componente `Header.tsx`:

```jsx
<span className="text-xl font-bold text-gray-900">Seu Restaurante</span>
```

## 🚀 Deploy

Para gerar build de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/` e podem ser servidos por qualquer servidor web estático.

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do console do navegador
2. Verifique os logs do backend
3. Verifique se todas as dependências estão instaladas
4. Verifique se as portas estão corretas 