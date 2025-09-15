// Estado do Jogo
let estadoDoJogo = {
    nivel: 1,
    hp: 100,
    maxHp: 100,
    mana: 20,
    maxMana: 20,
    ouro: 0,
    cenaAtual: 'inicio'
};

// Elementos HTML
const elementoTextoDoJogo = document.getElementById('game-text');
const containerOpcoes = document.querySelector('.options-container');

// Função para atualizar as estatísticas na tela
function atualizarExibicao() {
    document.getElementById('player-level').textContent = estadoDoJogo.nivel;
    document.getElementById('player-hp').textContent = estadoDoJogo.hp;
    document.getElementById('player-max-hp').textContent = estadoDoJogo.maxHp;
    document.getElementById('player-mana').textContent = estadoDoJogo.mana;
    document.getElementById('player-max-mana').textContent = estadoDoJogo.maxMana;
    document.getElementById('player-gold').textContent = estadoDoJogo.ouro;
}

// Função para lidar com as escolhas do jogador
function lidarComEscolha(escolha) {
    if (cenas[estadoDoJogo.cenaAtual] && cenas[estadoDoJogo.cenaAtual].opcoes[escolha]) {
        const proximaCenaId = cenas[estadoDoJogo.cenaAtual].opcoes[escolha].proximaCena;
        if (proximaCenaId) {
            estadoDoJogo.cenaAtual = proximaCenaId;
            mostrarCena(estadoDoJogo.cenaAtual);
        }
    }
}

// Função para exibir uma cena
function mostrarCena(idCena) {
    const cena = cenas[idCena];
    if (!cena) {
        elementoTextoDoJogo.textContent = "Erro: Cena não encontrada!";
        return;
    }

    // Define o texto da cena
    elementoTextoDoJogo.textContent = cena.texto;

    // Limpa as opções anteriores
    containerOpcoes.innerHTML = '';

    // Cria novos botões de opção
    for (const chaveOpcao in cena.opcoes) {
        const opcao = cena.opcoes[chaveOpcao];
        const botao = document.createElement('button');
        botao.className = 'action-button';
        botao.textContent = opcao.texto;
        botao.onclick = () => lidarComEscolha(chaveOpcao);
        containerOpcoes.appendChild(botao);
    }

    atualizarExibicao();
}

// Definição das cenas do jogo
const cenas = {
    inicio: {
        texto: "Você acorda em uma floresta escura. O ar está úmido e um silêncio estranho te cerca. O que você faz?",
        opcoes: {
            explorar: {
                texto: "Explorar o caminho para o leste.",
                proximaCena: "caminhoNaFloresta"
            },
            descansar: {
                texto: "Descansar onde você está.",
                proximaCena: "descanso"
            }
        }
    },
    caminhoNaFloresta: {
        texto: "Você segue o caminho sinuoso. Depois de um tempo, encontra uma pequena cabana abandonada. A porta está entreaberta.",
        opcoes: {
            entrarNaCabana: {
                texto: "Entrar na cabana.",
                proximaCena: "cabana"
            },
            continuar: {
                texto: "Ignorar a cabana e continuar pelo caminho.",
                proximaCena: "clareira"
            }
        }
    },
    descanso: {
        texto: "Você descansa por um tempo, recuperando um pouco de sua força. Sua mente parece mais clara agora.",
        opcoes: {
            continuar: {
                texto: "Continuar sua jornada.",
                proximaCena: "caminhoNaFloresta"
            }
        }
    },
    cabana: {
        texto: "Dentro da cabana, você encontra uma pequena sacola de ouro em uma mesa empoeirada.",
        opcoes: {
            pegarOuro: {
                texto: "Pegar o ouro.",
                proximaCena: "pegarOuro"
            }
        }
    },
    pegarOuro: {
        texto: "Você pega o ouro e se sente um pouco mais rico. O que fazer agora?",
        opcoes: {
            sairDaCabana: {
                texto: "Sair da cabana.",
                proximaCena: "clareira"
            }
        },
        aoEntrar: () => {
            estadoDoJogo.ouro += 50;
        }
    },
    clareira: {
        texto: "Você chega a uma pequena clareira iluminada pelo sol. O caminho continua do outro lado.",
        opcoes: {
            continuar: {
                texto: "Continuar pelo caminho.",
                proximaCena: "inicio" // Volta ao início para um exemplo simples
            }
        }
    }
};

// Configuração inicial
document.addEventListener('DOMContentLoaded', () => {
    atualizarExibicao();
    mostrarCena(estadoDoJogo.cenaAtual);
});

// A Linha a seguir foi adicionada para iniciar o jogo imediatamente
mostrarCena('inicio');