
document.addEventListener("DOMContentLoaded", function () {

    const chave = "hotelPetUsuarios";

    // Recuperar os usuários salvos
    function carregarUsuarios() {
        const dados = localStorage.getItem(chave);

        if (dados) {
            return JSON.parse(dados);
        }

        // Na primeira utilização, buscar os dados do HTML
        const linhas = document.querySelectorAll(
            ".tabela-container tbody tr"
        );

        return Array.from(linhas).map(function (linha) {
            const celulas = linha.querySelectorAll("td");

            return {
                nome: celulas[0].textContent.trim(),
                email: celulas[1].textContent.trim(),
                telefone: celulas[2].textContent.trim(),
                funcao: celulas[3].textContent.trim(),
                status: celulas[4].textContent.trim()
            };
        });
    }

    // Salvar usuários no navegador
    function salvarUsuarios(usuarios) {
        localStorage.setItem(chave, JSON.stringify(usuarios));
    }

    let usuarios = carregarUsuarios();

    // Exibir usuários na tabela
    function mostrarUsuarios() {

        const corpo = document.querySelector(
            ".tabela-container tbody"
        );

        if (!corpo) return;

        corpo.innerHTML = "";

        usuarios.forEach(function (usuario, indice) {

            const linha = document.createElement("tr");

            [
                usuario.nome,
                usuario.email,
                usuario.telefone,
                usuario.funcao,
                usuario.status
            ].forEach(function (valor) {

                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);

            });

            const acoes = document.createElement("td");

            const visualizar = document.createElement("a");
            visualizar.href = "visualizar-usuario.html?id=" + indice;
            visualizar.textContent = "Visualizar";

            const editar = document.createElement("a");
            editar.href = "editar-usuario.html?id=" + indice;
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

    // Identificar o formulário de edição
    const formulario = document.querySelector(
        ".formulario-centralizado form"
    );

    if (formulario) {

        const parametros = new URLSearchParams(
            window.location.search
        );

        const indice = Number(parametros.get("id"));

        if (!parametros.has("id") || !usuarios[indice]) {
            alert("Usuário não encontrado.");
            window.location.href = "usuarios.html";
            return;
        }

        const usuario = usuarios[indice];

        // Preencher os campos com os dados atuais
        document.getElementById("nome").value = usuario.nome;
        document.getElementById("email").value = usuario.email;
        document.getElementById("telefone").value = usuario.telefone;
        document.getElementById("funcao").value = usuario.funcao;
        document.getElementById("status").value = usuario.status;

        // Salvar as alterações
        formulario.addEventListener("submit", function (evento) {

            evento.preventDefault();

            usuario.nome = document.getElementById("nome").value;
            usuario.email = document.getElementById("email").value;
            usuario.telefone = document.getElementById("telefone").value;
            usuario.funcao = document.getElementById("funcao").value;
            usuario.status = document.getElementById("status").value;

            usuarios[indice] = usuario;

            salvarUsuarios(usuarios);

            alert("Usuário atualizado com sucesso!");

            window.location.href = "usuarios.html";

        });
    }

    // Excluir usuários
    const corpo = document.querySelector(
        ".tabela-container tbody"
    );

    if (corpo) {

        corpo.addEventListener("click", function (evento) {

            if (evento.target.classList.contains(
                "botao-excluir-tabela"
            )) {

                const indice = Number(
                    evento.target.dataset.indice
                );

                if (confirm("Deseja realmente excluir este usuário?")) {

                    usuarios.splice(indice, 1);

                    salvarUsuarios(usuarios);
                    mostrarUsuarios();

                    alert("Usuário excluído com sucesso!");

                }
            }
        });

        salvarUsuarios(usuarios);
        mostrarUsuarios();
    }

});
