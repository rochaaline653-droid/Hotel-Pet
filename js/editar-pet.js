
document.addEventListener("DOMContentLoaded", function () {

    const chave = "hotelPetPets";
    const tabela = document.querySelector("table");

    // Na página de listagem, carregar os dados salvos
    if (tabela) {
        const linhas = tabela.querySelectorAll("tbody tr");

        let pets = JSON.parse(localStorage.getItem(chave));

        if (!pets) {
            pets = Array.from(linhas).map(function (linha) {
                const celulas = linha.querySelectorAll("td");

                return {
                    foto: celulas[0].querySelector("img").getAttribute("src"),
                    nome: celulas[1].textContent.trim(),
                    tipo: celulas[2].textContent.trim(),
                    raca: celulas[3].textContent.trim(),
                    tamanho: celulas[4].textContent.trim(),
                    proprietario: celulas[5].textContent.trim()
                };
            });

            localStorage.setItem(chave, JSON.stringify(pets));
        }

        linhas.forEach(function (linha, indice) {
            const pet = pets[indice];

            if (!pet) return;

            const celulas = linha.querySelectorAll("td");

            celulas[0].querySelector("img").src = pet.foto;
            celulas[0].querySelector("img").alt = pet.nome;
            celulas[1].textContent = pet.nome;
            celulas[2].textContent = pet.tipo;
            celulas[3].textContent = pet.raca;
            celulas[4].textContent = pet.tamanho;
            celulas[5].textContent = pet.proprietario;

            const linkEditar = celulas[6].querySelector('a[href="editar-pet.html"]');

            if (linkEditar) {
                linkEditar.href = "editar-pet.html?id=" + indice;
            }
        });
    }

    // Na página de edição, preencher e salvar o formulário
    const formulario = document.querySelector(".formulario-pet form");

    if (formulario) {
        const parametros = new URLSearchParams(window.location.search);
        const indice = Number(parametros.get("id"));

        const pets = JSON.parse(localStorage.getItem(chave)) || [];

        if (!parametros.has("id") || !pets[indice]) {
            alert("Pet não encontrado.");
            window.location.href = "pets.html";
            return;
        }

        const pet = pets[indice];

        document.getElementById("nome").value = pet.nome;
        document.getElementById("tipo").value = pet.tipo;
        document.getElementById("raca").value = pet.raca;
        document.getElementById("tamanho").value = pet.tamanho;
        document.getElementById("proprietario").value = pet.proprietario;

        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            pet.nome = document.getElementById("nome").value;
            pet.tipo = document.getElementById("tipo").value;
            pet.raca = document.getElementById("raca").value;
            pet.tamanho = document.getElementById("tamanho").value;
            pet.proprietario = document.getElementById("proprietario").value;

            const novaFoto = document.getElementById("foto").value.trim();

            if (novaFoto !== "") {
                pet.foto = novaFoto;
            }

            pets[indice] = pet;
            localStorage.setItem(chave, JSON.stringify(pets));

            alert("Dados do pet atualizados com sucesso!");
            window.location.href = "pets.html";
        });
    }

});
