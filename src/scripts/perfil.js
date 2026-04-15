import { supabase } from "./supabase.js";

const inputAvatar = document.getElementById("input-avatar");
const previewAvatar = document.getElementById("preview-avatar");
let arquivoFotoNova = null; // Guarda a foto antes de salvar

// --- 1. CARREGAR OS DADOS DO USUÁRIO ---
async function carregarPerfil() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("email-perfil").value = user.email;

    const { data: perfil } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', user.id)
        .single();

    if (perfil) {
        document.getElementById("nome-perfil").value = perfil.nome;
        document.getElementById("tipo-perfil").value = perfil.role;
        
        // Carrega o tema e idioma salvos
        if(perfil.tema) document.getElementById("tema-perfil").value = perfil.tema;
        if(perfil.idioma) document.getElementById("idioma-perfil").value = perfil.idioma;
        
        // Carrega a foto se existir, senão usa uma letra/placeholder
        if (perfil.avatar_url) {
            previewAvatar.src = perfil.avatar_url;
        } else {
            previewAvatar.src = `https://ui-avatars.com/api/?name=${perfil.nome}&background=FF7A00&color=fff&size=100`;
        }

        if (perfil.role === 'professor') {
            document.getElementById("area-professor").style.display = "block";
        }
    }
}

// --- 2. PRÉ-VISUALIZAR A FOTO NA TELA ---
inputAvatar.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        arquivoFotoNova = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewAvatar.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// --- 3. SALVAR TUDO (NOME, TEMA E FOTO) ---
document.getElementById("formPerfil").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btnSalvar = document.getElementById("btn-salvar");
    btnSalvar.innerText = "Salvando...";
    btnSalvar.disabled = true;

    const { data: { user } } = await supabase.auth.getUser();
    
    // Pega os valores da tela
    const novosDados = {
        nome: document.getElementById("nome-perfil").value,
        tema: document.getElementById("tema-perfil").value,
        idioma: document.getElementById("idioma-perfil").value
    };

    // Aplica o tema na tela na mesma hora
    aplicarTema(novosDados.tema);
    
    // Salva o tema no LocalStorage para não piscar branco ao recarregar
    localStorage.setItem('tema_vila', novosDados.tema); 

    // Se o usuário escolheu uma foto nova, envia pro Storage
    if (arquivoFotoNova) {
        const extensao = arquivoFotoNova.name.split('.').pop();
        const caminhoFoto = `public/${user.id}-${Date.now()}.${extensao}`;
        
        // Faz o upload pro bucket "avatars"
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(caminhoFoto, arquivoFotoNova);

        if (!uploadError) {
            // Pega o link público da foto gerada
            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(caminhoFoto);
            novosDados.avatar_url = urlData.publicUrl;
        }
    }

    // Salva tudo no banco de dados (perfis)
    const { error } = await supabase
        .from('perfis')
        .update(novosDados)
        .eq('id', user.id);

    btnSalvar.innerText = "Salvar Alterações";
    btnSalvar.disabled = false;

    if (error) {
        alert("Erro ao atualizar o perfil: " + error.message);
    } else {
        alert("Perfil atualizado com sucesso! ✨");
    }
});

// --- 4. FUNÇÃO PARA APLICAR O TEMA ---
function aplicarTema(tema) {
    document.body.classList.remove('theme-dark', 'theme-sepia');
    if (tema !== 'light') {
        document.body.classList.add(`theme-${tema}`);
    }
}

document.getElementById("btn-logout-perfil").addEventListener("click", async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('tema_vila'); // Limpa o tema ao sair
    window.location.href = "../index.html";
});

carregarPerfil();