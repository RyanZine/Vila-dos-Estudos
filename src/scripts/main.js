import { supabase } from "./supabase.js";
import { traduzirPagina } from "./i18n.js";

const slide = document.getElementById("slide");
const tituloAula = document.getElementById("titulo-aula");
const textoAula = document.getElementById("texto-aula");

let aulasDinamicas = []; // Aqui vamos guardar as aulas do banco
let slideAtual = 0;

// 1. Função para buscar as aulas no Supabase (Agora com FILTRO!)
async function carregarAulas(materiaId = null) { // <-- Recebe o ID opcionalmente
    const hoje = new Date().toISOString();

    // Começamos a montar o pedido para o banco
    let query = supabase
        .from('aulas')
        .select('*, materias(nome)') 
        .lte('data_publicacao', hoje)
        .order('data_publicacao', { ascending: false })
        .limit(5); 

    // Se o professor/aluno enviou um ID de matéria, a gente adiciona o filtro na query!
    if (materiaId) {
        query = query.eq('materia_id', materiaId);
    }

    // Só agora mandamos o pedido final pro banco
    const { data, error } = await query;

    if (error) {
        console.error("Erro ao buscar aulas:", error);
        slide.innerHTML = `<p>Erro ao carregar as aulas.</p>`;
        return;
    }

    aulasDinamicas = data;
    slideAtual = 0; // Volta para o primeiro slide para o novo filtro
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

// --- INTERFACE DE USUÁRIO E VERIFICAÇÃO ---
async function verificarUsuario() {
    const authArea = document.getElementById("auth-area");

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // Tenta buscar o perfil do usuário
        const { data: perfil } = await supabase
            .from('perfis')
            .select('nome, role, avatar_url')
            .eq('id', user.id)
            .single();

        // SE O PERFIL NÃO EXISTIR: Significa que ele acabou de se cadastrar via Google!
        if (!perfil) {
            // Pega o nome e a foto que o Google forneceu
            const nomeGoogle = user.user_metadata.full_name || 'Novo Usuário';
            const fotoGoogle = user.user_metadata.avatar_url || '';

            // Cria o perfil na tabela 'perfis' definindo ele como 'aluno' por padrão
            await supabase.from('perfis').insert([{ 
                id: user.id, 
                nome: nomeGoogle, 
                role: 'aluno',
                avatar_url: fotoGoogle
            }]);

            // Recarrega a página rapidinho para mostrar os dados recém-criados
            window.location.reload();
            return;
        }

        // SE O PERFIL EXISTE: Mostra o avatar normalmente
        if (perfil) {
            const primeiroNome = perfil.nome.split(' ')[0];
            
            // Se ele tiver foto (do Google ou que subiu no perfil), mostra a foto. Se não, mostra a letra.
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

if (perfil) {
            const inicial = perfil.nome.charAt(0).toUpperCase();
            
            // AGORA TODO MUNDO VAI PARA O PERFIL!
            authArea.innerHTML = `<div class="user-profile">
            <span>Olá, ${perfil.nome.split(' ')[0]}!</span>
            <a href="perfil.html" title="Meu Perfil" style="text-decoration: none;">
                <div class="user-avatar">${inicial}</div>
            </a>
            </div>`;
        }

// --- LÓGICA DE MATÉRIAS E FILTROS ---
// Correção 1: ID ajustado para "lista-materias"
const listaMaterias = document.getElementById("lista-materias");
const dropdownMaterias = document.getElementById("dropdown-materias");
async function carregarMaterias() {
    // Correção 2: Apelidamos o 'data' de 'materias' para o forEach funcionar
    const { data: materias, error } = await supabase
        .from('materias')
        .select('*')
        .order('nome', { ascending: true });

    if (error) {
        console.error("Erro ao buscar materias:", error);
        return;
    }

    // limpa a área antes de colocar os botões
    listaMaterias.innerHTML = "";
    dropdownMaterias.innerHTML = "";

    // cria o botão "Todas as matérias"
    const btnTodas = document.createElement("div");
    btnTodas.innerText = "Todas as matérias";
    btnTodas.style.backgroundColor = "var(--laranja)"; // Deixa ele em destaque!
    btnTodas.addEventListener("click", () => {
        carregarAulas();
    });
    listaMaterias.appendChild(btnTodas);

    //dropdown do header
    const liTodasDrop = document.createElement("li");
    liTodasDrop.innerHTML = `<a href="#carrossel">Todas as matérias</a>`;
    liTodasDrop.addEventListener("click", () => {
        carregarAulas();
    });
    dropdownMaterias.appendChild(liTodasDrop);

    // cria um botão para cada matéria que veio do banco
    materias.forEach((materia) => {
        const btnMateria = document.createElement("div");
        btnMateria.innerText = materia.nome;

        btnMateria.addEventListener("click", () => {
            carregarAulas(materia.id);
        });

        listaMaterias.appendChild(btnMateria);

        //dropdown do header 2
        const liDrop = document.createElement("li");
        liDrop.innerHTML = `<a href="#carrossel">${materia.nome}</a>`;
        liDrop.addEventListener("click", () => {
            carregarAulas(materia.id);
        });
        dropdownMaterias.appendChild(liDrop);
    });
}

carregarMaterias();
traduzirPagina();