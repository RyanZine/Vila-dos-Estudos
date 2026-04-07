import { supabase } from "./supabase.js";

const formLoginDiv =
document.getElementById("form-login");
const formCadastroDiv = 
document.getElementById("form-cadastro");
const linkLogin = 
document.getElementById("link-login");
const linkCadastro = 
document.getElementById("link-cadastro");

//alterna a visualização entre telas
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

//lógica de cadastro
document.getElementById("cadastroForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome-cadastro").value;
    const email = document.getElementById("email-cadastro").value;
    const senha = document.getElementById("senha-cadastro").value;
    const tipoConta = document.getElementById("tipo-conta").value;

    //cadastro na autenticação do Supabase
    const { data: authData, error: authError} = await supabase.auth.signUp({
        email: email,
        password: senha,
    });

    if (authError) {
        console.error("Erro ao cadastrar:" + authError.message);
        return;
    }

    //salva o nome e 'role' na tabela de perfis

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
            //reseta e volta para o login
            document.getElementById("cadastroForm").reset();
            formCadastroDiv.style.display = "none";
            formLoginDiv.style.display = "block";
        }
    }
});

//lógica de login
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
        //pega role dobanco para direcionar
        const { data: perfilData } = await supabase
        .from('perfis')
        .select('role')
        .eq('id', data.user.id)
        .single();

        if(perfilData.role ==='professor') {
            window.location.href = "dashboard_prof.html";
        } else {
            window.location.href = "index.html";}
        
    }
    });