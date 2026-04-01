//carrossel

const slides = [
    {
    titulo: "Dia 1 - Linguagens",
    descricao: "Interpretação de textos, coesão e escrita."
    },
    {
    titulo: "Dia 1 - Matemática",
    descricao: "Operações, porcentagem e matemática financeira."
    },
    {
    titulo: "Dia 1 - Humanas",
    descricao: "História geral: Egito, Grécia, Roma."
    },
    {
    titulo: "Dia 1 - Ciências",
    descricao: "Química e física: atomos e cinemática."
    },
    {
    titulo: "Dia 2 - Linguagens",
    descricao: "Leitura Guiada e interpretação."
    },
    {
    titulo: "Dia 2 - Matemática",
    descricao: "juros simples e compostos."
    }
];

const slide = document.getElementById("slide");

let index = 0;

function mostrarSlide() {
    slide.classList.remove("ativo");
    setTimeout(() => {
    slide.innerHTML = `
    <h3>${slides[index].titulo}</h3>
    <p>${slides[index].descricao}</p>`;
    
    slide.classList.add("ativo");

    },300);

}

mostrarSlide();

function proximo() {
    index++;

    if (index >= slides.length) {
        index = 0;
    }

    mostrarSlide();
}

function voltar() {
    index--;

    if (index < 0) {
        index = slides.length - 1;
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
}) 