import { supabase } from "./supabase.js";

async function carregarAulaCompleta() {
    //Pega o ID da URL
    const parametros = new URLSearchParams(window.location.search);
    const idAula = parametros.get("id");

    if (!idAula) {
        document.getElementById("carregando-aula").innerHTML = "<h2>Aula não encontrada. Caminho inválido.</h2>";
        return;
    }

    //busca os dados no supabase
    const { data: aula, error} = await supabase
    .from('aulas')
    .select('*,materias(nome)')
    .eq('id', idAula)
    .single(); //single garante que vai ser pego apenas 1 item

    if (error) {
        console.error("Erro:", error);
        document.getElementById("carregando-aula").innerHTML = "<h2>Erro ao carregar a aula.</h2>";
        return;
    }

    //joga os dados na tela
    document.getElementById("tag-materia").innerText = aula.materias.nome;
    document.getElementById("titulo-aula").innerText = aula.titulo;
    document.getElementById("corpo-aula").innerHTML = DOMPurify.sanitize(aula.conteudo, {
ADD_TAGS: ['iframe'],
ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
});

    //oculta carregamento e mostra o conteúdo
    document.getElementById("carregando-aula").style.display = "none";
    document.getElementById("conteudo-completo").style.display = "block";

    //atualiza o título da aba
    document.title = `Aula: ${aula.titulo} | Vila dos Estudos`;
}

carregarAulaCompleta();