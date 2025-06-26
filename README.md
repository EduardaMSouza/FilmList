# Film List

Uma aplicação Angular para gerenciar sua lista de filmes favoritos.

## 📋 Sobre

Film List é uma aplicação web que permite aos usuários:
- Fazer login e cadastro
- Adicionar filmes à sua lista pessoal
- Visualizar detalhes dos filmes
- Avaliar filmes que já assistiu
- Filtrar e organizar sua lista

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular bem organizada:

```
src/app/
├── core/           # Serviços e interceptors
├── features/       # Funcionalidades (auth, filmes, minha-lista)
├── layout/         # Componentes de layout (header)
├── shared/         # Componentes reutilizáveis
└── app.module.ts   # Módulo principal
```

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   ng serve
   ```

3. **Acessar a aplicação:**
   ```
   http://localhost:4200
   ```

## 🛠️ Tecnologias

- **Angular** - Framework principal
- **Angular Material** - Componentes de UI
- **ngx-toastr** - Notificações
- **JSON Server** - API mock (pasta server/)

## 📁 Estrutura Principal

- **Auth**: Login e cadastro de usuários
- **Minha Lista**: Gerenciamento da lista de filmes
- **Filmes**: Detalhes e informações dos filmes
- **Shared**: Componentes reutilizáveis (cards, carrossel, rating)

## 🔧 Desenvolvimento

Para mais detalhes sobre a arquitetura, consulte o arquivo `ARCHITECTURE.md`.
