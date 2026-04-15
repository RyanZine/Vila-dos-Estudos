import { supabase } from "./supabase.js";

// --- INICIALIZAÇÃO DO EDITOR DE TEXTO (QUILL) ---
const quill = new Quill('#editor-container', {
    theme: 'snow',
    placeholder: 'Escreva o texto da aula aqui...',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // Negrito, itálico, etc
            ['blockquote', 'code-block'],                     // Citações e códigos
            [{ 'header': 1 }, { 'header': 2 }],               // Títulos grandes e médios
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],     // Listas numéricas e pontilhadas
            [{ 'color': [] }, { 'background': [] }],          // Cores do texto e fundo
            ['link', 'image', 'video'],                       // INSERIR MÍDIAS (Imagens, YouTube, etc)
            ['clean']                                         // Limpar formatação
        ]
    }
});

//logout
document.getElementById("btn-logout").addEventListener("click", async () => {
    //vai pedir para o Supabase encerrar a sessão atual
    const { error } = await supabase.auth.signOut();

    if(error) {
        alert("Erro ao sair: " + error.message);
    } else {
        //Redireciona o usuário de voldta para a tela de login
        window.location.href = "login.html";
    }
});

// --- LÓGICA DE EXCLUSÃO DE CONTA ---
document.getElementById("btn-excluir-conta").addEventListener("click", async () => {
    // 1. Confirmação dupla (É uma ação destrutiva!)
    const confirmacao = confirm("CUIDADO: Tem certeza que deseja excluir sua conta e todas as suas aulas permanentemente? Esta ação não pode ser desfeita.");
    
    if (confirmacao) {
        // 2. Chama a função secreta que criamos lá no SQL Editor
        const { error } = await supabase.rpc('deletar_minha_conta');

        if (error) {
            alert("Erro ao excluir conta: " + error.message);
        } else {
            alert("Sua conta foi excluída para sempre. Adeus! 👋");
            // 3. Força o logout para limpar o navegador e manda pra home
            await supabase.auth.signOut();
            window.location.href = "index.html";
        }
    }
});

// --- VARIÁVEL DE ESTADO (Controla se estamos criando ou editando) ---
let aulaEditandoId = null;

// --- FUNÇÃO 1: CARREGAR AS AULAS DO PROFESSOR ---
async function carregarMinhasAulas() {
    const listaAulas = document.getElementById("lista-minhas-aulas");
    listaAulas.innerHTML = "<p>Carregando...</p>";

    // Busca todas as aulas ordenadas das mais novas para as mais velhas
    const { data: aulas, error } = await supabase
        .from('aulas')
        .select('*, materias(nome)')
        .order('data_publicacao', { ascending: false });

    if (error) {
        listaAulas.innerHTML = "<p>Erro ao carregar as aulas.</p>";
        return;
    }

    if (aulas.length === 0) {
        listaAulas.innerHTML = "<p>Você ainda não tem nenhuma aula cadastrada.</p>";
        return;
    }

    listaAulas.innerHTML = ""; // Limpa a tela

    // Desenha cada aula na tela
    aulas.forEach(aula => {
        const card = document.createElement("div");
        card.className = "aula-card";
        
        // Formata a data para exibir bonitinho
        const dataFormatada = new Date(aula.data_publicacao).toLocaleDateString('pt-BR');

        card.innerHTML = `
            <div class="aula-card-info">
                <h4>${aula.titulo}</h4>
                <p><strong>${aula.materias.nome}</strong> • Publicada em: ${dataFormatada}</p>
            </div>
            <div class="aula-card-acoes">
                <button class="btn-acao btn-editar" onclick="prepararEdicao('${aula.id}')">✏️ Editar</button>
                <button class="btn-acao btn-deletar" onclick="deletarAula('${aula.id}')">🗑️ Excluir</button>
            </div>
        `;
        listaAulas.appendChild(card);
    });
}

