import { supabase } from "./supabase.js";

const formLoginDiv = document.getElementById("form-login");
const formCadastroDiv = document.getElementById("form-cadastro");
const linkLogin = document.getElementById("link-login");
const linkCadastro = document.getElementById("link-cadastro");

linkCadastro.addEventListener("click", (e) => {
    e.preventDefault();
    formLoginDiv.style.display = "none";
    formCadastroDiv.style.display = "block";
});

linkLogin.addEventListener("click", (e) => {
    e.preventDefault();
    formLoginDiv.style.display = "block";
    formCadastroDiv.style.display = "none";
});

// Lógica de cadastro MANUAL
document.getElementById("cadastroForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const btnSubmit = e.target.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.innerText;
    btnSubmit.innerText = "Cadastrando...";
    btnSubmit.disabled = true;

    const nome = document.getElementById("nome-cadastro").value;
    const email = document.getElementById("email-cadastro").value;
    const senha = document.getElementById("senha-cadastro").value;
    const tipoConta = document.getElementById("tipo-conta").value;

    const { data: authData, error: authError} = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
            data: { full_name: nome } // Agora envia o nome certinho!
        }
    });

    if (authError) {
        alert("Ops! Erro no cadastro: " + authError.message);
        btnSubmit.innerText = textoOriginal;
        btnSubmit.disabled = false;
        return;
    }

    if (authData.user) {
        const { error: profileError} = await supabase
        .from('perfis')
        .insert([
            {id: authData.user.id, nome: nome, role: tipoConta }
        ]);

        if (profileError) {
            alert("Erro ao salvar perfil: " + profileError.message);
        } else {
            alert("Cadastro realizado com sucesso!");
            window.location.href = "index.html"; // Manda direto pra Home!
        }
    }
    
    btnSubmit.innerText = textoOriginal;
    btnSubmit.disabled = false;
});

// Lógica de login MANUAL
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email-login").value;
    const senha = document.getElementById("senha-login").value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
    });

    if (error) {
        alert("E-mail ou senha incorretos.");
    } else {
        const { data: perfilData } = await supabase
        .from('perfis')
        .select('role')
        .eq('id', data.user.id)
        .single();

        if(perfilData.role === 'professor') {
            window.location.href = "dashboard_prof.html";
        } else {
            window.location.href = "index.html";
        }
    }
});

// Lógica de CADASTRO e LOGIN com GOOGLE
const botoesGoogle = document.querySelectorAll(".btn-google");
botoesGoogle.forEach(botao => {
    botao.addEventListener("click", async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/index.html'
            }
        });

        if (error) {
            alert("Erro ao conectar com o Google: " + error.message);
        }
    });
});