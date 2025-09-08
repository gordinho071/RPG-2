const playerStats = {
    level: 1,
    hp: 100,
    maxHp: 100,
    mana: 20,
    maxMana: 20,
    gold: 0,
    xp: 0,
    weapon: null,
    buffs: {},
    inventory: {
        "poção de cura": 3,
        "elixir de força": 0
    },
    playerClass: null
};

const CLASSES = {
    "guerreiro": {
        bonus_hp: 30,
        dano_extra: 5,
        mana_max: 20,
        habilidade: {
            nome: "Golpe Poderoso",
            custo: 10,
            efeito: "dobro_dano_proximo_ataque"
        },
    },
    "arqueiro": {
        bonus_hp: 0,
        dano_extra: 0,
        mana_max: 30,
        habilidade: {
            nome: "Tiro Preciso",
            custo: 15,
            efeito: "garante_critico_proximo_ataque"
        },
        critico_chance: 0.3,
        critico_dano: 2,
    }
};

const WEAPONS = {
    "espada de madeira": {
        dano_min: 5,
        dano_max: 10,
        valor: 10,
    },
    "espada de aço": {
        dano_min: 15,
        dano_max: 25,
        valor: 100,
    },
    "arco curto": {
        dano_min: 5,
        dano_max: 15,
        valor: 10,
    },
    "arco longo": {
        dano_min: 10,
        dano_max: 30,
        valor: 100,
    }
};

const ENEMIES = {
    "goblin": {
        hp: 50,
        dano_min: 5,
        dano_max: 15,
        xp_drop: 20,
        gold_drop_min: 5,
        gold_drop_max: 15,
        loot_chance: {"poção de cura": 0.3, "elixir de força": 0.1}
    },
    "orc": {
        hp: 80,
        dano_min: 10,
        dano_max: 25,
        xp_drop: 50,
        gold_drop_min: 10,
        gold_drop_max: 25,
        loot_chance: {"poção de cura": 0.4, "elixir de força": 0.2, "espada de aço": 0.05}
    },
    "troll": {
        hp: 120,
        dano_min: 15,
        dano_max: 35,
        xp_drop: 80,
        gold_drop_min: 20,
        gold_drop_max: 40,
        loot_chance: {"poção de cura": 0.5, "elixir de força": 0.3, "arco longo": 0.05}
    },
    "dragão": {
        hp: 300,
        dano_min: 30,
        dano_max: 60,
        xp_drop: 200,
        gold_drop_min: 100,
        gold_drop_max: 200,
        loot_chance: {"poção de cura": 1.0, "elixir de força": 0.5, "espada de aço": 0.2, "arco longo": 0.2}
    }
};

let currentEnemy = null;

const playerLevelEl = document.getElementById('player-level');
const playerHpEl = document.getElementById('player-hp');
const playerMaxHpEl = document.getElementById('player-max-hp');
const playerManaEl = document.getElementById('player-mana');
const playerMaxManaEl = document.getElementById('player-max-mana');
const playerGoldEl = document.getElementById('player-gold');
const gameTextEl = document.getElementById('game-text');
const optionsContainer = document.querySelector('.options-container');

function updateUI() {
    playerLevelEl.textContent = playerStats.level;
    playerHpEl.textContent = playerStats.hp;
    playerMaxHpEl.textContent = playerStats.maxHp;
    playerManaEl.textContent = playerStats.mana;
    playerMaxManaEl.textContent = playerStats.maxMana;
    playerGoldEl.textContent = playerStats.gold;
}

function renderButtons(options) {
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'action-button';
        button.textContent = option.text;
        button.onclick = option.action;
        optionsContainer.appendChild(button);
    });
}

function showMessage(message) {
    gameTextEl.textContent = message;
}

// --- Funções de Lógica do Jogo (Adaptadas de Python para JavaScript) ---
function chooseClass
