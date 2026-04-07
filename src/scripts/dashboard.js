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

    // 2. Envia os dados para a tabela 'aulas' no Supabase
    const { error } = await supabase
        .from('aulas')
        .insert([
            { 
                titulo: titulo, 
                materia_id: materiaId, 
                descricao: descricao, 
                conteudo: conteudo 
            }
        ]);

    // 3. Verifica se deu tudo certo
    if (error) {
        alert("Erro ao publicar a aula: " + error.message);
    } else {
        alert("Aula publicada com sucesso! 🎉");
        // Limpa o formulário para o professor poder cadastrar outra aula
        document.getElementById("formNovaAula").reset();
    }
});