//importação de dados
import materias from "./data.js";

//teste
// src/scripts/main.js
import { supabase } from "./supabase.js"; // <-- Adicione esta linha

// Função de teste para ver se o Supabase responde
async function testarConexao() {
    const { data, error } = await supabase.from('materias').select('*');
    
    if (error) {
        console.error("Erro na conexão:", error.message);
    } else {
        console.log("Conectado com sucesso! Dados:", data);
    }
}

testarConexao(); // Executa o teste

//logica carrossel
const slide = document.getElementById("slide");

const estado = {
    materiaIndex: 0,
    aulaIndex: 0,
};

function mostrarSlide() {

    const materia = materias[estado.materiaIndex];
    const aula = materia.aulas[estado.aulaIndex];

    slide.classList.remove("ativo");

    setTimeout(() => {
    slide.innerHTML = `
    <h3>${materia.nome}</h3>
    <strong>${aula.titulo}</strong>
    <p>${aula.descricao}</p>
    `;

        slide.classList.add("ativo");
    }, 300);
}

function proximo() {
    const materia = materias[estado.materiaIndex];

    estado.aulaIndex++;

    if (estado.aulaIndex >= materia.aulas.length) {
        estado.aulaIndex = 0;
        estado.materiaIndex++;

    if (estado.materiaIndex >= materias.length) {
        estado.materiaIndex = 0;
    }
}

    mostrarSlide();
}

function voltar() {
   estado.aulaIndex--;

   if(estado.aulaIndex < 0) {
    estado.materiaIndex--;

    if(estado.materiaIndex < 0) {
        estado.materiaIndex = materias.length - 1;
    }

    const materia = materias[estado.materiaIndex];
    estado.aulaIndex = materia.aulas.length - 1;
   }

   mostrarSlide();
}

let intervalo = setInterval(proximo, 3000);

const container = document.querySelector(".carrossel-container");

container.addEventListener("mouseenter", () => {
    clearInterval(intervalo);
});

container.addEventListener("mouseleave", () => {
    intervalo = setInterval(proximo, 3000);
});

const btnProximo = document.getElementById("btn-proximo");
const btnVoltar = document.getElementById("btn-voltar");

btnProximo.addEventListener("click", proximo);
btnVoltar.addEventListener("click", voltar);

mostrarSlide();

const listaMaterias =
document.getElementById("lista-materias");

function renderMaterias() {
    listaMaterias.innerHTML = "";

    materias.forEach((materia, index) => {
        const card = document.createElement("div");

        card.innerHTML = `
        <h3>${materia.nome}</h3>
        <p>${materia.aulas.length} aulas</p>
        `;

        card.addEventListener ("click", () => {
            selecionarMateria(index);
        });

        listaMaterias.appendChild(card);
    });
}

function selecionarMateria(index) {
    estado.materiaIndex = index;
    estado.aulaIndex = 0;

    mostrarSlide();
}

renderMaterias();

const tituloAula =
document.getElementById("titulo-aula");
const textoAula =
document.getElementById("texto-aula");

function mostrarConteudo() {
    const materia = materias[estado.materiaIndex];
    const aula = materia.aulas[estado.aulaIndex];

    tituloAula.innerText = aula.titulo;
    textoAula.innerHTML = aula.conteudo;
}

mostrarConteudo();