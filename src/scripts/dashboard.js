import { supabase } from "./supabase.js";

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

// --- LÓGICA DE CADASTRO DE AULAS ---
document.getElementById("formNovaAula").addEventListener("submit", async (e) => {
    e.preventDefault(); 

    // 1. Captura os valores digitados no formulário
    const titulo = document.getElementById("titulo").value;
    const materiaId = document.getElementById("materia").value;
    const descricao = document.getElementById("descricao").value;
    const conteudo = document.getElementById("conteudo").value;
    
    // Captura a data. Se estiver vazia, pega a data e hora de 'agora'
    const dataInput = document.getElementById("data").value;
    const dataPublicacao = dataInput ? new Date(dataInput).toISOString() : new Date().toISOString();

    // 2. Envia os dados para o Supabase (agora com a data_publicacao)
    const { error } = await supabase
        .from('aulas')
        .insert([
            { 
                titulo: titulo, 
                materia_id: materiaId, 
                descricao: descricao, 
                conteudo: conteudo,
                data_publicacao: dataPublicacao // <-- A mágica do agendamento entra aqui
            }
        ]);

    // 3. Verifica se deu tudo certo
    if (error) {
        alert("Erro ao publicar a aula: " + error.message);
    } else {
        alert("Aula salva com sucesso! 🎉");
        document.getElementById("formNovaAula").reset();
    }
});