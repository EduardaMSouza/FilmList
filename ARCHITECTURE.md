# Arquitetura do Projeto Film List

## Visão Geral

Este projeto foi reorganizado seguindo as melhores práticas de arquitetura Angular, implementando uma estrutura modular bem definida.

## Estrutura de Pastas

```
src/app/
├── core/                    # Serviços, interceptors e guards
│   ├── services/           # Serviços da aplicação
│   ├── interceptors/       # Interceptors HTTP
│   ├── guards/            # Guards de rota
│   └── core.module.ts     # Módulo core
├── features/              # Módulos de funcionalidades
│   ├── auth/             # Autenticação (login, cadastro)
│   ├── filmes/           # Detalhes de filmes
│   └── minha-lista/      # Lista de filmes do usuário
├── layout/               # Componentes de layout
│   ├── header.component.ts
│   └── layout.module.ts
├── shared/               # Componentes, pipes e diretivas reutilizáveis
│   ├── components/       # Componentes compartilhados
│   ├── pipes/           # Pipes customizados
│   ├── directives/      # Diretivas customizadas
│   ├── material-module.ts
│   └── shared.module.ts
└── app.module.ts         # Módulo principal da aplicação
```

## Módulos

### Core Module
- **Propósito**: Contém serviços, interceptors e guards que são singleton na aplicação
- **Carregamento**: Importado apenas no AppModule
- **Conteúdo**: 
  - AuthService
  - FilmeService
  - ToastService
  - UserMovieService
  - TokenInterceptor

### Shared Module
- **Propósito**: Componentes, pipes e diretivas reutilizáveis
- **Carregamento**: Importado em todos os módulos que precisam
- **Conteúdo**:
  - CastCardComponent
  - CarrosselComponent
  - RatingComponent
  - MaterialModule

### Layout Module
- **Propósito**: Componentes de layout da aplicação
- **Carregamento**: Importado nos módulos que precisam de layout
- **Conteúdo**:
  - HeaderComponent

### Feature Modules

#### Auth Feature Module
- **Propósito**: Funcionalidades de autenticação
- **Conteúdo**:
  - LoginComponent
  - CadastroComponent
  - AuthRoutingModule

#### Filmes Feature Module
- **Propósito**: Funcionalidades relacionadas a filmes
- **Conteúdo**:
  - FilmeDetalheComponent

#### Minha Lista Feature Module
- **Propósito**: Gerenciamento da lista de filmes do usuário
- **Conteúdo**:
  - MinhaListaComponent

## Convenções

### Nomenclatura
- **Componentes**: PascalCase + "Component" (ex: LoginComponent)
- **Serviços**: PascalCase + "Service" (ex: AuthService)
- **Módulos**: PascalCase + "Module" (ex: AuthFeatureModule)
- **Arquivos**: kebab-case (ex: login.component.ts)

### Imports
- **Serviços**: Sempre importados do CoreModule
- **Componentes compartilhados**: Sempre importados do SharedModule
- **Componentes de layout**: Sempre importados do LayoutModule

### Estrutura de Componentes
- Cada componente deve ter seu próprio arquivo
- Nomes de classes devem seguir as convenções
- Imports devem usar caminhos relativos corretos

## Benefícios da Nova Arquitetura

1. **Separação de Responsabilidades**: Cada módulo tem uma responsabilidade específica
2. **Reutilização**: Componentes compartilhados podem ser usados em múltiplos lugares
3. **Manutenibilidade**: Código mais organizado e fácil de manter
4. **Escalabilidade**: Fácil adicionar novas funcionalidades
5. **Testabilidade**: Estrutura que facilita testes unitários
6. **Performance**: Lazy loading pode ser implementado facilmente

## Como Adicionar Novos Componentes

1. **Componente de Feature**: Criar na pasta features correspondente
2. **Componente Compartilhado**: Criar em shared/components
3. **Componente de Layout**: Criar em layout
4. **Serviço**: Criar em core/services
5. **Interceptor**: Criar em core/interceptors
6. **Guard**: Criar em core/guards

## Como Adicionar Novas Features

1. Criar nova pasta em features/
2. Criar o módulo da feature (ex: nova-feature.module.ts)
3. Criar os componentes necessários
4. Criar o routing module se necessário
5. Importar o módulo no AppModule
6. Adicionar as rotas no app.routes.ts 