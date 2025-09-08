import random
import time

# --- Constantes do Jogo ---
XP_TO_LEVEL_UP = {
    2: 100,
    3: 250,
    4: 500,
    5: 800,
}

# Dicionário de classes
CLASSES = {
    "guerreiro": {
        "bonus_hp": 30,
        "dano_extra": 5,
        "mana_max": 20,
        "habilidade": {
            "nome": "Golpe Poderoso",
            "custo": 10,
            "descricao": "Causa o dobro do dano do seu próximo ataque.",
            "efeito": "aumenta_dano_proximo_ataque"
        },
        "descricao": "Um mestre do combate corpo a corpo, com mais vida e dano."
    },
    "arqueiro": {
        "bonus_hp": 0,
        "dano_extra": 0,
        "mana_max": 30,
        "habilidade": {
            "nome": "Tiro Preciso",
            "custo": 15,
            "descricao": "Garante um acerto crítico no próximo ataque.",
            "efeito": "garante_critico_proximo_ataque"
        },
        "critico_chance": 0.3,
        "critico_dano": 2,
        "descricao": "Ágil e preciso, capaz de causar dano crítico massivo."
    }
}

# Dicionário de armas
WEAPONS = {
    "espada de madeira": {
        "dano_min": 5,
        "dano_max": 10,
        "valor": 10,
        "descricao": "Uma espada simples."
    },
    "espada de aço": {
        "dano_min": 15,
        "dano_max": 25,
        "valor": 100,
        "descricao": "Uma espada afiada."
    },
    "arco curto": {
        "dano_min": 5,
        "dano_max": 15,
        "valor": 10,
        "descricao": "Um arco simples."
    },
    "arco longo": {
        "dano_min": 10,
        "dano_max": 30,
        "valor": 100,
        "descricao": "Um arco poderoso."
    }
}

# Dicionário de inimigos
ENEMIES = {
    "goblin": {
        "hp": 50,
        "dano_min": 5,
        "dano_max": 15,
        "xp_drop": 20,
        "gold_drop_min": 5,
        "gold_drop_max": 15,
        "loot_chance": {"poção de cura": 0.3, "elixir de força": 0.1}
    },
    "orc": {
        "hp": 80,
        "dano_min": 10,
        "dano_max": 25,
        "xp_drop": 50,
        "gold_drop_min": 10,
        "gold_drop_max": 25,
        "loot_chance": {"poção de cura": 0.4, "elixir de força": 0.2, "espada de aço": 0.05}
    },
    "troll": {
        "hp": 120,
        "dano_min": 15,
        "dano_max": 35,
        "xp_drop": 80,
        "gold_drop_min": 20,
        "gold_drop_max": 40,
        "loot_chance": {"poção de cura": 0.5, "elixir de força": 0.3, "arco longo": 0.05}
    }
}

# Itens da loja
SHOP_ITEMS = {
    "poção de cura": {"valor": 20},
    "elixir de força": {"valor": 50},
    "espada de aço": {"valor": 100},
    "arco longo": {"valor": 100}
}

# --- Variáveis do Jogador ---
player_class = None
player_max_hp = 0
player_hp = 0
player_xp = 0
player_level = 1
player_gold = 0
player_weapon = None
player_buffs = {}
player_mana = 0
player_max_mana = 0

inventory = {
    "poção de cura": 3,
    "elixir de força": 0
}

# --- Funções do Jogo ---

def check_level_up():
    """Verifica se o jogador tem XP suficiente para subir de nível."""
    global player_xp, player_level, player_hp, player_max_hp, player_max_mana, player_mana
    
    xp_needed = XP_TO_LEVEL_UP.get(player_level + 1)
    
    if xp_needed and player_xp >= xp_needed:
        player_level += 1
        print(f"\n--- Parabéns! Você subiu para o nível {player_level}! ---")
        
        player_max_hp += 20
        player_hp = player_max_hp
        
        player_weapon["dano_max"] += 5
        player_max_mana += 10
        player_mana = player_max_mana
        
        print(f"Sua vida máxima aumentou para {player_max_hp}, seu dano máximo para {player_weapon['dano_max']} e sua mana para {player_max_mana}!")
        time.sleep(1)

