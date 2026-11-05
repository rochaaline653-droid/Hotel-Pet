
document.addEventListener("DOMContentLoaded", function () {

    // Busca os usuários cadastrados
    const usuarios = JSON.parse(
        localStorage.getItem("hotelPetUsuarios")
    ) || [];

    // Identifica o usuário selecionado
    const parametros = new URLSearchParams(
        window.location.search
    );

    const id = Number(parametros.get("id"));

    const usuario = usuarios[id];

    // Verifica se o usuário existe
    if (
        !parametros.has("id") ||
        !Number.isInteger(id) ||
        id < 0 ||
        !usuario
    ) {
        alert("Usuário não encontrado!");
        window.location.href = "usuarios.html";
        return;
    }

    // Exibe as informações
    document.getElementById("nomeUsuario").textContent =
        usuario.nome || "Não informado";

    document.getElementById("emailUsuario").textContent =
        usuario.email || "Não informado";

    document.getElementById("telefoneUsuario").textContent =
        usuario.telefone || "Não informado";

    document.getElementById("funcaoUsuario").textContent =
        usuario.funcao || "Não informado";

    document.getElementById("statusUsuario").textContent =
        usuario.status || "Não informado";

    // Cria as iniciais do usuário
    const nome = usuario.nome || "Usuário";

    const iniciais = nome
        .trim()
        .split(/\s+/)
        .map(function (parte) {
            return parte[0];
        })
        .slice(0, 2)
        .join("")
        .toUpperCase();

    document.getElementById("avatarUsuario").textContent =
        iniciais;

    // Atualiza o link de edição
    document.getElementById("botaoEditarUsuario").href =
        "editar-usuario.html?id=" + id;

});