// --- FUNÇÃO 2: DELETAR AULA ---
window.deletarAula = async function(id) {
    // Pede confirmação antes de apagar
    if (confirm("Tem certeza que deseja excluir esta aula para sempre?")) {
        const { error } = await supabase
            .from('aulas')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Erro ao excluir: " + error.message);
        } else {
            alert("Aula excluída com sucesso!");
            carregarMinhasAulas(); // Recarrega a lista
        }
    }
}

// --- FUNÇÃO 3: PREPARAR O FORMULÁRIO PARA EDIÇÃO ---
window.prepararEdicao = async function(id) {
    // Busca os dados completos da aula específica
    const { data: aula, error } = await supabase
        .from('aulas')
        .select('*')
        .eq('id', id)
        .single();

    if (aula) {
        // Preenche os campos do formulário
        document.getElementById("titulo").value = aula.titulo;
        document.getElementById("materia").value = aula.materia_id;
        document.getElementById("descricao").value = aula.descricao;
        
        // Ajusta a data para o formato do input (YYYY-MM-DDThh:mm)
        if (aula.data_publicacao) {
            document.getElementById("data").value = aula.data_publicacao.slice(0, 16);
        }

        // Joga o conteúdo de volta para o editor Quill
        quill.root.innerHTML = aula.conteudo;

        // Muda o estado do sistema para "Modo de Edição"
        aulaEditandoId = aula.id;
        document.getElementById("btn-salvar-aula").innerText = "Atualizar Aula";
        document.getElementById("btn-cancelar-edicao").style.display = "block";
        
        // Rola a tela para o topo para o professor ver o formulário
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// --- FUNÇÃO 4: CANCELAR EDIÇÃO ---
document.getElementById("btn-cancelar-edicao").addEventListener("click", () => {
    limparFormulario();
});

function limparFormulario() {
    aulaEditandoId = null;
    document.getElementById("formNovaAula").reset();
    quill.root.innerHTML = ''; // Limpa o editor
    document.getElementById("btn-salvar-aula").innerText = "Publicar Aula";
    document.getElementById("btn-cancelar-edicao").style.display = "none";
}

// --- LÓGICA PRINCIPAL: SALVAR OU ATUALIZAR (SUBMIT) ---
document.getElementById("formNovaAula").addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const titulo = document.getElementById("titulo").value;
    const materiaId = document.getElementById("materia").value;
    const descricao = document.getElementById("descricao").value;
    const conteudo = quill.root.innerHTML;
    const dataInput = document.getElementById("data").value;
    const dataPublicacao = dataInput ? new Date(dataInput).toISOString() : new Date().toISOString();

    if (quill.getText().trim().length === 0) {
        alert("Por favor, escreva o conteúdo da aula!");
        return;
    }

    const dadosAula = { 
        titulo: titulo, 
        materia_id: materiaId, 
        descricao: descricao, 
        conteudo: conteudo,
        data_publicacao: dataPublicacao
    };

    let erroSupabase;

    // A GRANDE DECISÃO: Inserir (Novo) ou Atualizar (Existente)?
    if (aulaEditandoId) {
        // UPDATE: Atualiza a aula que tem o ID selecionado
        const { error } = await supabase
            .from('aulas')
            .update(dadosAula)
            .eq('id', aulaEditandoId);
        erroSupabase = error;
    } else {
        // INSERT: Cria uma aula totalmente nova
        const { error } = await supabase
            .from('aulas')
            .insert([dadosAula]);
        erroSupabase = error;
    }

    if (erroSupabase) {
        alert("Erro ao salvar a aula: " + erroSupabase.message);
    } else {
        alert(aulaEditandoId ? "Aula atualizada com sucesso!" : "Aula publicada com sucesso! 🎉");
        limparFormulario();
        carregarMinhasAulas(); // Recarrega a lista para mostrar a alteração
    }
});

// Inicializa a lista de aulas assim que o professor entra no painel
carregarMinhasAulas();