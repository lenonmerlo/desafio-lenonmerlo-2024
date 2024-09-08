class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        this.animais = {
            LEAO: { tamanho: 3, bioma: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, bioma: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, bioma: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, bioma: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false },
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animais[animal]) {
            return { erro: 'Animal inválido' };
        }

        if (quantidade <= 0) {
            return { erro: 'Quantidade inválida' };
        }

        const infoAnimal = this.animais[animal];
        const recintosViaveis = [];

        for (const recinto of this.recintos) {
            // Verifica se o bioma é compatível
            if (!infoAnimal.bioma.includes(recinto.bioma)) {
                continue;
            }

            // Calcula o espaço ocupado no recinto
            let espacoOcupado = recinto.animais.reduce((acc, a) => acc + a.quantidade * this.animais[a.especie].tamanho, 0);

            // Verifica se o animal carnivoro está com outra espécie
            const haOutraEspecie = recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== animal);
            if (infoAnimal.carnivoro && haOutraEspecie) {
                continue;  // Carnívoros não podem compartilhar o recinto com outras espécies
            }

            // Se houver mais de uma espécie no recinto, adicionar um espaço extra
            if (recinto.animais.length > 0 && !infoAnimal.carnivoro) {
                espacoOcupado += 1;  // Considera o espaço extra para convivência
            }

            // Calcula o espaço restante no recinto
            const espacoRestante = recinto.tamanho - espacoOcupado;

            // Verifica se há espaço suficiente
            if (espacoRestante >= infoAnimal.tamanho * quantidade) {
                // Ajuste para permitir dois macacos juntos no recinto
                if (animal === 'MACACO' && recinto.animais.length === 0 && quantidade === 1) {
                    continue;  // Macacos não gostam de ficar sozinhos
                }
                // Verifica a regra dos hipopótamos
                if (animal === 'HIPOPOTAMO' && recinto.animais.length > 0 && recinto.bioma !== 'savana e rio') {
                    continue;  // Hipopótamos só convivem com outras espécies em biomas de savana e rio
                }
                
                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoRestante: espacoRestante - infoAnimal.tamanho * quantidade,
                    total: recinto.tamanho
                });
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }

        // Ordena os recintos pelo número do recinto
        recintosViaveis.sort((a, b) => a.numero - b.numero);

        const recintosFormatados = recintosViaveis.map(r =>
            `Recinto ${r.numero} (espaço livre: ${r.espacoRestante} total: ${r.total})`
        );

        return { recintosViaveis: recintosFormatados };
    }
}

export { RecintosZoo as RecintosZoo};
