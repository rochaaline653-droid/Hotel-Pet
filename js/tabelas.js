document.addEventListener("DOMContentLoaded", function () {

    const tabela = document.querySelector("table");

    if (!tabela) {
        return;
    }

    const linhas = tabela.querySelectorAll("tbody tr");

    linhas.forEach(function (linha) {

        const celulas = linha.querySelectorAll("td");
        const ultimaCelula = celulas[celulas.length - 1];

        if (!ultimaCelula) {
            return;
        }

        // Botão para excluir o registro
        const botaoExcluir = document.createElement("button");

        botaoExcluir.textContent = "Excluir";
        botaoExcluir.classList.add("botao-excluir-tabela");

        botaoExcluir.addEventListener("click", function () {

            const confirmar = confirm(
                "Tem certeza de que deseja excluir este registro?"
            );

            if (confirmar) {
                linha.remove();
                alert("Registro excluído com sucesso!");
            }

        });

        ultimaCelula.appendChild(botaoExcluir);

    });

});