def player_turn(enemy_hp, enemy_type):
    """Gerencia as ações do jogador durante a batalha."""
    global player_hp, player_mana
    
    habilidade_nome = player_class["habilidade"]["nome"]
    action = input(f"\nO que você quer fazer? [A] Atacar | [P] Poção | [E] Elixir | [H] {habilidade_nome} | [F] Fugir: ").lower()

    if action == "a":
        bonus_dano = player_buffs.get("força", 0) * 5
        base_damage = random.randint(player_weapon["dano_min"], player_weapon["dano_max"])
        final_damage = base_damage + player_class["dano_extra"] + bonus_dano

        is_critical = False
        if player_buffs.get("garante_critico", False) or (player_class.get("critico_chance") and random.random() < player_class["critico_chance"]):
            final_damage *= player_class.get("critico_dano", 2) # Usa 2 como padrão
            is_critical = True

        enemy_hp -= final_damage
        
        message = f"Você ataca o {enemy_type} com sua {player_weapon['descricao'].split()[1]} e causa {int(final_damage)} de dano!"
        if is_critical:
            message = "Acerto crítico! " + message
        print(message)
        
        if "força" in player_buffs:
            player_buffs["força"] -= 1
            if player_buffs["força"] <= 0:
                del player_buffs["força"]
                print("O efeito do Elixir de Força se esgotou.")
        
        if "garante_critico" in player_buffs:
            del player_buffs["garante_critico"]
            
    elif action == "p":
        if inventory["poção de cura"] > 0:
            heal_amount = 30
            player_hp += heal_amount
            inventory["poção de cura"] -= 1
            if player_hp > player_max_hp:
                player_hp = player_max_hp
            print(f"Você usa uma poção e recupera {heal_amount} de vida. Você tem {inventory['poção de cura']} poções restantes.")
        else:
            print("Você não tem mais poções de cura!")
    
    elif action == "e":
        if inventory["elixir de força"] > 0:
            inventory["elixir de força"] -= 1
            player_buffs["força"] = 3
            print("Você bebe o Elixir de Força! Seu próximo ataque será mais forte.")
        else:
            print("Você não tem Elixires de Força!")

    elif action == "h":
        habilidade = player_class["habilidade"]
        if player_mana >= habilidade["custo"]:
            player_mana -= habilidade["custo"]
            print(f"Você usa {habilidade['nome']}!")
            if habilidade["efeito"] == "aumenta_dano_proximo_ataque":
                player_buffs["força"] = 1 # Buff de força para o próximo ataque
            elif habilidade["efeito"] == "garante_critico_proximo_ataque":
                player_buffs["garante_critico"] = True
        else:
            print("Mana insuficiente!")

    elif action == "f":
        print("Você tenta fugir...")
        time.sleep(1)
        if random.random() > 0.5:
            print("Você conseguiu fugir da batalha!")
            return "flee"
        else:
            print("A fuga falhou! O inimigo te impede de sair.")
    
    else:
        print("Ação inválida. Escolha 'A', 'P', 'E', 'H' ou 'F'.")
    
    return enemy_hp

def enemy_turn(enemy_stats):
    """Gerencia o ataque do inimigo."""
    global player_hp
    
    enemy_damage = random.randint(enemy_stats["dano_min"], enemy_stats["dano_max"])
    player_hp -= enemy_damage
    print(f"O inimigo contra-ataca e te causa {enemy_damage} de dano.")

def battle(enemy_type):
    """Loop principal de batalha."""
    global player_hp, player_xp, player_gold, player_weapon
    
    enemy_stats = ENEMIES[enemy_type]
    current_enemy_hp = enemy_stats["hp"]
    
    print(f"\n--- Um {enemy_type} aparece! ---")
    time.sleep(1)

    while player_hp > 0 and current_enemy_hp > 0:
        elixir_info = f" | Elixir: {inventory['elixir de força']}" if inventory["elixir de força"] > 0 else ""
        print(f"\nNível: {player_level} | Vida: {player_hp}/{player_max_hp} | Mana: {player_mana}/{player_max_mana} | Ouro: {player_gold} | Vida do {enemy_type}: {current_enemy_hp}")
        
        result = player_turn(current_enemy_hp, enemy_type)
        if result == "flee":
            return
        
        current_enemy_hp = result
        
        if current_enemy_hp <= 0:
            print(f"\n--- Você derrotou o {enemy_type}! ---")
            xp_ganha = enemy_stats["xp_drop"]
            player_xp += xp_ganha
            print(f"Você ganhou {xp_ganha} pontos de experiência. Total: {player_xp}")
            
            gold_ganho = random.randint(enemy_stats["gold_drop_min"], enemy_stats["gold_drop_max"])
            player_gold += gold_ganho
            print(f"Você encontrou {gold_ganho} moedas de ouro. Total: {player_gold}")

            check_level_up()
            
            for item, chance in enemy_stats["loot_chance"].items():
                if random.random() <= chance:
                    if item in WEAPONS:
                        print(f"Você encontrou a arma '{item.capitalize()}'!")
                        while True:
                            equipar = input(f"Você quer equipar o(a) {item}? (dano {WEAPONS[item]['dano_min']}-{WEAPONS[item]['dano_max']}) [S/N]: ").lower()
                            if equipar == 's':
                                player_weapon = WEAPONS[item]
                                print(f"Você equipou {item.capitalize()}!")
                                break
                            elif equipar == 'n':
                                print(f"Você continua com seu(sua) {player_weapon['descricao'].split()[1]}.")
                                break
                            else:
                                print("Resposta inválida.")
                    else:
                        inventory[item] += 1
                        print(f"Você vasculha o corpo do inimigo e encontra um(a) {item.capitalize()}!")
            break

        time.sleep(1)
        
        enemy_turn(enemy_stats)
        time.sleep(1)

    if player_hp <= 0:
        print("\n--- Você morreu... Fim de jogo. ---")
        return "game_over"

