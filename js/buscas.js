
document.addEventListener("DOMContentLoaded", function () {

    const campoPesquisa = document.querySelector("#pesquisa");

    const filtroSelect = document.querySelector(
        "#tipo, #funcao, #status"
    );

    const tabela = document.querySelector(
        ".tabela-container tbody"
    );

    // Verifica se a página possui pesquisa e tabela
    if (!campoPesquisa || !tabela) {
        return;
    }

    const caminho = window.location.pathname.toLowerCase();

    let tipoPagina = "geral";

    // Identifica a página atual
    if (caminho.endsWith("/pets.html")) {
        tipoPagina = "pets";
    } else if (caminho.endsWith("/usuarios.html")) {
        tipoPagina = "usuarios";
    } else if (caminho.endsWith("/reservas.html")) {
        tipoPagina = "reservas";
    }

    // Define as colunas que serão pesquisadas
    const configuracoes = {

        pets: {
            colunas: [1, 2, 3, 4, 5],
            colunaFiltro: 2
        },

        usuarios: {
            colunas: [0, 1, 2],
            colunaFiltro: 3
        },

        reservas: {
            colunas: [0, 1],
            colunaFiltro: 6
        }
    };

    const config = configuracoes[tipoPagina];

    // Ignora letras maiúsculas e acentos
    function normalizar(texto) {

        return texto
            .toLocaleLowerCase("pt-BR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    // Cria mensagem de resultados
    const mensagem = document.createElement("p");

    mensagem.id = "mensagem-pesquisa";
    mensagem.setAttribute("role", "status");
    mensagem.style.margin = "12px 0";
    mensagem.style.color = "#333";
    mensagem.style.fontSize = "14px";

    const filtros = document.querySelector(".filtros");

    if (filtros) {
        filtros.insertAdjacentElement("afterend", mensagem);
    }

    // Executa a pesquisa
    function aplicarPesquisa() {

        const termo = normalizar(campoPesquisa.value);

        const valorFiltro = filtroSelect
            ? normalizar(filtroSelect.value)
            : "todos";

        // Busca as linhas atuais, inclusive as criadas pelo JavaScript
        const linhas = Array.from(
            tabela.querySelectorAll("tr")
        );

        let quantidadeVisivel = 0;

        linhas.forEach(function (linha) {

            const celulas = Array.from(linha.cells);

            let textoPesquisa;

            if (config) {

                textoPesquisa = config.colunas
                    .map(function (indice) {

                        return celulas[indice]
                            ? celulas[indice].textContent
                            : "";

                    })
                    .join(" ");

            } else {

                textoPesquisa = linha.textContent;

            }

            // Verifica o texto digitado
            const correspondeTexto =
                normalizar(textoPesquisa).includes(termo);

            let correspondeFiltro = true;

            // Verifica o filtro selecionado
            if (
                config &&
                filtroSelect &&
                valorFiltro !== "todos"
            ) {

                const celulaFiltro =
                    celulas[config.colunaFiltro];

                correspondeFiltro = celulaFiltro
                    ? normalizar(celulaFiltro.textContent)
                        .includes(valorFiltro)
                    : false;

            }

            // Mostra ou oculta a linha
            const mostrar =
                correspondeTexto && correspondeFiltro;

            linha.style.display = mostrar ? "" : "none";

            if (mostrar) {
                quantidadeVisivel++;
            }

        });

        // Atualiza a mensagem
        if (quantidadeVisivel === 0) {

            mensagem.textContent =
                "Nenhum resultado encontrado. Tente outra pesquisa.";

        } else if (quantidadeVisivel === 1) {

            mensagem.textContent =
                "1 registro encontrado.";

        } else {

            mensagem.textContent =
                quantidadeVisivel + " registros encontrados.";

        }

    }

    // Pesquisa enquanto digita
    campoPesquisa.addEventListener(
        "input",
        aplicarPesquisa
    );

    // Atualiza quando o filtro muda
    if (filtroSelect) {

        filtroSelect.addEventListener(
            "change",
            aplicarPesquisa
        );

    }

    // Pesquisa inicial
    aplicarPesquisa();

});

