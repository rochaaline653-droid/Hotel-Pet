document.addEventListener("DOMContentLoaded", function () {

    const chave = "hotelPetConfiguracoes";

    const campoValorDiaria = document.getElementById("valor-diaria");
    const campoVagas = document.getElementById("vagas");
    const botaoSalvar = document.getElementById("salvar-configuracoes");

    const resumoDiaria = document.getElementById("resumo-diaria");
    const resumoVagas = document.getElementById("resumo-vagas");

    // Valores padrão do Hotel Pet
    const configuracoesPadrao = {
        valorDiaria: 50,
        vagasDisponiveis: 10
    };

    function formatarMoeda(valor) {
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    // Carrega as configurações salvas
    function carregarConfiguracoes() {

        let configuracoes;

        try {
            configuracoes = JSON.parse(localStorage.getItem(chave));
        } catch (erro) {
            configuracoes = null;
        }

        if (!configuracoes) {
            configuracoes = configuracoesPadrao;
        }

        campoValorDiaria.value = configuracoes.valorDiaria;
        campoVagas.value = configuracoes.vagasDisponiveis;

        atualizarResumo();
    }

    // Atualiza os valores apresentados no resumo
    function atualizarResumo() {

        const valor = Number(campoValorDiaria.value) || 0;
        const vagas = Number(campoVagas.value) || 0;

        resumoDiaria.textContent = formatarMoeda(valor);
        resumoVagas.textContent = vagas;
    }

    // Salva as configurações
    botaoSalvar.addEventListener("click", function () {

        const valorDiaria = Number(campoValorDiaria.value);
        const vagasDisponiveis = Number(campoVagas.value);

        if (
            campoValorDiaria.value === "" ||
            campoVagas.value === "" ||
            !Number.isFinite(valorDiaria) ||
            !Number.isInteger(vagasDisponiveis) ||
            valorDiaria <= 0 ||
            vagasDisponiveis < 0
        ) {
            alert("Informe um valor de diária maior que zero e uma quantidade válida de vagas.");
            return;
        }

        const configuracoes = {
            valorDiaria: valorDiaria,
            vagasDisponiveis: vagasDisponiveis
        };

        localStorage.setItem(chave, JSON.stringify(configuracoes));

        atualizarResumo();

        alert("Configurações salvas com sucesso!");
    });

    // Atualiza o resumo enquanto os campos são alterados
    campoValorDiaria.addEventListener("input", atualizarResumo);
    campoVagas.addEventListener("input", atualizarResumo);

    carregarConfiguracoes();

});