# ✅ Desafio - Gerenciador de Tarefas (Next.js + tRPC)

Este projeto foi desenvolvido como parte de um desafio técnico com foco em **Next.js 15**, **tRPC**, **React** e **TypeScript**. A aplicação simula um sistema simples de gerenciamento de tarefas, com operações completas de **CRUD**, SSR e feedback visual.

---

## 🚀 Tecnologias Utilizadas

- **Next.js 15 (App Router)**
- **React 18**
- **TypeScript**
- **tRPC**
- **Tailwind CSS**
- **Zod**
- **Lucide React Icons**

---

## 📦 Como Rodar o Projeto

### ✅ Requisitos

- Node.js na versão **v20.19.0**
- npm

### ▶️ Passos para executar:

1. **Clone o repositório:**

```bash
git clone https://github.com/isapoloni/artefact-desafio
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Execute o projeto localmente:**

```bash
npm run dev
```

4. Acesse no navegador: [http://localhost:3000](http://localhost:3000)

---

## ✨ Funcionalidades

- [x] Listagem de tarefas com SSR  
- [x] Criação de nova tarefa via formulário  
- [x] Edição de tarefas existentes  
- [x] Exclusão com confirmação e feedback  
- [x] Validação de formulário
- [x] Tratamento de erros do backend via tRPC  
- [x] Scroll infinito na listagem (bônus)  
- [x] Feedback visual (loading, sucesso, erro)

## 📄 Estrutura da Tarefa

Cada tarefa é representada por um objeto com os seguintes campos:

```ts
type Task = {
  id: string; // Identificador único (UUID)
  title: string; // Título da tarefa (obrigatório)
  description?: string; // Descrição (opcional)
  createdAt: string; // Data de criação em ISO string
}
```

---

## 🔌 Backend com tRPC

A camada de API foi implementada com **tRPC** e mantém os dados das tarefas em memória (sem banco de dados). Ela oferece os seguintes endpoints:

### 🔄 CRUD

- **`create`**: Cria uma nova tarefa (validação com Zod, exige título)
- **`list`**: Lista todas as tarefas (sem paginação)
- **`update`**: Atualiza uma tarefa existente
- **`delete`**: Remove uma tarefa pelo ID

### ♾️ Paginação com Cursor (Scroll Infinito)

- **`infiniteList`**: Retorna tarefas com paginação baseada em cursor, ideal para scroll infinito
  - Parâmetros:
    - `limit`: número de tarefas por página (padrão: 10)
    - `cursor`: ID da última tarefa carregada (opcional)
  - Retorna:
    - `items`: array de tarefas da página atual
    - `nextCursor`: ID da próxima tarefa a ser usada como cursor

Todos os endpoints estão validados com **Zod** e fornecem mensagens de erro detalhadas via `TRPCError`.

---

## 💡 Experiência do Usuário

- Estado de carregamento em todas as requisições assíncronas
- Mensagens de erro amigáveis para falhas comuns
- Confirmações visuais para ações de sucesso (como exclusão ou criação)

---

## 🧪 Testes & Bônus

- [x] Implementado scroll infinito para carregamento dinâmico de tarefas  
- [x] Código comentado e documentado para melhor entendimento

---
## ⚠️ Observação

Este projeto é **volátil**: os dados das tarefas são mantidos apenas em memória (RAM). Ao reiniciar o servidor, todos os dados serão perdidos, já que não há persistência em banco de dados.

---

## 🧠 Contato

Se quiser bater um papo técnico ou tirar dúvidas:

**Isabella Poloni**  
📧 isabella Poloni  
💼 [LinkedIn](https://www.linkedin.com/in/isabella-poloni/)

---

Obrigado por conferir este projeto! Espero que ele reflita boas práticas, foco em DX/UX e arquitetura moderna com Next.js! 🚀🧠
