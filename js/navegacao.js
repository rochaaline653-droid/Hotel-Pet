
document.addEventListener("DOMContentLoaded", function () {

    const paginaAtual = window.location.pathname.split("/").pop();
    const parametros = new URLSearchParams(window.location.search);

    const tipoSelecionado = parametros.get("tipo");
    const registroSelecionado = parametros.get("registro");

    // Identifica a seção do menu
    const secoes = {
        "pets.html": "pets.html",
        "cadastrar-pet.html": "pets.html",
        "visualizar-pet.html": "pets.html",
        "editar-pet.html": "pets.html",

        "reservas.html": "reservas.html",
        "nova-reserva.html": "reservas.html",
        "visualizar-reserva.html": "reservas.html",
        "editar-reserva.html": "reservas.html",
        "editar-reserva-finalizada.html": "reservas.html",

        "usuarios.html": "usuarios.html",
        "cadastrar-usuario.html": "usuarios.html",
        "visualizar-usuario.html": "usuarios.html",
        "editar-usuario.html": "usuarios.html",
        "perfil.html": "usuarios.html",

        "configuracoes.html": "configuracoes.html"
    };

    document.querySelectorAll("header nav a").forEach(function (link) {
        link.classList.remove("ativo");

        const destino = link.getAttribute("href");

        if (
            destino &&
            destino.split("/").pop() === secoes[paginaAtual]
        ) {
            link.classList.add("ativo");
        }
    });

    // Lê os dados de uma linha da tabela
    function lerRegistro(linha, tipo) {
        const celulas = linha.querySelectorAll("td");

        if (tipo === "pets") {
            const imagem = celulas[0].querySelector("img");

            return {
                nome: celulas[1].textContent.trim(),
                tipo: celulas[2].textContent.trim(),
                raca: celulas[3].textContent.trim(),
                tamanho: celulas[4].textContent.trim(),
                proprietario: celulas[5].textContent.trim(),
                foto: imagem ? imagem.getAttribute("src") : ""
            };
        }

        if (tipo === "usuarios") {
            return {
                nome: celulas[0].textContent.trim(),
                email: celulas[1].textContent.trim(),
                telefone: celulas[2].textContent.trim(),
                funcao: celulas[3].textContent.trim(),
                status: celulas[4].textContent.trim()
            };
        }

        if (tipo === "reservas") {
            return {
                pet: celulas[0].textContent.trim(),
                proprietario: celulas[1].textContent.trim(),
                entrada: celulas[2].textContent.trim(),
                saida: celulas[3].textContent.trim(),
                diarias: celulas[4].textContent.trim(),
                total: celulas[5].textContent.trim(),
                status: celulas[6].textContent.trim()
            };
        }
    }

    // Identifica qual registro foi selecionado na tabela
    const tipoDaLista = {
        "pets.html": "pets",
        "usuarios.html": "usuarios",
        "reservas.html": "reservas"
    }[paginaAtual];

    if (tipoDaLista) {
        document.querySelectorAll("tbody tr").forEach(function (linha, indice) {

            linha.querySelectorAll("a").forEach(function (link) {

                link.addEventListener("click", function (evento) {

                    const textoLink = link.textContent.trim().toLowerCase();

                    if (
                        !textoLink.includes("visualizar") &&
                        !textoLink.includes("editar")
                    ) {
                        return;
                    }

                    const registro = lerRegistro(linha, tipoDaLista);

                    // Guarda os dados da linha selecionada nesta aba
                    sessionStorage.setItem(
                        "hotelpet_" + tipoDaLista + "_" + indice,
                        JSON.stringify(registro)
                    );

                    // Envia o tipo e o número do registro para a outra tela
                    const destino = new URL(link.href);

                    destino.searchParams.set("tipo", tipoDaLista);
                    destino.searchParams.set("registro", indice);

                    evento.preventDefault();
                    window.location.href = destino.href;
                });

            });

        });
    }

    // Recupera o registro selecionado
    let registro = null;

    if (tipoSelecionado && registroSelecionado !== null) {
        const dadosSalvos = sessionStorage.getItem(
            "hotelpet_" + tipoSelecionado + "_" + registroSelecionado
        );

        if (dadosSalvos) {
            registro = JSON.parse(dadosSalvos);
        }
    }

    // Seleciona uma opção de um campo select
    function selecionarOpcao(campo, texto) {
        if (!campo || !texto) return;

        const opcao = Array.from(campo.options).find(function (item) {
            return item.textContent.trim().toLowerCase() ===
                texto.trim().toLowerCase();
        });

        if (opcao) {
            campo.value = opcao.value;
        }
    }

    // Atualiza o texto de um parágrafo sem remover seu rótulo
    function atualizarParagrafo(container, rotulo, valor) {
        if (!container) return;

        const paragrafos = container.querySelectorAll("p");

        paragrafos.forEach(function (paragrafo) {
            const destaque = paragrafo.querySelector("strong");

            if (
                destaque &&
                destaque.textContent.trim().startsWith(rotulo)
            ) {
                paragrafo.replaceChildren(
                    destaque,
                    document.createTextNode(" " + valor)
                );
            }
        });
    }

    // Mantém o identificador nas próximas telas
    function preservarNavegacao() {
        if (!registro || registroSelecionado === null) return;

        document.querySelectorAll("a").forEach(function (link) {
            const destino = link.getAttribute("href");

            if (!destino || destino.startsWith("#")) return;

            const arquivo = destino.split("?")[0].split("/").pop();

            const paginasRelacionadas = {
                pets: [
                    "visualizar-pet.html",
                    "editar-pet.html"
                ],
                usuarios: [
                    "visualizar-usuario.html",
                    "editar-usuario.html"
                ],
                reservas: [
                    "visualizar-reserva.html",
                    "editar-reserva.html",
                    "editar-reserva-finalizada.html"
                ]
            };

            if (
                paginasRelacionadas[tipoSelecionado] &&
                paginasRelacionadas[tipoSelecionado].includes(arquivo)
            ) {
                const url = new URL(link.href);
                url.searchParams.set("tipo", tipoSelecionado);
                url.searchParams.set("registro", registroSelecionado);
                link.href = url.href;
            }
        });

        // Mantém a identificação ao passar da edição para visualização
        const formulario = document.querySelector("main form");

        if (formulario) {
            let destino = formulario.getAttribute("action");

            if (destino && !destino.startsWith("http")) {
                const url = new URL(destino, window.location.href);

                url.searchParams.set("tipo", tipoSelecionado);
                url.searchParams.set("registro", registroSelecionado);

                formulario.setAttribute(
                    "action",
                    url.pathname.split("/").pop() + url.search
                );
            }
        }
    }

    if (registro) {

        // PETS: visualizar e editar
        if (tipoSelecionado === "pets") {

            const informacoes = document.querySelector(".informacoes-pet");
            const imagemVisualizacao = document.querySelector(
                ".foto-visualizar-pet img"
            );

            if (informacoes) {
                const titulo = informacoes.querySelector("h1");

                if (titulo) titulo.textContent = registro.nome;

                atualizarParagrafo(informacoes, "Tipo:", registro.tipo);
                atualizarParagrafo(informacoes, "Raça:", registro.raca);
                atualizarParagrafo(informacoes, "Tamanho:", registro.tamanho);
                atualizarParagrafo(
                    informacoes,
                    "Proprietário:",
                    registro.proprietario
                );
            }

            if (imagemVisualizacao && registro.foto) {
                imagemVisualizacao.src = registro.foto;
                imagemVisualizacao.alt = registro.nome;
            }

            const nome = document.querySelector("#nome");
            const tipo = document.querySelector("#tipo");
            const raca = document.querySelector("#raca");
            const tamanho = document.querySelector("#tamanho");
            const proprietario = document.querySelector("#proprietario");

            if (nome) nome.value = registro.nome;
            if (raca) raca.value = registro.raca;

            selecionarOpcao(tipo, registro.tipo);
            selecionarOpcao(tamanho, registro.tamanho);
            selecionarOpcao(proprietario, registro.proprietario);

            const imagemEdicao = document.querySelector(
                ".imagem-pet-novo img"
            );

            if (imagemEdicao && registro.foto) {
                imagemEdicao.src = registro.foto;
                imagemEdicao.alt = registro.nome;
            }

            const legendaImagem = document.querySelector(
                ".imagem-pet-novo p"
            );

            if (legendaImagem) {
                legendaImagem.textContent =
                    registro.nome + " - " + registro.raca;
            }
        }

        // USUÁRIOS: visualizar e editar
        if (tipoSelecionado === "usuarios") {

            const informacoes = document.querySelector(
                ".informacoes-usuario"
            );

            if (informacoes) {
                const titulo = informacoes.querySelector("h1");

                if (titulo) titulo.textContent = registro.nome;

                atualizarParagrafo(informacoes, "E-mail:", registro.email);
                atualizarParagrafo(
                    informacoes,
                    "Telefone:",
                    registro.telefone
                );
                atualizarParagrafo(informacoes, "Função:", registro.funcao);
                atualizarParagrafo(informacoes, "Status:", registro.status);

                const avatar = document.querySelector(".avatar-usuario");

                if (avatar) {
                    avatar.textContent = registro.nome
                        .split(" ")
                        .filter(Boolean)
                        .map(function (parte) {
                            return parte[0];
                        })
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();
                }
            }

            const nome = document.querySelector("#nome");
            const email = document.querySelector("#email");
            const telefone = document.querySelector("#telefone");
            const funcao = document.querySelector("#funcao");
            const status = document.querySelector("#status");

            if (nome) nome.value = registro.nome;
            if (email) email.value = registro.email;
            if (telefone) telefone.value = registro.telefone;

            selecionarOpcao(funcao, registro.funcao);
            selecionarOpcao(status, registro.status);
        }

        // RESERVAS: visualizar e editar
        if (tipoSelecionado === "reservas") {

            const titulo = document.querySelector(
                ".cabecalho-detalhes h1"
            );

            if (titulo) {
                titulo.textContent = "Reserva - " + registro.pet;
            }

            const dadosReserva = document.querySelector(".dados-reserva");

            if (dadosReserva) {
                const valores = {
                    "Pet": registro.pet,
                    "Proprietário": registro.proprietario,
                    "Entrada": registro.entrada,
                    "Saída": registro.saida,
                    "Diárias": registro.diarias,
                    "Valor": registro.total
                };

                dadosReserva.querySelectorAll("div").forEach(function (bloco) {
                    const rotulo = bloco.querySelector("strong");
                    const valor = bloco.querySelector("span");

                    if (
                        rotulo &&
                        valor &&
                        valores[rotulo.textContent.trim()] !== undefined
                    ) {
                        valor.textContent =
                            valores[rotulo.textContent.trim()];
                    }
                });
            }

            const statusVisualizacao = document.querySelector(
                ".cabecalho-detalhes .status"
            );

            if (statusVisualizacao) {
                statusVisualizacao.textContent = registro.status;
                statusVisualizacao.classList.remove(
                    "reservado",
                    "hospedado",
                    "finalizado"
                );

                const classeStatus = {
                    "Reservada": "reservado",
                    "Hospedado": "hospedado",
                    "Finalizada": "finalizado"
                };

                statusVisualizacao.classList.add(
                    classeStatus[registro.status] || "reservado"
                );
            }

            const pet = document.querySelector("#pet");
            const entrada = document.querySelector("#entrada");
            const saida = document.querySelector("#saida");
            const status = document.querySelector("#status");

            selecionarOpcao(
                pet,
                registro.pet + " - " + registro.proprietario
            );

            function converterData(data) {
                const partes = data.split("/");

                if (partes.length !== 3) return "";

                return partes[2] + "-" + partes[1] + "-" + partes[0];
            }

            if (entrada) entrada.value = converterData(registro.entrada);
            if (saida) saida.value = converterData(registro.saida);

            selecionarOpcao(status, registro.status);
        }

        preservarNavegacao();
    }

    // Confirmação de saída
    document.querySelectorAll(".usuario-topo a").forEach(function (link) {
        if (link.textContent.trim().toLowerCase() === "sair") {
            link.addEventListener("click", function (evento) {
                const confirmar = window.confirm(
                    "Deseja realmente sair do Hotel Pet?"
                );

                if (!confirmar) {
                    evento.preventDefault();
                }
            });
        }
    });

});
