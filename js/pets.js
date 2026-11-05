document.addEventListener("DOMContentLoaded", function () {

    const chave = "hotelPetPets";

    // Recupera os pets salvos no navegador
    function carregarPets() {

        const dados = localStorage.getItem(chave);

        if (dados) {
            return JSON.parse(dados);
        }

        // Carrega os pets da tabela na primeira utilização
        const linhas = document.querySelectorAll(
            ".tabela-container tbody tr"
        );

        const lista = Array.from(linhas).map(function (linha) {

            const celulas = linha.querySelectorAll("td");
            const imagem = celulas[0].querySelector("img");

            return {
                foto: imagem.getAttribute("src"),
                nome: celulas[1].textContent.trim(),
                tipo: celulas[2].textContent.trim(),
                raca: celulas[3].textContent.trim(),
                tamanho: celulas[4].textContent.trim(),
                proprietario: celulas[5].textContent.trim()
            };
        });

        localStorage.setItem(chave, JSON.stringify(lista));

        return lista;
    }

    // Salva os pets
    function salvarPets(lista) {
        localStorage.setItem(chave, JSON.stringify(lista));
    }

    let pets = carregarPets();

    // Exibe os pets na tabela
    function mostrarPets() {

        const corpo = document.querySelector(
            ".tabela-container tbody"
        );

        if (!corpo) return;

        corpo.innerHTML = "";

        pets.forEach(function (pet, indice) {

            const linha = document.createElement("tr");

            // Foto
            const celulaFoto = document.createElement("td");

            const foto = document.createElement("img");
            foto.className = "foto-tabela-pet";
            foto.src = pet.foto;
            foto.alt = pet.nome;

            celulaFoto.appendChild(foto);
            linha.appendChild(celulaFoto);

            // Informações
            [
                pet.nome,
                pet.tipo,
                pet.raca,
                pet.tamanho,
                pet.proprietario
            ].forEach(function (valor) {

                const celula = document.createElement("td");
                celula.textContent = valor;

                linha.appendChild(celula);
            });

            // Ações
            const acoes = document.createElement("td");

            const visualizar = document.createElement("a");
            visualizar.href = "visualizar-pet.html?id=" + indice;
            visualizar.textContent = "Visualizar";

            const editar = document.createElement("a");
            editar.href = "editar-pet.html?id=" + indice;
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

    // Edição dos pets
    const formulario = document.querySelector(
        ".formulario-pet form"
    );

    if (formulario) {

        const parametros = new URLSearchParams(
            window.location.search
        );

        const indice = Number(parametros.get("id"));

        // Verifica se o pet existe
        if (
            !parametros.has("id") ||
            !Number.isInteger(indice) ||
            indice < 0 ||
            !pets[indice]
        ) {
            alert("Pet não encontrado.");
            window.location.href = "pets.html";
            return;
        }

        // Recupera somente o pet selecionado
        const pet = pets[indice];

        // Preenche os campos
        document.getElementById("nome").value = pet.nome;
        document.getElementById("tipo").value = pet.tipo;
        document.getElementById("raca").value = pet.raca;
        document.getElementById("tamanho").value = pet.tamanho;
        document.getElementById("proprietario").value =
            pet.proprietario;

        // Atualiza a foto do pet
        const fotoAtual = document.getElementById("fotoAtual");

        if (fotoAtual && pet.foto) {
            fotoAtual.src = new URL(
                pet.foto,
                window.location.href
            ).href;

            fotoAtual.alt = pet.nome;
        }

        // Atualiza a descrição da foto
        const descricaoFoto = document.getElementById(
            "descricaoFoto"
        );

        if (descricaoFoto) {
            descricaoFoto.textContent =
                pet.nome + " - " + pet.raca;
        }

        // Salva as alterações
        formulario.addEventListener("submit", function (evento) {

            evento.preventDefault();

            pet.nome = document.getElementById("nome").value;
            pet.tipo = document.getElementById("tipo").value;
            pet.raca = document.getElementById("raca").value;
            pet.tamanho = document.getElementById("tamanho").value;
            pet.proprietario =
                document.getElementById("proprietario").value;

            const novaFoto = document.getElementById("foto").value.trim();

            if (novaFoto !== "") {
                pet.foto = novaFoto;
            }

            pets[indice] = pet;

            salvarPets(pets);

            alert("Alterações salvas com sucesso!");

            window.location.href = "pets.html";
        });
    }

    // Exclusão dos pets
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

                if (confirm("Deseja excluir este pet?")) {

                    pets.splice(indice, 1);

                    salvarPets(pets);

                    mostrarPets();

                    alert("Pet excluído com sucesso!");
                }
            }
        });

        mostrarPets();
    }

});
