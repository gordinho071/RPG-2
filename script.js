import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Scanner;

class Player {
    int level;
    int hp, maxHp;
    int mana, maxMana;
    int gold;
    int xp;
    String weapon;
    Map<String, Integer> inventory = new HashMap<>();
    String playerClass;
    
    Player() {
        this.level = 1;
        this.hp = 100;
        this.maxHp = 100;
        this.mana = 20;
        this.maxMana = 20;
        this.gold = 0;
        this.xp = 0;
        this.weapon = null;
        inventory.put("poção de cura", 3);
    }
    
    void chooseClass(String className) {
        switch (className.toLowerCase()) {
            case "guerreiro":
                this.playerClass = "guerreiro";
                this.hp += 30;
                this.maxHp += 30;
                this.mana = 20;
                this.maxMana = 20;
                this.weapon = "espada de madeira";
                System.out.println("Você escolheu a classe Guerreiro!");
                break;
            case "arqueiro":
                this.playerClass = "arqueiro";
                this.hp += 0;
                this.maxHp += 0;
                this.mana = 30;
                this.maxMana = 30;
                this.weapon = "arco curto";
                System.out.println("Você escolheu a classe Arqueiro!");
                break;
            default:
                System.out.println("Classe inválida.");
                return;
        }
    }
}

class Enemy {
    String name;
    int hp;
    int danoMin;
    int danoMax;
    int xpDrop;
    int goldDropMin;
    int goldDropMax;
    
    Enemy(String name, int hp, int danoMin, int danoMax, int xpDrop, int goldDropMin, int goldDropMax) {
        this.name = name;
        this.hp = hp;
        this.danoMin = danoMin;
        this.danoMax = danoMax;
        this.xpDrop = xpDrop;
        this.goldDropMin = goldDropMin;
        this.goldDropMax = goldDropMax;
    }
    
    int attack() {
        Random rand = new Random();
        return rand.nextInt(danoMax - danoMin + 1) + danoMin;
    }
}

public class Game {
    static Player player = new Player();
    static Enemy currentEnemy;
    static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("Bem-vindo ao jogo de aventura!");
        System.out.print("Escolha sua classe (guerreiro ou arqueiro): ");
        String classChoice = scanner.nextLine();
        player.chooseClass(classChoice);
        
        startAdventure();
    }
    
    public static void startAdventure() {
        // Iniciar uma aventura com inimigos aleatórios
        String[] enemies = {"goblin", "orc", "troll", "dragão"};
        Random rand = new Random();
        int enemyChoice = rand.nextInt(enemies.length);
        
        // Definindo o inimigo
        switch (enemies[enemyChoice]) {
            case "goblin":
                currentEnemy = new Enemy("Goblin", 50, 5, 15, 20, 5, 15);
                break;
            case "orc":
                currentEnemy = new Enemy("Orc", 80, 10, 25, 50, 10, 25);
                break;
            case "troll":
                currentEnemy = new Enemy("Troll", 120, 15, 35, 80, 20, 40);
                break;
            case "dragão":
                currentEnemy = new Enemy("Dragão", 300, 30, 60, 200, 100, 200);
                break;
        }
        
        System.out.println("Você encontrou um(a) " + currentEnemy.name + "! Prepare-se para lutar.");
        combat();
    }
    
    public static void combat() {
        while (currentEnemy.hp > 0 && player.hp > 0) {
            System.out.println("O inimigo " + currentEnemy.name + " tem " + currentEnemy.hp + " de HP.");
            System.out.println("Você tem " + player.hp + " de HP e " + player.mana + " de Mana.");
            
            System.out.println("O que você deseja fazer?");
            System.out.println("1. Atacar");
            System.out.println("2. Usar Poção de Cura");
            System.out.print("Escolha uma opção: ");
            
            int choice = scanner.nextInt();
            
            switch (choice) {
                case 1:
                    attack();
                    break;
                case 2:
                    usePotion();
                    break;
                default:
                    System.out.println("Escolha inválida!");
                    break;
            }
            
            if (currentEnemy.hp > 0) {
                enemyAttack();
            }
        }
        
        if (player.hp <= 0) {
            System.out.println("Você foi derrotado... Fim de jogo!");
        } else {
            System.out.println("Você derrotou o " + currentEnemy.name + "!");
            player.xp += currentEnemy.xpDrop;
            player.gold += new Random().nextInt(currentEnemy.goldDropMax - currentEnemy.goldDropMin + 1) + currentEnemy.goldDropMin;
            System.out.println("Você ganhou " + currentEnemy.xpDrop + " XP e " + player.gold + " de ouro!");
        }
    }
    
    public static void attack() {
        Random rand = new Random();
        int damage = rand.nextInt(10) + 5; // Dano aleatório
        System.out.println("Você atacou e causou " + damage + " de dano!");
        
        currentEnemy.hp -= damage;
    }
    
    public static void enemyAttack() {
        Random rand = new Random();
        int damage = currentEnemy.attack();
        System.out.println("O " + currentEnemy.name + " atacou e causou " + damage + " de dano!");
        player.hp -= damage;
    }
    
    public static void usePotion() {
        if (player.inventory.get("poção de cura") > 0) {
            player.hp += 50;
            if (player.hp > player.maxHp) {
                player.hp = player.maxHp;
            }
            player.inventory.put("poção de cura", player.inventory.get("poção de cura") - 1);
            System.out.println("Você usou uma poção de cura e restaurou 50 de HP!");
        } else {
            System.out.println("Você não tem poções de cura!");
        }
    }
}
