# 📚 Vila dos Estudos

> Uma plataforma educacional interativa que conecta alunos e professores, construída com foco em performance, segurança e experiência do usuário (UX).

![Status do Projeto](https://img.shields.io/badge/Status-Concluído-success)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-Database_&_Auth-3ECF8E?logo=supabase&logoColor=white)

## 💻 Sobre o Projeto
A **Vila dos Estudos** é uma aplicação web de ponta a ponta que simula um ambiente de aprendizado online. Professores podem criar, formatar e gerenciar aulas, enquanto alunos podem explorar conteúdos filtrados por matérias. O projeto foi desenvolvido com arquitetura Vanilla (HTML, CSS e JS puros) integrada ao Supabase como Backend as a Service (BaaS).

## 🤝 Propósito e Desenvolvimento

Este projeto nasceu com um propósito muito especial: **auxiliar nas aulas de reforço para os adolescentes da minha igreja**. A ideia era criar um ambiente online organizado onde eles pudessem acessar os conteúdos das aulas de forma fácil e interativa.

Como sou um desenvolvedor iniciante com foco no Front-end, eu tinha o design e a interface em mente, mas a lógica de Back-end (banco de dados, autenticação e segurança) ainda era um terreno novo para mim. 

Para tornar essa plataforma realidade, contei com o auxílio de **Inteligência Artificial** atuando como minha mentora de código e parceira de *pair programming*. O uso da IA me permitiu não apenas tirar o projeto do papel para ajudar os adolescentes, mas também serviu como uma escola onde aprendi na prática sobre integração com Supabase, rotas, segurança (XSS/RLS) e estruturação profissional de projetos.

### 🔐 Autenticação e Autorização (Role-Based Access)
- Login e Cadastro nativo e via **Google OAuth**.
- Níveis de acesso distintos: **Alunos** visualizam conteúdos; **Professores** acessam um painel de gerenciamento exclusivo (Dashboard).

### 👨‍🏫 Painel do Professor (CRUD)
- Criação, edição e exclusão de aulas dinâmicas.
- Integração com **Quill.js** (Rich Text Editor) permitindo formatação de texto avançada e incorporação de iframes (YouTube, Canva, Google Drive).

### 🎨 Personalização e UX (Área do Perfil)
- **Upload de Avatar:** Integração com Supabase Storage para fotos de perfil.
- **Múltiplos Temas:** Suporte dinâmico via CSS Variables para Light Mode, Dark Mode e Modo Leitura (Sépia) com salvamento em LocalStorage.
- **Internacionalização (i18n):** Suporte nativo para troca de idioma da interface (PT-BR, EN, ES).
- Design 100% Responsivo e estruturado com CSS Flexbox.

### 🛡️ Segurança Aplicada
- Proteção contra **XSS** (Cross-Site Scripting) na renderização de aulas utilizando **DOMPurify**.
- Regras de banco de dados protegidas com **RLS (Row Level Security)** no Supabase.
- Políticas estritas no Storage bucket para aceitar apenas formatos de imagem autênticos.

## 🛠️ Tecnologias Utilizadas

* **Front-end:** HTML5, CSS3 (Custom Properties, Flexbox, Media Queries), JavaScript Vanilla (ES6+, DOM Manipulation, Async/Await).
* **Back-end & Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage).
* **Bibliotecas Externas:** Quill.js (Editor de texto), DOMPurify (Sanitização HTML).
* **Hospedagem/Deploy:** Vercel.

# Vercel

https://vila-dos-estudos.vercel.app/src/pages/index.html

## 🚀 Como executar o projeto localmente

1. Clone este repositório:
   ```bash
   git clone [https://github.com/RyanZine/Vila-dos-Estudos.git](https://github.com/RyanZine/Vila-dos-Estudos.git)