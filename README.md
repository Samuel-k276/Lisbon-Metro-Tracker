# LisbonMetro

Aplicação web interativa que fornece informações em tempo real sobre o Metropolitano de Lisboa, desenvolvida com React, TypeScript e Vite.

![Metropolitano de Lisboa](src/assets/metro-icon.png)

## 📋 Descrição

O LisbonMetro é uma aplicação web que permite aos usuários:

- Visualizar o mapa da rede do metro de Lisboa
- Obter informações sobre estações e linhas em tempo real
- Verificar os próximos comboios em cada estação
- Consultar alertas e o estado atual de cada linha
- Acessar informações sobre tarifas e horários

Esta aplicação consome dados em tempo real da API oficial do Metropolitano de Lisboa para fornecer informações atualizadas sobre o serviço.

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework de UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Navegação entre páginas
- **Material UI** - Componentes de interface
- **Konva/React-Konva** - Renderização de gráficos para o mapa
- **API do Metropolitano de Lisboa** - Dados em tempo real

## 🛠️ Instalação e Uso

### Pré-requisitos

- Node.js (v18+)
- npm ou yarn

### Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/Samuel-k276/LisbonMetro.git
   cd LisbonMetro
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
   ```
   VITE_API_TOKEN=???
   ```
   Devera requesitar um TOKEN para a API do Metro de Lisboa

4. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

5. Acesse a aplicação em `http://localhost:5173`

### Compilação para produção

```
npm run build
```

Os arquivos compilados estarão disponíveis na pasta `dist/`.

## 📂 Estrutura do Projeto

- `src/api/` - Funções para chamadas à API do Metro de Lisboa
- `src/assets/` - Imagens e recursos estáticos
- `src/components/` - Componentes React reutilizáveis
- `src/hooks/` - Custom hooks React
- `src/pages/` - Componentes de página
- `src/types/` - Definições de tipos TypeScript
- `src/utils/` - Funções utilitárias

## 📱 Funcionalidades

- **Mapa Interativo**: Visualização da rede completa com estações
- **Detalhes de Estações**: Informações detalhadas sobre cada estação
- **Tempos de Espera**: Próximos comboios em cada estação
- **Alertas**: Estado atual das linhas e eventuais perturbações
- **Informações**: Tarifas e dados históricos sobre o metro

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.


Link do projeto: [https://github.com/Samuel-k276/LisbonMetro](https://github.com/Samuel-k276/LisbonMetro)

---

⌨️ com ❤️ por [Samuel] (2025)

