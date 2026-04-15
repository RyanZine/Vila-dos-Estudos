// src/scripts/i18n.js

export const dicionario = {
    "pt-br": {
        "nav_home": "Home",
        "nav_sobre": "Sobre nós",
        "nav_materias": "Matérias 🔽",
        "nav_duvidas": "Dúvidas",
        "btn_entrar": "Entrar",
        "titulo_bem_vindo": "Bem-vindo a Vila dos Estudos!",
        "sub_bem_vindo": "Aqui você encontra a melhor maneira de estudos para avançar na sua jornada acadêmica!"
    },
    "en": {
        "nav_home": "Home",
        "nav_sobre": "About Us",
        "nav_materias": "Subjects 🔽",
        "nav_duvidas": "FAQ",
        "btn_entrar": "Login",
        "titulo_bem_vindo": "Welcome to Vila dos Estudos!",
        "sub_bem_vindo": "Here you find the best way to study and advance in your academic journey!"
    },
    "es": {
        "nav_home": "Inicio",
        "nav_sobre": "Sobre nosotros",
        "nav_materias": "Materias 🔽",
        "nav_duvidas": "Dudas",
        "btn_entrar": "Entrar",
        "titulo_bem_vindo": "¡Bienvenido a Vila dos Estudos!",
        "sub_bem_vindo": "¡Aquí encuentras la mejor manera de estudiar para avanzar en tu viaje académico!"
    }
};

export function traduzirPagina() {
    // Busca o idioma salvo ou usa português como padrão
    const idioma = localStorage.getItem('idioma_vila') || 'pt-br';
    
    // Procura todos os elementos no HTML que têm o atributo 'data-i18n'
    const elementosParaTraduzir = document.querySelectorAll('[data-i18n]');
    
    elementosParaTraduzir.forEach(elemento => {
        const chave = elemento.getAttribute('data-i18n');
        // Se a tradução existir no dicionário, substitui o texto da tela!
        if (dicionario[idioma] && dicionario[idioma][chave]) {
            elemento.innerText = dicionario[idioma][chave];
        }
    });
}