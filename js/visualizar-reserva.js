
document.addEventListener("DOMContentLoaded", function () {

    const reservas = JSON.parse(
        localStorage.getItem("hotelPetReservas")
    ) || [];

    const parametros = new URLSearchParams(window.location.search);
    const id = Number(parametros.get("id"));

    const reserva = reservas[id];

    if (!reserva) {
        alert("Reserva não encontrada!");
        window.location.href = "reservas.html";
        return;
    }

    function formatarData(data) {
        if (!data) return "Não informada";

        const partes = data.split("-");

        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        return data;
    }

    function calcularDiarias(entrada, saida) {
        if (!entrada || !saida) return 0;

        const dataEntrada = new Date(entrada + "T00:00:00");
        const dataSaida = new Date(saida + "T00:00:00");

        const diferenca = dataSaida - dataEntrada;

        return Math.max(0, Math.round(
            diferenca / (1000 * 60 * 60 * 24)
        ));
    }

    const diarias = calcularDiarias(
        reserva.entrada,
        reserva.saida
    );

    const valorDiaria = 50;
    const valorTotal = diarias * valorDiaria;

    document.getElementById("tituloReserva").textContent =
        "Reserva - " + (reserva.pet || "Pet");

    document.getElementById("numeroReserva").textContent =
        "Reserva nº " + String(id + 1).padStart(3, "0");

    document.getElementById("petReserva").textContent =
        reserva.pet || "Não informado";

    document.getElementById("proprietarioReserva").textContent =
        reserva.proprietario || "Não informado";

    document.getElementById("entradaReserva").textContent =
        formatarData(reserva.entrada);

    document.getElementById("saidaReserva").textContent =
        formatarData(reserva.saida);

    document.getElementById("diariasReserva").textContent =
        diarias;

    document.getElementById("valorReserva").textContent =
        valorTotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    document.getElementById("anotacoesReserva").textContent =
        reserva.anotacoes || "Nenhuma informação cadastrada.";

    const status = document.getElementById("statusReserva");

    status.textContent = reserva.status || "Reservada";

    status.className = "status";

    const statusNormalizado = (reserva.status || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (statusNormalizado.includes("finalizada")) {
        status.classList.add("finalizado");
    } else if (statusNormalizado.includes("hospedada")) {
        status.classList.add("hospedado");
    } else {
        status.classList.add("reservado");
    }

    const botaoEditar = document.getElementById(
        "botaoEditarReserva"
    );

    if (statusNormalizado.includes("finalizada")) {
        botaoEditar.href = "editar-reserva-finalizada.html?id=" + id;
    } else {
        botaoEditar.href = "editar-reserva.html?id=" + id;
    }

});
