import { supabase } from "./supabase.js";

const slide = document.getElementById("slide");
const tituloAula = document.getElementById("titulo-aula");
const textoAula = document.getElementById("texto-aula");

let aulasDinamicas = []; // Aqui vamos guardar as aulas do banco
let slideAtual = 0;

// 1. Função para buscar as aulas no Supabase
async function carregarAulas() {
    // Busca as aulas que já foram publicadas (data <= hoje), ordenadas das mais novas para as mais velhas
    const hoje = new Date().toISOString();

    const { data, error } = await supabase
        .from('aulas')
        .select('*, materias(nome)') // Traz a aula e o nome da matéria junto!
        .lte('data_publicacao', hoje)
        .order('data_publicacao', { ascending: false })
        .limit(5); // Pega as 5 mais recentes

    if (error) {
        console.error("Erro ao buscar aulas:", error);
        slide.innerHTML = `<p>Erro ao carregar as aulas.</p>`;
        return;
    }

    aulasDinamicas = data;
    mostrarSlide();
}

// 2. Função para mostrar o slide na tela
function mostrarSlide() {
    if (aulasDinamicas.length === 0) {
        slide.innerHTML = `<p>Nenhuma aula disponível no momento.</p>`;
        return;
    }

    const aula = aulasDinamicas[slideAtual];

    slide.classList.remove("ativo");

    setTimeout(() => {
        // link clicável
        slide.innerHTML = `
        <a href="aula.html?id=${aula.id}" style="text-decoration: none; color: inherit; display: block; height: 100%;">
            <h3>${aula.materias.nome}</h3>
            <strong style="font-size: 20px; display: block; margin: 10px 0;">${aula.titulo}</strong>
            <p>${aula.descricao}</p>
            <span style="display: inline-block; margin-top: 15px; color: var(--laranja); font-weight: bold; font-size: 14px;">Ler aula completa ➔</span>
        </a>
        `;
        slide.classList.add("ativo");

        // Atualiza a parte de baixo (resumo)
        tituloAula.innerText = aula.titulo;
        textoAula.innerHTML = aula.descricao;
    }, 300);
}

// 3. Controles do Carrossel
function proximo() {
    slideAtual++;
    if (slideAtual >= aulasDinamicas.length) {
        slideAtual = 0; // Volta para o começo
    }
    mostrarSlide();
}

function voltar() {
    slideAtual--;
    if (slideAtual < 0) {
        slideAtual = aulasDinamicas.length - 1; // Vai para o final
    }
    mostrarSlide();
}

// 4. Configurando os botões e intervalo
document.getElementById("btn-proximo").addEventListener("click", proximo);
document.getElementById("btn-voltar").addEventListener("click", voltar);

let intervalo = setInterval(proximo, 3000);
const container = document.querySelector(".carrossel-container");

container.addEventListener("mouseenter", () => clearInterval(intervalo));
container.addEventListener("mouseleave", () => intervalo = setInterval(proximo, 3000));

// 5. Inicia tudo!
carregarAulas();

//interface de usuário
async function verificarUsuario() {
    const authArea = document.getElementById("auth-area");

    //verifica se há um usuário na sessão atual
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        //se estiver logado, busca os dados do perfil na tabela 'perfis'
        const { data: perfil } = await supabase
            .from('perfis')
            .select('nome, role')
            .eq('id', user.id)
            .single();

        if (perfil) {
            const inicial = perfil.nome.charAt(0).toUpperCase();
            const linkDestino = perfil.role === 'professor' ? 'dashboard_prof.html' : '#';

            authArea.innerHTML = `<div class="user-profile">
            <span>Olá, ${perfil.nome.split(' ')[0]}!</span>
            <a href="${linkDestino}" title="Ir para o Painel">
            <div class="user-avatar">${inicial}
            </div>
            </a>
            </div>`;
        }
    }
}

verificarUsuario();