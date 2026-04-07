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
        slide.innerHTML = `
        <h3>${aula.materias.nome}</h3>
        <strong>${aula.titulo}</strong>
        <p>${aula.descricao}</p>
        `;
        slide.classList.add("ativo");
        
        // Atualiza a parte de baixo (conteúdo da aula)
        tituloAula.innerText = aula.titulo;
        textoAula.innerHTML = aula.conteudo;
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