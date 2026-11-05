
document.addEventListener("DOMContentLoaded", function () {

    const pets = JSON.parse(localStorage.getItem("hotelPetPets")) || [];

    const parametros = new URLSearchParams(window.location.search);
    const id = Number(parametros.get("id"));

    const pet = pets[id];

    if (!pet) {
        alert("Pet não encontrado!");
        window.location.href = "pets.html";
        return;
    }

    document.getElementById("nomePet").textContent = pet.nome;
    document.getElementById("tipoPet").textContent = pet.tipo;
    document.getElementById("racaPet").textContent = pet.raca;
    document.getElementById("tamanhoPet").textContent = pet.tamanho;
    document.getElementById("proprietarioPet").textContent = pet.proprietario;

    if (pet.foto) {
        document.getElementById("fotoPet").src = pet.foto;
    }

    document.getElementById("botaoEditar").href =
        "editar-pet.html?id=" + id;

});
