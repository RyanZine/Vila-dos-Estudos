<p align="center">
  <img src="img/logo.svg" alt="Vila dos Estudos" width="620">
</p>

<p align="center">
  <strong>Plataforma de estudos com área de aluno e painel de professor</strong>
</p>

---

Um aluno entra, navega por matérias, assiste às aulas publicadas e acompanha o
próprio perfil; um professor tem um painel próprio para publicar conteúdo.
Interface em três idiomas.

## Stack

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

JavaScript modular (ES Modules), sem framework. Autenticação e dados no Supabase.

## Funcionalidades

- **Autenticação** de aluno e professor via Supabase Auth (`scripts/auth.js`)
- **Painel do professor** para publicar e gerenciar aulas (`dashboard_prof.html`)
- **Perfil do usuário** com foto, servida pelo Supabase Storage
- **Catálogo de matérias e aulas** carregado do banco
- **Internacionalização** — português, inglês e espanhol (`scripts/i18n.js`)
- **Temas** de cor, com a preferência guardada no `localStorage`

## Estrutura

```
src/
├── pages/     index · login · aula · perfil · dashboard_prof
├── scripts/   auth · main · dashboard · perfil · aula · i18n · supabase
└── styles/    style.css
```

## Como rodar

```bash
git clone https://github.com/RyanZine/Vila-dos-Estudos.git
cd Vila-dos-Estudos
```

O projeto usa ES Modules, então precisa ser servido por HTTP — abrir o
`index.html` direto do disco (`file://`) não funciona:

```bash
python -m http.server 5500
# depois: http://localhost:5500/src/pages/index.html
```

Para conectar a um back-end próprio, ajuste `supabaseUrl` e a chave anônima em
`src/scripts/supabase.js`.

> **Nota:** o projeto Supabase usado na demonstração foi desativado. As páginas
> carregam, mas o catálogo, o login e o painel dependem de uma instância ativa —
> aponte o `supabase.js` para a sua para ver o sistema completo.

---

Feito por [Ryan Zinedine](https://github.com/RyanZine) ·
[portfólio](https://portfolio-ryanzine.vercel.app)
