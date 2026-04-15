import { supabase } from "./supabase.js";
import { traduzirPagina } from "./i18n.js";

const slide = document.getElementById("slide");
const tituloAula = document.getElementById("titulo-aula");
const textoAula = document.getElementById("texto-aula");

let aulasDinamicas = [];
let slideAtual = 0;

async function carregarAulas(materiaId = null) {
    const hoje = new Date().toISOString();

    let query = supabase
        .from('aulas')
        .select('*, materias(nome)') 
        .lte('data_publicacao', hoje)
        .order('data_publicacao', { ascending: false })
        .limit(5); 

    if (materiaId) {
        query = query.eq('materia_id', materiaId);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erro ao buscar aulas:", error);
        slide.innerHTML = `<p>Erro ao carregar as aulas.</p>`;
        return;
    }

    aulasDinamicas = data;
    slideAtual = 0; 
    mostrarSlide();
}

function mostrarSlide() {
    if (aulasDinamicas.length === 0) {
        slide.innerHTML = `<p>Nenhuma aula disponível no momento.</p>`;
        return;
    }

    const aula = aulasDinamicas[slideAtual];
    slide.classList.remove("ativo");

    setTimeout(() => {
        slide.innerHTML = `
        <a href="aula.html?id=${aula.id}" style="text-decoration: none; color: inherit; display: block; height: 100%;">
            <h3>${aula.materias.nome}</h3>
            <strong style="font-size: 20px; display: block; margin: 10px 0;">${aula.titulo}</strong>
            <p>${aula.descricao}</p>
            <span style="display: inline-block; margin-top: 15px; color: var(--laranja); font-weight: bold; font-size: 14px;">Ler aula completa ➔</span>
        </a>
        `;
        slide.classList.add("ativo");
        tituloAula.innerText = aula.titulo;
        textoAula.innerHTML = aula.descricao;
    }, 300);
}

function proximo() {
    slideAtual++;
    if (slideAtual >= aulasDinamicas.length) {
        slideAtual = 0; 
    }
    mostrarSlide();
}

function voltar() {
    slideAtual--;
    if (slideAtual < 0) {
        slideAtual = aulasDinamicas.length - 1; 
    }
    mostrarSlide();
}

document.getElementById("btn-proximo").addEventListener("click", proximo);
document.getElementById("btn-voltar").addEventListener("click", voltar);

let intervalo = setInterval(proximo, 3000);
const container = document.querySelector(".carrossel-container");

container.addEventListener("mouseenter", () => clearInterval(intervalo));
container.addEventListener("mouseleave", () => intervalo = setInterval(proximo, 3000));

async function verificarUsuario() {
    const authArea = document.getElementById("auth-area");
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data: perfil } = await supabase
            .from('perfis')
            .select('nome, role, avatar_url')
            .eq('id', user.id)
            .single();

        if (!perfil) {
            const nomeGoogle = user.user_metadata.full_name || 'Novo Usuário';
            const fotoGoogle = user.user_metadata.avatar_url || '';

            await supabase.from('perfis').insert([{ 
                id: user.id, 
                nome: nomeGoogle, 
                role: 'aluno',
                avatar_url: fotoGoogle
            }]);

            window.location.reload();
            return;
        }

        if (perfil) {
            const primeiroNome = perfil.nome.split(' ')[0];
            const avatarHTML = perfil.avatar_url 
                ? `<img src="${perfil.avatar_url}" alt="Foto de Perfil" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #fff;">`
                : `<div class="user-avatar">${perfil.nome.charAt(0).toUpperCase()}</div>`;

            authArea.innerHTML = `
            <div class="user-profile">
                <span data-i18n="ola_usuario">Olá, ${primeiroNome}!</span>
                <a href="perfil.html" title="Meu Perfil" style="text-decoration: none;">
                    ${avatarHTML}
                </a>
            </div>`;
        }
    }
}

const listaMaterias = document.getElementById("lista-materias");
const dropdownMaterias = document.getElementById("dropdown-materias");

async function carregarMaterias() {
    const { data: materias, error } = await supabase
        .from('materias')
        .select('*')
        .order('nome', { ascending: true });

    if (error) {
        console.error("Erro ao buscar materias:", error);
        return;
    }

    listaMaterias.innerHTML = "";
    dropdownMaterias.innerHTML = "";

    const btnTodas = document.createElement("div");
    btnTodas.innerText = "Todas as matérias";
    btnTodas.style.backgroundColor = "var(--laranja)"; 
    btnTodas.addEventListener("click", () => carregarAulas());
    listaMaterias.appendChild(btnTodas);

    const liTodasDrop = document.createElement("li");
    liTodasDrop.innerHTML = `<a href="#carrossel">Todas as matérias</a>`;
    liTodasDrop.addEventListener("click", () => carregarAulas());
    dropdownMaterias.appendChild(liTodasDrop);

    materias.forEach((materia) => {
        const btnMateria = document.createElement("div");
        btnMateria.innerText = materia.nome;
        btnMateria.addEventListener("click", () => carregarAulas(materia.id));
        listaMaterias.appendChild(btnMateria);

        const liDrop = document.createElement("li");
        liDrop.innerHTML = `<a href="#carrossel">${materia.nome}</a>`;
        liDrop.addEventListener("click", () => carregarAulas(materia.id));
        dropdownMaterias.appendChild(liDrop);
    });
}

// INICIA TUDO!
carregarAulas();
carregarMaterias();
verificarUsuario();
traduzirPagina();