
document.addEventListener("DOMContentLoaded", function () {

    const chave = "hotelPetReservas";

    // Busca o valor da diária salvo na página de Configurações
    function obterValorDiaria() {
        let configuracoes = {};

        try {
            configuracoes = JSON.parse(
                localStorage.getItem("hotelPetConfiguracoes")
            ) || {};
        } catch (erro) {
            configuracoes = {};
        }

        const valor = Number(configuracoes.valorDiaria);

        // Se não houver configuração válida, utiliza R$ 50,00
        return Number.isFinite(valor) && valor > 0 ? valor : 50;
    }

    function dataParaISO(data) {
        if (!data || !data.includes("/")) return data;

        const partes = data.split("/");
        return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    function dataParaBR(data) {
        if (!data) return "";

        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    function calcularDiarias(entrada, saida) {
        if (!entrada || !saida) return 0;

        const inicio = new Date(entrada + "T00:00:00");
        const fim = new Date(saida + "T00:00:00");

        return Math.max(
            0,
            Math.round((fim - inicio) / (1000 * 60 * 60 * 24))
        );
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    // Carrega as reservas
    function carregarReservas() {

        const dados = localStorage.getItem(chave);

        if (dados) {
            return JSON.parse(dados);
        }

        const linhas = document.querySelectorAll(
            ".tabela-container tbody tr"
        );

        return Array.from(linhas).map(function (linha) {

            const celulas = linha.querySelectorAll("td");

            return {
                pet: celulas[0].textContent.trim(),
                proprietario: celulas[1].textContent.trim(),
                entrada: dataParaISO(celulas[2].textContent.trim()),
                saida: dataParaISO(celulas[3].textContent.trim()),
                status: celulas[6].textContent.trim(),
                anotacoes: "",
                imagem: "",
                recibo: ""
            };
        });
    }

    // Salva as reservas
    function salvarReservas(lista) {
        localStorage.setItem(chave, JSON.stringify(lista));
    }

    let reservas = carregarReservas();

    // Exibe as reservas na tabela
    function mostrarReservas() {

        const corpo = document.querySelector(
            ".tabela-container tbody"
        );

        if (!corpo) return;

        corpo.innerHTML = "";

        reservas.forEach(function (reserva, indice) {

            const linha = document.createElement("tr");

            const diarias = calcularDiarias(
                reserva.entrada,
                reserva.saida
            );

            // Utiliza o valor atual configurado pelo gerente
            const valorDiaria = obterValorDiaria();
            const total = diarias * valorDiaria;

            const valores = [
                reserva.pet,
                reserva.proprietario,
                dataParaBR(reserva.entrada),
                dataParaBR(reserva.saida),
                diarias,
                formatarMoeda(total)
            ];

            valores.forEach(function (valor) {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            });

            const celulaStatus = document.createElement("td");
            const etiqueta = document.createElement("span");

            etiqueta.textContent = reserva.status;
            etiqueta.className = "status";

            if (reserva.status === "Reservada") {
                etiqueta.classList.add("reservado");
            } else if (reserva.status === "Hospedado") {
                etiqueta.classList.add("hospedado");
            } else if (reserva.status === "Finalizada") {
                etiqueta.classList.add("finalizado");
            }

            celulaStatus.appendChild(etiqueta);
            linha.appendChild(celulaStatus);

            const acoes = document.createElement("td");

            const visualizar = document.createElement("a");
            visualizar.href = "visualizar-reserva.html?id=" + indice;
            visualizar.textContent = "Visualizar";

            const editar = document.createElement("a");

            editar.href = reserva.status === "Finalizada"
                ? "editar-reserva-finalizada.html?id=" + indice
                : "editar-reserva.html?id=" + indice;

            editar.textContent = "Editar";

            const excluir = document.createElement("button");
            excluir.textContent = "Excluir";
            excluir.className = "botao-excluir-tabela";
            excluir.dataset.indice = indice;

            acoes.appendChild(visualizar);
            acoes.appendChild(document.createElement("br"));
            acoes.appendChild(editar);
            acoes.appendChild(document.createElement("br"));
            acoes.appendChild(excluir);

            linha.appendChild(acoes);
            corpo.appendChild(linha);
        });
    }

    // Formulário de edição
    const formulario = document.querySelector(
        ".formulario-centralizado form"
    );

    if (formulario) {

        const parametros = new URLSearchParams(
            window.location.search
        );

        const indice = Number(parametros.get("id"));

        if (
            !parametros.has("id") ||
            !Number.isInteger(indice) ||
            indice < 0 ||
            !reservas[indice]
        ) {
            alert("Reserva não encontrada.");
            window.location.href = "reservas.html";
            return;
        }

        const reserva = reservas[indice];

        const campoPet = document.getElementById("pet");
        const campoEntrada = document.getElementById("entrada");
        const campoSaida = document.getElementById("saida");
        const campoStatus = document.getElementById("status");
        const campoAnotacoes = document.getElementById("anotacoes");
        const campoRecibo = document.getElementById("recibo");
        const campoImagem = document.getElementById("imagem");

        // Carrega os pets cadastrados
        const petsCadastrados = JSON.parse(
            localStorage.getItem("hotelPetPets")
        ) || [];

        if (campoPet) {

            campoPet.innerHTML = "";

            // Adiciona os animais cadastrados
            petsCadastrados.forEach(function (pet) {

                const nomePet = pet.nome || "";
                const proprietario = pet.proprietario || "";

                const opcao = document.createElement("option");

                opcao.value = nomePet + " - " + proprietario;
                opcao.textContent = nomePet + " - " + proprietario;

                campoPet.appendChild(opcao);
            });

            // Verifica se o pet da reserva está na lista
            const valorReserva =
                reserva.pet + " - " + reserva.proprietario;

            const existeOpcao = Array.from(
                campoPet.options
            ).some(function (opcao) {
                return opcao.value === valorReserva;
            });

            // Se não estiver na lista, adiciona o pet da reserva
            if (!existeOpcao) {

                const opcaoAtual = document.createElement("option");

                opcaoAtual.value = valorReserva;
                opcaoAtual.textContent = valorReserva;

                campoPet.appendChild(opcaoAtual);
            }

            // Seleciona o animal da reserva
            campoPet.value = valorReserva;
        }

        // Preenche os demais campos
        campoEntrada.value = reserva.entrada || "";
        campoSaida.value = reserva.saida || "";
        campoStatus.value = reserva.status || "Reservada";
        campoAnotacoes.value = reserva.anotacoes || "";

        if (campoRecibo) {
            campoRecibo.value = reserva.recibo || "";
        }

        if (campoImagem) {
            campoImagem.value = reserva.imagem || "";
        }

        // Atualiza o valor total com a diária definida nas Configurações
        function atualizarValor() {

            const diarias = calcularDiarias(
                campoEntrada.value,
                campoSaida.value
            );

            const valorDiaria = obterValorDiaria();
            const total = diarias * valorDiaria;

            const elementoDiaria = document.getElementById("valorDiaria");
            const elementoTotal = document.getElementById("valorTotal");

            if (elementoDiaria) {
                elementoDiaria.textContent = formatarMoeda(valorDiaria);
            }

            if (elementoTotal) {
                elementoTotal.textContent = formatarMoeda(total);
            }
        }

        campoEntrada.addEventListener("change", atualizarValor);
        campoSaida.addEventListener("change", atualizarValor);

        atualizarValor();

        const descricao = document.getElementById("descricaoReserva");

        if (descricao) {
            descricao.textContent =
                "Reserva de " + reserva.pet + " - " + reserva.proprietario;
        }

        // Salva as alterações
        formulario.addEventListener("submit", function (evento) {

            evento.preventDefault();

            const petSelecionado = campoPet.value.split(" - ");

            const entrada = campoEntrada.value;
            const saida = campoSaida.value;

            if (!entrada || !saida || saida <= entrada) {
                alert("A data de saída deve ser posterior à data de entrada.");
                return;
            }

            reserva.pet = petSelecionado[0];
            reserva.proprietario = petSelecionado.slice(1).join(" - ");
            reserva.entrada = entrada;
            reserva.saida = saida;
            reserva.status = campoStatus.value;
            reserva.anotacoes = campoAnotacoes.value;

            if (campoRecibo) {
                reserva.recibo = campoRecibo.value;
            }

            if (campoImagem) {
                reserva.imagem = campoImagem.value;
            }

            reservas[indice] = reserva;

            salvarReservas(reservas);

            alert("Reserva atualizada com sucesso!");

            window.location.href = "reservas.html";
        });
    }

    // Exclusão de reservas
    const corpo = document.querySelector(
        ".tabela-container tbody"
    );

    if (corpo) {

        corpo.addEventListener("click", function (evento) {

            if (
                evento.target.classList.contains(
                    "botao-excluir-tabela"
                )
            ) {

                const indice = Number(
                    evento.target.dataset.indice
                );

                if (confirm("Deseja realmente excluir esta reserva?")) {

                    reservas.splice(indice, 1);

                    salvarReservas(reservas);
                    mostrarReservas();

                    alert("Reserva excluída com sucesso!");
                }
            }
        });

        salvarReservas(reservas);
        mostrarReservas();
    }

});