def visit_shop():
    """Permite ao jogador visitar a loja."""
    global player_gold, player_weapon

    print("\n--- Bem-vindo à Loja! ---")
    time.sleep(1)
    
    while True:
        print(f"\nSeu Ouro: {player_gold}")
        print("Itens disponíveis:")
        
        for item, stats in SHOP_ITEMS.items():
            print(f"[{item.capitalize()}] - Custo: {stats['valor']} ouro")
            if item in WEAPONS:
                print(f"  - Dano: {WEAPONS[item]['dano_min']}-{WEAPONS[item]['dano_max']}")
        
        print("\n[V] Voltar | Digite o nome do item para comprar.")
        
        choice = input("Sua escolha: ").lower()
        
        if choice == "v":
            print("Até logo!")
            break
        elif choice in SHOP_ITEMS:
            item_cost = SHOP_ITEMS[choice]["valor"]
            if player_gold >= item_cost:
                player_gold -= item_cost
                print(f"Você comprou {choice.capitalize()} por {item_cost} ouro.")
                
                if choice in WEAPONS:
                    player_weapon = WEAPONS[choice]
                    print(f"Você equipou {choice.capitalize()}!")
                else:
                    inventory[choice] += 1
                
            else:
                print("Você não tem ouro suficiente para comprar este item.")
        else:
            print("Escolha inválida.")

def rest():
    """Permite ao jogador descansar para recuperar vida e mana."""
    global player_hp, player_mana, player_max_hp, player_max_mana

    print("\nVocê decide descansar em um lugar seguro.")
    time.sleep(1)
    
    # Recupera vida e mana
    player_hp = player_max_hp
    player_mana = player_max_mana
    print("Sua vida e mana foram totalmente restauradas.")
    
    # Adiciona um custo ao descanso, com chance de encontro
    print("Você se sente revigorado, mas perdeu tempo e um novo inimigo pode ter te encontrado!")
    time.sleep(2)
    
    # Chance de encontrar um inimigo após o descanso
    if random.random() > 0.3:
        available_enemies = ["goblin"]
        if player_level >= 2:
            available_enemies.append("orc")
        if player_level >= 3:
            available_enemies.append("troll")
        
        chosen_enemy = random.choice(available_enemies)
        return battle(chosen_enemy)
    
    return None

def choose_class():
    """Permite ao jogador escolher a classe inicial."""
    global player_class, player_max_hp, player_hp, player_mana, player_max_mana
    
    print("Escolha sua classe:")
    for cls, stats in CLASSES.items():
        print(f"[{cls.capitalize()}] - {stats['descricao']}")
        time.sleep(0.5)
        
    while True:
        choice = input("Digite o nome da sua classe: ").lower()
        if choice in CLASSES:
            player_class = CLASSES[choice]
            player_max_hp = 100 + player_class["bonus_hp"]
            player_hp = player_max_hp
            player_max_mana = player_class["mana_max"]
            player_mana = player_max_mana
            print(f"\nVocê escolheu a classe {choice}!")
            time.sleep(1)
            break
        else:
            print("Escolha inválida. Por favor, digite 'guerreiro' ou 'arqueiro'.")

def choose_weapon():
    """Permite ao jogador escolher a arma inicial."""
    global player_weapon
    
    print("Você encontrou uma Espada de Madeira e um Arco Curto. Qual arma você quer levar?")
    start_weapons = {name: data for name, data in WEAPONS.items() if data["valor"] == 10}
    for weapon, stats in start_weapons.items():
        print(f"[{weapon.capitalize()}] - Dano: {stats['dano_min']}-{stats['dano_max']} | {stats['descricao']}")
        time.sleep(0.5)
        
    while True:
        choice = input("Digite o nome da sua escolha: ").lower()
        if choice in start_weapons:
            player_weapon = WEAPONS[choice]
            print(f"\nVocê escolheu o {choice}!")
            time.sleep(1)
            break
        else:
            print("Escolha inválida.")

# --- Início do Jogo ---
if __name__ == "__main__":
    print("Bem-vindo à aventura de texto!")
    time.sleep(1)
    
    choose_class()
    choose_weapon()

    while True:
        print("\n--- O que você quer fazer? ---")
        action = input("[A] Aventure-se | [L] Visitar Loja | [D] Descansar | [S] Sair: ").lower()
        
        if action == "a":
            available_enemies = ["goblin"]
            if player_level >= 2:
                available_enemies.append("orc")
            if player_level >= 3:
                available_enemies.append("troll")

            chosen_enemy = random.choice(available_enemies)
            game_status = battle(chosen_enemy)
            
            if game_status == "game_over":
                break

        elif action == "l":
            visit_shop()
        
        elif action == "d":
            game_status = rest()
            if game_status == "game_over":
                break
        
        elif action == "s":
            print("Obrigado por jogar! Fim da aventura.")
            break
        
        else:
            print("Opção inválida.")
