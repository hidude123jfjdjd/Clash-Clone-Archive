// --- 1. SETUP & CONSTANTS ---
console.log("script.js is running...");

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('game-over-screen');

const playerElixirDisplay = document.getElementById('player-elixir-display');
const playerCardElements = [
    document.getElementById('card-0'),
    document.getElementById('card-1'),
    document.getElementById('card-2'),
    document.getElementById('card-3')
];
const botElixirDisplay = document.getElementById('bot-elixir-display');
const botCardElements = [
    document.getElementById('bot-card-0'),
    document.getElementById('bot-card-1'),
    document.getElementById('bot-card-2'),
    document.getElementById('bot-card-3')
];
const twoPlayerButton = document.getElementById('two-player-toggle');

if (!canvas) {
    console.error("CRITICAL ERROR: 'game-canvas' not found. Check your index.html file.");
} else {
    console.log("Canvas found successfully.");
}

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const RIVER_Y = HEIGHT / 2;
const LEFT_BRIDGE_X = WIDTH / 4;
const RIGHT_BRIDGE_X = WIDTH * 3 / 4;

const MAX_ELIXIR = 10;
const ELIXIR_PER_SECOND = 0.5;
const SHADOW_COLOR = 'rgba(0, 0, 0, 0.2)';

const PLAYER_COLOR = '#4040ff';
const BOT_COLOR = '#ff4040';
const HEALTH_GREEN = '#00ff00';
const HEALTH_RED = '#ff0000';
const HEALTH_BG = '#333';
const PROJECTILE_COLOR = '#c0c0c0';
const HIT_SPLAT_COLOR = 'rgba(255, 255, 255, 0.8)';
const ICE_EFFECT_COLOR = 'rgba(100, 200, 255, 0.3)';
const RANGED_ATTACK_THRESHOLD = 50;

// --- NEW MAP COLORS ---
const GRASS_COLOR = '#2a9d4a';
const DIRT_COLOR = '#8b5a2b';
const BRIDGE_COLOR = '#a0522d';
const WATER_COLOR = '#4040ff';

// --- NEW MASTER CARD LIST (24 Cards) ---

// --- Spells ---
const FIREBALL_STATS = { name: 'Fireball', cost: 4, damage: 200, radius: 60, type: 'Spell' };
const ARROWS_STATS = { name: 'Arrows', cost: 3, damage: 100, radius: 100, type: 'Spell' };
const RAGE_STATS = { name: 'Rage', cost: 2, radius: 80, type: 'Spell', effect: 'rage', duration: 5 };
const FREEZE_STATS = { name: 'Freeze', cost: 4, radius: 70, type: 'Spell', effect: 'freeze', duration: 3 };

// --- Ground Units (Melee) ---
const KNIGHT_STATS = { name: 'Knight', cost: 3, hp: 150, damage: 15, attackRange: 30, attackSpeed: 1, speed: 1.2, width: 25, targetType: 'Ground', colors: ['#aaa', '#f0e68c'], detail: {type: 'line', color: 'white', w: 20, h: 3} };
const VALKYRIE_STATS = { name: 'Valkyrie', cost: 4, hp: 200, damage: 20, attackRange: 30, attackSpeed: 1.2, speed: 1.2, width: 28, targetType: 'Ground', aoe: true, colors: ['#ff8c00', '#f0e68c'], detail: {type: 'line', color: '#aaa', w: 30, h: 4} };
const MINI_PEKKA_STATS = { name: 'Mini P.E.K.K.A', cost: 4, hp: 180, damage: 50, attackRange: 30, attackSpeed: 1.5, speed: 1.4, width: 28, targetType: 'Ground', colors: ['#555', '#4682b4'], detail: {type: 'line', color: 'skyblue', w: 25, h: 4} };
const PEKKA_STATS = { name: 'P.E.K.K.A', cost: 7, hp: 600, damage: 100, attackRange: 40, attackSpeed: 1.8, speed: 0.8, width: 45, targetType: 'Ground', colors: ['#333', '#800080'], detail: {type: 'line', color: 'magenta', w: 40, h: 6} };
const GOBLINS_STATS = { name: 'Goblins', cost: 2, hp: 30, damage: 10, attackRange: 25, attackSpeed: 0.8, speed: 2.0, width: 15, targetType: 'Ground', spawnCount: 3, colors: ['#006400', '#90ee90'], detail: {type: 'line', color: 'brown', w: 10, h: 2} };
const SKELETONS_STATS = { name: 'Skeletons', cost: 1, hp: 10, damage: 5, attackRange: 25, attackSpeed: 1, speed: 1.8, width: 12, targetType: 'Ground', spawnCount: 3, colors: ['#fff', '#ccc'], detail: {type: 'line', color: 'grey', w: 10, h: 2} };
const ICE_KNIGHT_STATS = { name: 'Ice Knight', cost: 4, hp: 200, damage: 10, attackRange: 30, attackSpeed: 1.2, speed: 1.2, width: 25, targetType: 'Ground', freeze: 1.5, colors: ['#afeeee', '#fff'], detail: {type: 'line', color: 'blue', w: 20, h: 3} };

// --- Ground Units (Ranged) ---
const ARCHER_STATS = { name: 'Archer', cost: 3, hp: 80, damage: 10, attackRange: 150, attackSpeed: 0.8, speed: 1.2, width: 20, targetType: 'Ground', colors: ['#ff69b4', '#f0e68c'], detail: {type: 'dot', color: 'magenta'} };
const WIZARD_STATS = { name: 'Wizard', cost: 5, hp: 120, damage: 40, attackRange: 160, attackSpeed: 1.4, speed: 1.1, width: 26, targetType: 'Ground', aoe: true, colors: ['#0000cd', '#f0e68c'], detail: {type: 'dot', color: 'orange'} };
const MUSKETEER_STATS = { name: 'Musketeer', cost: 4, hp: 130, damage: 30, attackRange: 180, attackSpeed: 1.0, speed: 1.2, width: 22, targetType: 'Ground', colors: ['#800000', '#f0e68c'], detail: {type: 'dot', color: 'yellow'} };

// --- Ground Units (Building-Targeters) ---
const GIANT_STATS = { name: 'Giant', cost: 5, hp: 500, damage: 25, attackRange: 30, attackSpeed: 1.5, speed: 0.7, width: 40, targetType: 'Buildings', colors: ['#f0e68c', '#d2691e'], detail: {type: 'line', color: 'brown', w: 35, h: 8} };
const HOG_RIDER_STATS = { name: 'Hog Rider', cost: 4, hp: 250, damage: 40, attackRange: 30, attackSpeed: 1.2, speed: 2.0, width: 30, targetType: 'Buildings', colors: ['#f0e68c', '#8b4513'], detail: {type: 'line', color: 'grey', w: 15, h: 5} };
const GOLEM_STATS = { name: 'Golem', cost: 8, hp: 1000, damage: 60, attackRange: 40, attackSpeed: 2.0, speed: 0.6, width: 50, targetType: 'Buildings', colors: ['#444', '#8a2be2'], detail: {type: 'dot', color: 'purple'} };

// --- Flying Units ---
const MINIONS_STATS = { name: 'Minions', cost: 3, hp: 50, damage: 15, attackRange: 30, attackSpeed: 1, speed: 1.8, width: 18, targetType: 'Air', spawnCount: 3, colors: ['#00008b', '#4169e1'], detail: {type: 'line', color: 'black', w: 10, h: 2} };
const BABY_DRAGON_STATS = { name: 'Baby Dragon', cost: 4, hp: 200, damage: 20, attackRange: 100, attackSpeed: 1.3, speed: 1.5, width: 30, targetType: 'Air', aoe: true, colors: ['#2e8b57', '#90ee90'], detail: {type: 'dot', color: 'orange'} };
const LAVA_HOUND_STATS = { name: 'Lava Hound', cost: 7, hp: 800, damage: 10, attackRange: 40, attackSpeed: 1.5, speed: 0.9, width: 45, targetType: 'Buildings', colors: ['#a52a2a', '#333'], detail: {type: 'dot', color: 'red'} };

// --- Spawners (Buildings) ---
const GOBLIN_HUT_STATS = { name: 'Goblin Hut', cost: 5, hp: 300, type: 'Building', spawnType: GOBLINS_STATS, spawnRate: 5.0, lifetime: 30, width: 50, height: 50, colors: ['#8b4513', '#006400'] };
const SKELETON_TOMB_STATS = { name: 'Tombstone', cost: 3, hp: 200, type: 'Building', spawnType: SKELETONS_STATS, spawnRate: 3.0, lifetime: 25, width: 40, height: 40, colors: ['#888', '#555'] };
const FURNACE_STATS = { name: 'Furnace', cost: 4, hp: 250, type: 'Building', spawnType: { name: 'Fire Spirit', cost: 0, hp: 20, damage: 30, attackRange: 30, attackSpeed: 1, speed: 2.2, width: 15, targetType: 'Ground', aoe: true, colors:['#ff4500', '#ffff00'], detail: {type:'dot', color:'red'} }, spawnRate: 6.0, lifetime: 30, width: 45, height: 45, colors: ['#555', '#ff4500'] };

// --- Master List ---
const MASTER_CARD_LIST = [
    KNIGHT_STATS, ARCHER_STATS, GIANT_STATS, FIREBALL_STATS, ARROWS_STATS,
    MINIONS_STATS, VALKYRIE_STATS, MINI_PEKKA_STATS, WIZARD_STATS, HOG_RIDER_STATS,
    GOBLIN_HUT_STATS, SKELETONS_STATS, MUSKETEER_STATS, RAGE_STATS, FREEZE_STATS,
    PEKKA_STATS, BABY_DRAGON_STATS, SKELETON_TOMB_STATS, GOLEM_STATS, LAVA_HOUND_STATS,
    FURNACE_STATS, MEGA_KNIGHT_STATS, ROYAL_KNIGHT_STATS, GOBLIN_MACHINE_STATS,
    ICE_KNIGHT_STATS
];

// --- UPDATED: Tower Stats ---
const PRINCESS_TOWER_STATS = {hp: 1000, damage: 50, attackRange: 200, attackSpeed: 0.8, type: 'princess', width: 60, height: 80};
const KING_TOWER_STATS = {hp: 1500, damage: 35, attackRange: 180, attackSpeed: 1, type: 'king', width: 70, height: 95};

// --- Game State ---
let playerElixir = 4;
let botElixir = 4;
let allGameObjects = [];

let playerKing, playerP1, playerP2, botKing, botP1, botP2;

// --- UPDATED DECKS (Pulled from new Master List) ---
let playerDeck = [KNIGHT_STATS, ARCHER_STATS, GIANT_STATS, FIREBALL_STATS, ICE_KNIGHT_STATS, HOG_RIDER_STATS, MINIONS_STATS, GOBLIN_HUT_STATS];
let playerHand = [];
let playerDeckNextCardIndex = 0;

let botDeck = [KNIGHT_STATS, ARCHER_STATS, GIANT_STATS, ARROWS_STATS, VALKYRIE_STATS, HOG_RIDER_STATS, MINIONS_STATS, SKELETON_TOMB_STATS];
let botHand = [];
let botDeckNextCardIndex = 0;

let selectedCard = null;
let botPlayTimer = 0;
const BOT_PLAY_DELAY = 2000;
let gameOver = false;
let winner = "";
let lastTime = 0;

let isTwoPlayer = false;
let playerKillCount = 0;
let botKillCount = 0;
const KILLS_FOR_NEW_CARD = 10; // Lowered for more fun


// --- 2. CLASSES ---
class GameObject {
    constructor(x, y, width, height, team, stats) {
        this.x = x;
        this.y = y;
        this.width = width || 0;
        this.height = height || 0;
        this.team = team;
        this.stats = stats;
        this.hp = stats.hp || 0;
        this.maxHp = stats.hp || 0;
        this.target = null;
        this.lastAttackTime = 0;
        this.isAlive = true;
        
        this.statusEffect = { name: 'none', duration: 0, attackSpeedMod: 1.0 }; // Added attackSpeedMod for Rage
        this.originalAttackSpeed = stats.attackSpeed;
    }

    drawShadow() {
        if (this instanceof Projectile || this instanceof SpellEffect || this instanceof HitSplat || this.stats.targetType === 'Air') return;
        
        ctx.fillStyle = SHADOW_COLOR;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.height / 2, this.width * 0.7, this.width * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // --- NEW: drawDetails ---
    drawDetails() {
        // Base Unit (Knight, etc.)
        if (this.stats.detail) {
            ctx.fillStyle = this.stats.colors[1] || 'white';
            ctx.strokeStyle = this.stats.detail.color || 'white';
            ctx.lineWidth = this.stats.detail.h || 2;
            
            // Draw a "face" circle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw a "weapon" line
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width / 2 + this.stats.detail.w, this.y);
            ctx.stroke();
        }

        // Draw angry face
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if(this.stats.targetType !== 'Air') ctx.fillText('>:(', this.x, this.y);
    }

    draw() {
        this.drawShadow();

        ctx.fillStyle = this.stats.colors ? this.stats.colors[0] : (this.team === 'player' ? PLAYER_COLOR : BOT_COLOR);
        
        if (this instanceof Unit) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw overlays
            this.drawDetails();

        } else if (this instanceof Tower) {
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        } else if (this instanceof Building) { // --- NEW ---
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        } else if (this instanceof Projectile) {
            ctx.strokeStyle = PROJECTILE_COLOR;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.dx * 2, this.y - this.dy * 2);
            ctx.stroke();
        }
        
        if (this.maxHp > 0) {
            this.drawHealthBar();
        }
        if (this instanceof Unit) {
            this.drawName();
        }
        
        // Draw Status Effects
        if (this.statusEffect.duration > 0) {
            if (this.statusEffect.name === 'frozen') {
                ctx.fillStyle = ICE_EFFECT_COLOR;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width / 2 + 5, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.statusEffect.name === 'rage') {
                ctx.fillStyle = 'rgba(255, 0, 255, 0.3)'; // Rage purple
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width / 2 + 8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    drawHealthBar() {
        const barWidth = this.width;
        const barHeight = 5;
        const barY = this.y - this.height / 2 - 10;
        const healthWidth = (this.hp / this.maxHp) * barWidth;

        ctx.fillStyle = HEALTH_BG;
        ctx.fillRect(this.x - barWidth / 2, barY, barWidth, barHeight);
        ctx.fillStyle = HEALTH_GREEN;
        ctx.fillRect(this.x - barWidth / 2, barY, healthWidth, barHeight);
        
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${Math.ceil(this.hp)} / ${this.maxHp}`, this.x, barY - 2); 
    }

    takeDamage(damage, attackerTeam) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
            
            if (this instanceof Unit) {
                onUnitKilled(attackerTeam);
            }
        }
    }
    
    applyStatus(name, duration) {
        this.statusEffect.name = name;
        this.statusEffect.duration = duration;
        
        if (name === 'rage') {
            this.stats.attackSpeed /= 2; // Attack twice as fast
        } else if (name === 'none') {
            this.stats.attackSpeed = this.originalAttackSpeed; // Reset
        }
    }
    
    findTarget(enemyUnits, enemyTowers) {
        if (this.target && this.target.isAlive) {
            if (getDistance(this, this.target) > this.stats.attackRange * 1.2) { // * 1.2 to prevent jitter
                this.target = null;
            } else {
                return;
            }
        }
        
        this.target = null;
        let closestEnemy = null;
        let minDistance = Infinity;
        
        // --- NEW Flying/Ground Logic ---
        let attackableEnemies = [];
        if (this.stats.targetType === 'Air') { // I am a flying unit
             attackableEnemies = [...enemyUnits.filter(e => e.stats.targetType === 'Air' || e.stats.targetType === 'Ground'), ...enemyTowers];
        } else { // I am a ground unit
            attackableEnemies = [...enemyUnits.filter(e => e.stats.targetType !== 'Air'), ...enemyTowers];
        }
        
        const enemyUnitsOnly = attackableEnemies.filter(e => e instanceof Unit);
        const enemyTowersOnly = attackableEnemies.filter(e => e instanceof Tower);

        let validEnemies = [];
        
        if (this.stats.targetType === 'Buildings') {
            validEnemies = enemyTowersOnly;
        } else {
            validEnemies = enemyUnitsOnly.length > 0 ? enemyUnitsOnly : enemyTowersOnly;
        }
        
        let princessTowers = validEnemies.filter(e => e.stats.type === 'princess' && e.isAlive);
        let kingTower = validEnemies.find(e => e.stats.type === 'king' && e.isAlive);
        
        let targetableTowers = [];
        if (this.stats.targetType === 'Buildings') {
            if (princessTowers.length > 0) {
                targetableTowers = princessTowers;
            } else if (kingTower) {
                targetableTowers = [kingTower];
            }
            validEnemies = targetableTowers;
        } else {
            if (enemyUnitsOnly.length > 0) {
                validEnemies = enemyUnitsOnly;
            } else if (princessTowers.length > 0) {
                validEnemies = princessTowers;
            } else if (kingTower) {
                validEnemies = [kingTower];
            }
        }
        
        for (const enemy of validEnemies) {
            if (!enemy.isAlive) continue;
            const distance = getDistance(this, enemy);
            
            if (this.stats.attackRange > RANGED_ATTACK_THRESHOLD) { 
                if (distance < minDistance && distance <= this.stats.attackRange) {
                    minDistance = distance;
                    closestEnemy = enemy;
                }
            } 
            else { 
                const LEASH_RANGE = (this.stats.targetType === 'Buildings') ? Infinity : 250;
                if (distance < minDistance && distance < LEASH_RANGE) {
                    minDistance = distance;
                    closestEnemy = enemy;
                }
            }
        }
        this.target = closestEnemy;
    }

    attack(currentTime) {
        if (currentTime - this.lastAttackTime > this.stats.attackSpeed * 1000) {
            this.lastAttackTime = currentTime;
            if (this.target) {
                
                if (this.stats.attackRange > RANGED_ATTACK_THRESHOLD) {
                    spawnProjectile(this, this.target, this.team, this.stats.damage);
                } else {
                    this.target.takeDamage(this.stats.damage, this.team);
                    spawnHitSplat(this.target.x, this.target.y, this.target.width, HIT_SPLAT_COLOR);
                    // Apply freeze if attacker is Ice Knight
                    if (this.stats.freeze) {
                        this.target.applyStatus('frozen', this.stats.freeze);
                        spawnHitSplat(this.target.x, this.target.y, this.target.width, '#00aaff');
                    }
                }
            }
        }
    }

    update(currentTime, deltaTime, enemyUnits, enemyTowers) {
        if (this.statusEffect.duration > 0) {
            this.statusEffect.duration -= (deltaTime / 1000);
            if (this.statusEffect.name === 'frozen') {
                return;
            }
        } else if (this.statusEffect.name !== 'none') {
             this.applyStatus('none', 0); // Reset stats
        }
        
        // Implemented by subclasses
    }
}

class Tower extends GameObject {
    constructor(x, y, team, stats) {
        super(x, y, stats.width, stats.height, team, stats);
        this.pathTarget = null;
    }

    update(currentTime, deltaTime, enemyUnits, enemyTowers) {
        if (this.statusEffect.duration > 0) {
            this.statusEffect.duration -= (deltaTime / 1000);
            if (this.statusEffect.name === 'frozen') {
                return;
            }
        } else if (this.statusEffect.name !== 'none') {
             this.applyStatus('none', 0);
        }
        
        if (!this.isAlive) return;
        
        // --- UPDATED: Towers now respect flying units ---
        const attackableEnemies = [...enemyUnits, ...enemyTowers];
        this.findTarget(attackableEnemies); 

        if (this.target) {
            const distance = getDistance(this, this.target);
            if (distance <= this.stats.attackRange) {
                this.attack(currentTime);
            } else {
                this.target = null;
            }
        }
    }
    
    findTarget(allEnemies) {
        if (this.target && this.target.isAlive) {
             if (getDistance(this, this.target) <= this.stats.attackRange) {
                 return;
             }
             this.target = null;
        }
        
        let closestEnemy = null;
        let minDistance = Infinity;

        for (const enemy of allEnemies) {
            if (!enemy.isAlive) continue;
            const distance = getDistance(this, enemy);
            if (distance < minDistance && distance <= this.stats.attackRange) {
                minDistance = distance;
                closestEnemy = enemy;
            }
        }
        this.target = closestEnemy;
    }
}

class Unit extends GameObject {
    constructor(x, y, team, stats, pathTarget) {
        super(x, y, stats.width, stats.height, team, stats);
        this.pathTarget = pathTarget;
    }
    
    drawName() {
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        const name = this.stats ? this.stats.name : '???';
        ctx.fillText(name, this.x, this.y - this.height / 2 - 20);
    }

    getNextWaypoint(finalTarget) {
        const onPlayerSide = this.y > RIVER_Y;
        const onBotSide = this.y < RIVER_Y;
        
        const LEFT_BRIDGE = { x: LEFT_BRIDGE_X, y: RIVER_Y };
        const RIGHT_BRIDGE = { x: RIGHT_BRIDGE_X, y: RIVER_Y };

        if (!finalTarget) return null;

        // --- NEW: Flying units don't use bridges ---
        if (this.stats.targetType === 'Air') {
            return finalTarget;
        }

        if (this.team === 'player' && onPlayerSide) {
            if (finalTarget.x < WIDTH / 2) {
                return LEFT_BRIDGE;
            } else {
                return RIGHT_BRIDGE;
            }
        }
        
        if (this.team === 'bot' && onBotSide) {
            if (this.pathTarget.x < WIDTH / 2) {
                return LEFT_BRIDGE;
            } else {
                return RIGHT_BRIDGE;
            }
        }

        if (finalTarget && finalTarget.isAlive) {
            return finalTarget;
        }
        
        return null;
    }

    update(currentTime, deltaTime, enemyUnits, enemyTowers) {
        if (this.statusEffect.duration > 0) {
            this.statusEffect.duration -= (deltaTime / 1000);
            if (this.statusEffect.name === 'frozen') {
                return;
            }
        } else if (this.statusEffect.name !== 'none') {
             this.applyStatus('none', 0);
        }
        
        if (!this.isAlive) return;

        this.findTarget(enemyUnits, enemyTowers); 

        if (this.target) {
            const distance = getDistance(this, this.target);
            
            if (distance <= this.stats.attackRange) {
                this.attack(currentTime);
            } else {
                if (this.stats.attackRange <= RANGED_ATTACK_THRESHOLD || this.stats.targetType === 'Buildings') {
                    this.moveTowards(this.target); 
                }
            }
        } else {
            // No enemy target, follow the path
            if (this.stats.targetType === 'Buildings') {
                 this.pathTarget = (this.team === 'player') ? getBotTarget(this.x) : getPlayerTarget(this.x);
                 if(this.pathTarget) this.target = this.pathTarget;
                 return; 
            }

            if (!this.pathTarget || !this.pathTarget.isAlive) {
                 this.pathTarget = (this.team === 'player') ? getBotTarget(this.x) : getPlayerTarget(this.x);
                 if (!this.pathTarget) return; 
            }
            
            const waypoint = this.getNextWaypoint(this.pathTarget);
            
            if (waypoint) {
                const waypointDist = getDistance(this, waypoint);
                
                if (waypoint === this.pathTarget && waypointDist <= this.stats.attackRange) {
                    this.target = this.pathTarget;
                    this.attack(currentTime);
                }
                else if (waypoint !== this.pathTarget && waypointDist <= this.stats.speed * 3) {
                    this.moveTowards(this.pathTarget);
                }
                else {
                    this.moveTowards(waypoint);
                }
            }
        }
    }

    moveTowards(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 1) { 
            return;
        }
        
        // --- NEW: Flying units move directly ---
        if (this.stats.targetType === 'Air') {
            this.x += (dx / distance) * this.stats.speed;
            this.y += (dy / distance) * this.stats.speed;
            return;
        }
        
        // Ground units pathfinding (simplified)
        if (distance > this.stats.speed) {
            this.x += (dx / distance) * this.stats.speed;
            this.y += (dy / distance) * this.stats.speed;
        } else {
            this.x += dx;
            this.y += dy;
        }
    }
}

// --- NEW CLASS: Building ---
class Building extends GameObject {
    constructor(x, y, team, stats) {
        super(x, y, stats.width, stats.height, team, stats);
        this.spawnTimer = stats.spawnRate;
        this.lifetime = stats.lifetime;
    }
    
    update(currentTime, deltaTime, enemyUnits, enemyTowers) {
        if (!this.isAlive) return;
        
        // Handle status effects
        if (this.statusEffect.duration > 0) {
            this.statusEffect.duration -= (deltaTime / 1000);
            if (this.statusEffect.name === 'frozen') {
                return; // Frozen
            }
        } else if (this.statusEffect.name !== 'none') {
             this.applyStatus('none', 0);
        }
        
        // Countdown lifetime
        this.lifetime -= (deltaTime / 1000);
        if (this.lifetime <= 0) {
            this.isAlive = false;
            return;
        }

        // Countdown to spawn
        this.spawnTimer -= (deltaTime / 1000);
        if (this.spawnTimer <= 0) {
            this.spawnTimer = this.stats.spawnRate; // Reset timer
            this.spawnUnit();
        }
    }
    
    spawnUnit() {
        const x = this.x;
        const y = this.y + (this.team === 'player' ? -20 : 20); // Spawn in front
        const target = (this.team === 'player') ? getBotTarget(x) : getPlayerTarget(x);
        
        if (this.stats.spawnType.spawnCount) {
            // Spawn a swarm (e.g., Goblins, Skeletons)
            for(let i=0; i < this.stats.spawnType.spawnCount; i++) {
                let spawnX = x + (Math.random() * 40 - 20); // Add random offset
                let spawnY = y + (Math.random() * 40 - 20);
                deployUnit(this.team, this.stats.spawnType, spawnX, spawnY, target);
            }
        } else {
            // Spawn a single unit
            deployUnit(this.team, this.stats.spawnType, x, y, target);
        }
    }
    
    drawName() {
        // Buildings don't have names drawn
    }
}


class SpellEffect extends GameObject {
    constructor(x, y, team, stats) {
        super(x, y, 0, 0, team, stats);
        this.radius = stats.radius;
        this.damage = stats.damage || 0;
        this.lifetime = 0.5; // Short visual effect
        
        // --- NEW: Apply spell effects ---
        if (stats.effect) {
            this.effect = stats.effect;
            this.effectDuration = stats.duration;
            this.lifetime = 1.0; // Last longer so effect is visible
        }
    }

    applyEffect(enemies) {
        for (const enemy of enemies) {
            if (getDistance(this, enemy) <= this.radius) {
                if (this.damage > 0) {
                    enemy.takeDamage(this.damage, this.team);
                }
                if (this.effect) {
                    enemy.applyStatus(this.effect, this.effectDuration);
                }
            }
        }
    }

    update(currentTime, deltaTime) {
        this.lifetime -= (deltaTime / 1000);
        if (this.lifetime <= 0) {
            this.isAlive = false;
        }
    }

    draw() {
        let color = 'rgba(0,0,0,0)'; // transparent
        if (this.damage > 0) color = 'rgba(255, 100, 0, 0.5)'; // Fireball
        if (this.effect === 'freeze') color = 'rgba(100, 200, 255, 0.4)';
        if (this.effect === 'rage') color = 'rgba(255, 0, 255, 0.3)';
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Projectile extends GameObject {
    constructor(x, y, team, target, damage) {
        super(x, y, 0, 0, team, { damage: damage });
        this.speed = 8.0;
        this.target = target;
        this.targetPos = { x: target.x, y: target.y };
        this.dx = 0;
        this.dy = 0;
    }

    update(currentTime, deltaTime) {
        if (!this.isAlive) return;

        let currentTargetPos = (this.target && this.target.isAlive) ? {x: this.target.x, y: this.target.y} : this.targetPos;

        const dx = currentTargetPos.x - this.x;
        const dy = currentTargetPos.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.speed) {
            if (this.target && this.target.isAlive) {
                this.target.takeDamage(this.stats.damage, this.team);
            }
            this.isAlive = false;
        } else {
            this.dx = (dx / distance) * this.speed;
            this.dy = (dy / distance) * this.speed;
            this.x += this.dx;
            this.y += this.dy;
        }
    }
}

class HitSplat extends GameObject {
    constructor(x, y, baseWidth, color) {
        super(x, y, 0, 0, null, {});
        this.maxRadius = baseWidth * 0.75;
        this.currentRadius = 0;
        this.lifetime = 0.2;
        this.color = color;
    }

    update(currentTime, deltaTime) {
        this.lifetime -= (deltaTime / 1000);
        if (this.lifetime <= 0) {
            this.isAlive = false;
        }
        this.currentRadius = this.maxRadius * (1 - (this.lifetime / 0.2));
    }

    draw() {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.stroke();

        if (this.currentRadius > 5) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.currentRadius - 5, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}


// --- 3. HELPER FUNCTIONS ---

function getDistance(obj1, obj2) {
    if (!obj1 || !obj2) return Infinity;
    const x1 = obj1.x;
    const y1 = obj1.y;
    const x2 = obj2.x;
    const y2 = obj2.y;
    return Math.hypot(x1 - x2, y1 - y2);
}

function getBotTarget(x) {
    let target = (x < WIDTH / 2) ? botP1 : botP2;
    if (!target.isAlive) { target = (target === botP1) ? botP2 : botP1; }
    if (!target.isAlive) { target = botKing; }
    return target;
}

function getPlayerTarget(x) {
    let target = (x < WIDTH / 2) ? playerP1 : playerP2;
    if (!target.isAlive) { target = (target === playerP1) ? playerP2 : playerP1; }
    if (!target.isAlive) { target = playerKing; }
    return target;
}

// --- UPDATED: deployUnit now handles buildings/spawners ---
function deployUnit(team, stats, x, y, pathTarget) {
    let unit;
    if (stats.type === 'Building') {
        unit = new Building(x, y, team, stats);
    } else if (stats.name === 'Ice Knight') {
        unit = new IceKnight(x, y, team, stats, pathTarget);
    } else {
        unit = new Unit(x, y, team, stats, pathTarget);
    }
    
    // Handle swarm cards
    if (stats.spawnCount) {
        for(let i=0; i < stats.spawnCount; i++) {
            let spawnX = x + (Math.random() * 40 - 20);
            let spawnY = y + (Math.random() * 40 - 20);
            allGameObjects.push(new Unit(spawnX, spawnY, team, stats, pathTarget));
        }
    } else {
        allGameObjects.push(unit);
    }
}

function deploySpell(team, stats, x, y) {
    const allEnemies = allGameObjects.filter(o => o.team !== team && o.isAlive);
    const spell = new SpellEffect(x, y, team, stats);
    spell.applyEffect(allEnemies); // Apply damage AND/OR status
    allGameObjects.push(spell);
}

function spawnProjectile(attacker, target, team, damage) {
    const projectile = new Projectile(attacker.x, attacker.y, team, target, damage);
    allGameObjects.push(projectile);
}

function spawnHitSplat(x, y, baseWidth, color = HIT_SPLAT_COLOR) {
    const splat = new HitSplat(x, y, baseWidth, color);
    allGameObjects.push(splat);
}

function drawNextCard(deck, hand, handIndex, nextCardIndex) {
    if (nextCardIndex >= deck.length) {
        console.log("Reshuffling deck!");
        nextCardIndex = 4;
    }
    const playedCardStats = hand[handIndex];
    const newCardStats = deck[nextCardIndex];
    
    hand[handIndex] = newCardStats;
    deck.push(playedCardStats);
    
    return nextCardIndex + 1;
}

function onUnitKilled(attackerTeam) {
    if (attackerTeam === 'player') {
        playerKillCount++;
        console.log("Player Kills: " + playerKillCount);
        if (playerKillCount > 0 && playerKillCount % KILLS_FOR_NEW_CARD === 0) {
            addRandomCardToDeck('player');
        }
    } else if (attackerTeam === 'bot') {
        botKillCount++;
        console.log("Bot Kills: " + botKillCount);
        if (botKillCount > 0 && botKillCount % KILLS_FOR_NEW_CARD === 0) {
            addRandomCardToDeck('bot');
        }
    }
}

function addRandomCardToDeck(team) {
    const newCard = LOOT_POOL[Math.floor(Math.random() * LOOT_POOL.length)];
    if (team === 'player') {
        playerDeck.push(newCard);
        console.log("Player earned a new card: " + newCard.name);
    } else {
        botDeck.push(newCard);
        console.log("Bot earned a new card: " + newCard.name);
    }
}


function setupGame() {
    playerKing = new Tower(WIDTH / 2, HEIGHT - 60, 'player', KING_TOWER_STATS);
    playerP1 = new Tower(WIDTH / 4, HEIGHT - 120, 'player', PRINCESS_TOWER_STATS);
    playerP2 = new Tower(WIDTH * 3 / 4, HEIGHT - 120, 'player', PRINCESS_TOWER_STATS);
    
    botKing = new Tower(WIDTH / 2, 60, 'bot', KING_TOWER_STATS);
    botP1 = new Tower(WIDTH / 4, 120, 'bot', PRINCESS_TOWER_STATS);
    botP2 = new Tower(WIDTH * 3 / 4, 120, 'bot', PRINCESS_TOWER_STATS);

    allGameObjects = [playerKing, playerP1, playerP2, botKing, botP1, botP2];
    
    playerHand = playerDeck.slice(0, 4);
    playerDeckNextCardIndex = 4;
    
    botHand = botDeck.slice(0, 4);
    botDeckNextCardIndex = 4;

    playerCardElements.forEach((card, index) => {
        card.addEventListener('mousedown', () => onCardClickPlayer(index));
    });
    botCardElements.forEach((card, index) => {
        card.addEventListener('mousedown', () => onCardClickBot(index));
    });
    
    canvas.addEventListener('mouseup', onCanvasClick);

    twoPlayerButton.addEventListener('click', () => {
        isTwoPlayer = !isTwoPlayer;
        document.body.classList.toggle('two-player-mode');
        if (isTwoPlayer) {
            console.log("2-Player Mode ENABLED");
            twoPlayerButton.textContent = "Disable 2-Player (Bot ON)";
        } else {
            console.log("2-Player Mode DISABLED (Bot ON)");
            twoPlayerButton.textContent = "Enable 2-Player (Bot OFF)";
            botPlayTimer = performance.now();
        }
    });

    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

// --- 4. GAME LOGIC & AI ---

function updateUI() {
    playerElixirDisplay.textContent = Math.floor(playerElixir);
    playerHand.forEach((cardStats, index) => {
        const cardEl = playerCardElements[index];
        const name = cardStats ? cardStats.name : '...';
        const cost = cardStats ? cardStats.cost : '?';
        cardEl.innerHTML = `
            <div class.card-name">${name}</div>
            <div class="card-cost">${cost}</div>
        `;
        if (cardStats && playerElixir >= cardStats.cost) {
            cardEl.classList.remove('disabled');
        } else {
            cardEl.classList.add('disabled');
        }
        if (selectedCard && selectedCard.team === 'player' && selectedCard.index === index) {
            cardEl.style.borderColor = '#00aaff';
        } else {
            cardEl.style.borderColor = '#fff';
        }
    });

    if (isTwoPlayer) {
        botElixirDisplay.textContent = Math.floor(botElixir);
        botHand.forEach((cardStats, index) => {
            const cardEl = botCardElements[index];
            const name = cardStats ? cardStats.name : '...';
            const cost = cardStats ? cardStats.cost : '?';
            
            cardEl.innerHTML = `
                <div class="card-name">${name}</div>
                <div class="card-cost">${cost}</div>
            `;

            if (cardStats && botElixir >= cardStats.cost) {
                cardEl.classList.remove('disabled');
            } else {
                cardEl.classList.add('disabled');
            }
            if (selectedCard && selectedCard.team === 'bot' && selectedCard.index === index) {
                cardEl.style.borderColor = '#ff5555';
            } else {
                cardEl.style.borderColor = '#fff';
            }
        });
    }
}

function botAI(currentTime, deltaTime) {
    botPlayTimer += deltaTime;
    if (botPlayTimer > BOT_PLAY_DELAY) {
        botPlayTimer = 0;
        
        let playableCards = [];
        botHand.forEach((cardStats, index) => {
            if (cardStats && botElixir >= cardStats.cost) {
                playableCards.push({ index, stats: cardStats });
            }
        });

        if (playableCards.length > 0) {
            const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
            botElixir -= cardToPlay.stats.cost;
            
            if (cardToPlay.stats.type === 'Spell') {
                const x = Math.random() * WIDTH;
                const y = Math.random() * (HEIGHT - RIVER_Y) + RIVER_Y;
                deploySpell('bot', cardToPlay.stats, x, y);
            } else {
                const x = Math.random() * WIDTH;
                const y = Math.random() * (RIVER_Y - 40) + 20;
                const target = getPlayerTarget(x);
                deployUnit('bot', cardToPlay.stats, x, y, target);
            }
            
            botDeckNextCardIndex = drawNextCard(botDeck, botHand, cardToPlay.index, botDeckNextCardIndex);
        }
    }
}

function update(currentTime, deltaTime) {
    if (gameOver) return;

    const deltaSeconds = deltaTime / 1000;
    playerElixir = Math.min(MAX_ELIXIR, playerElixir + (ELIXIR_PER_SECOND * deltaSeconds));
    
    if (isTwoPlayer) {
        botElixir = Math.min(MAX_ELIXIR, botElixir + (ELIXIR_PER_SECOND * deltaSeconds));
    } else {
        botElixir = Math.min(MAX_ELIXIR, botElixir + (ELIXIR_PER_SECOND * deltaSeconds));
        botAI(currentTime, deltaTime);
    }
    
    const playerTowers = allGameObjects.filter(o => o.team === 'player' && o instanceof Tower && o.isAlive);
    const botTowers = allGameObjects.filter(o => o.team === 'bot' && o instanceof Tower && o.isAlive);
    const playerUnits = allGameObjects.filter(o => o.team === 'player' && o instanceof Unit && o.isAlive);
    const botUnits = allGameObjects.filter(o => o.team === 'bot' && o instanceof Unit && o.isAlive);

    allGameObjects.forEach(obj => {
        if (obj.isAlive) {
            obj.update(currentTime, deltaTime, (obj.team === 'player' ? botUnits : playerUnits), (obj.team === 'player' ? botTowers : playerTowers));
        }
    });

    allGameObjects = allGameObjects.filter(obj => obj.isAlive);

    if (!botKing.isAlive) {
        gameOver = true;
        winner = "Player 1 Wins!";
    } else if (!playerKing.isAlive) {
        gameOver = true;
        winner = "Player 2 Wins!";
    }
}

// --- 5. DRAWING ---

function drawArena() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Grass
    ctx.fillStyle = GRASS_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Dirt paths
    ctx.fillStyle = DIRT_COLOR;
    ctx.beginPath();
    ctx.moveTo(LEFT_BRIDGE_X - 30, 0);
    ctx.lineTo(LEFT_BRIDGE_X + 30, 0);
    ctx.lineTo(LEFT_BRIDGE_X + 30, RIVER_Y - 15);
    ctx.lineTo(WIDTH / 4 - 30, RIVER_Y - 15);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(RIGHT_BRIDGE_X - 30, 0);
    ctx.lineTo(RIGHT_BRIDGE_X + 30, 0);
    ctx.lineTo(RIGHT_BRIDGE_X + 30, RIVER_Y - 15);
    ctx.lineTo(WIDTH * 3 / 4 - 30, RIVER_Y - 15);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(LEFT_BRIDGE_X - 30, HEIGHT);
    ctx.lineTo(LEFT_BRIDGE_X + 30, HEIGHT);
    ctx.lineTo(LEFT_BRIDGE_X + 30, RIVER_Y + 15);
    ctx.lineTo(WIDTH / 4 - 30, RIVER_Y + 15);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(RIGHT_BRIDGE_X - 30, HEIGHT);
    ctx.lineTo(RIGHT_BRIDGE_X + 30, HEIGHT);
    ctx.lineTo(RIGHT_BRIDGE_X + 30, RIVER_Y + 15);
    ctx.lineTo(WIDTH * 3 / 4 - 30, RIVER_Y + 15);
    ctx.closePath();
    ctx.fill();

    // Water
    ctx.fillStyle = WATER_COLOR;
    ctx.fillRect(0, RIVER_Y - 10, WIDTH, 20);
    
    // Bridges
    ctx.fillStyle = BRIDGE_COLOR;
    ctx.fillRect(LEFT_BRIDGE_X - 30, RIVER_Y - 15, 60, 30);
    ctx.fillRect(RIGHT_BRIDGE_X - 30, RIVER_Y - 15, 60, 30);
    // Bridge planks
    ctx.strokeStyle = '#663300';
    ctx.lineWidth = 2;
    for(let i = -25; i <= 25; i += 10) {
        ctx.beginPath();
        ctx.moveTo(LEFT_BRIDGE_X + i, RIVER_Y - 15);
        ctx.lineTo(LEFT_BRIDGE_X + i, RIVER_Y + 15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(RIGHT_BRIDGE_X + i, RIVER_Y - 15);
        ctx.lineTo(RIGHT_BRIDGE_X + i, RIVER_Y + 15);
        ctx.stroke();
    }
}

function draw() {
    drawArena();
    
    const gameUnits = allGameObjects.filter(o => !(o instanceof SpellEffect || o instanceof Projectile || o instanceof HitSplat));
    const effects = allGameObjects.filter(o => (o instanceof SpellEffect || o instanceof Projectile || o instanceof HitSplat));
    
    gameUnits.sort((a, b) => a.y - b.y);
    
    gameUnits.forEach(obj => {
        if (obj.isAlive) {
            obj.draw();
        }
    });
    
    effects.forEach(obj => {
        if (obj.isAlive) {
            obj.draw();
        }
    });
    
    if (gameOver) {
        gameOverScreen.textContent = winner;
        gameOverScreen.style.display = 'flex';
    }
}

// --- 6. EVENT HANDLERS ---

function onCardClickPlayer(index) {
    if (gameOver) return;
    const cardStats = playerHand[index];
    if (cardStats && playerElixir >= cardStats.cost) {
        selectedCard = { index: index, stats: cardStats, team: 'player' };
    } else {
        selectedCard = null;
    }
    updateUI();
}

function onCardClickBot(index) {
    if (gameOver || !isTwoPlayer) return;
    const cardStats = botHand[index];
    if (cardStats && botElixir >= cardStats.cost) {
        selectedCard = { index: index, stats: cardStats, team: 'bot' };
    } else {
        selectedCard = null;
    }
    updateUI();
}


function onCanvasClick(event) {
    if (gameOver || !selectedCard) {
        selectedCard = null;
        updateUI();
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (selectedCard.team === 'player') {
        if (selectedCard.stats.type === 'Spell') {
            playerElixir -= selectedCard.stats.cost;
            deploySpell('player', selectedCard.stats, x, y);
            playerDeckNextCardIndex = drawNextCard(playerDeck, playerHand, selectedCard.index, playerDeckNextCardIndex);
        }
        else if (y > RIVER_Y && y < HEIGHT) {
            playerElixir -= selectedCard.stats.cost;
            const target = getBotTarget(x);
            deployUnit('player', selectedCard.stats, x, y, target);
            playerDeckNextCardIndex = drawNextCard(playerDeck, playerHand, selectedCard.index, playerDeckNextCardIndex);
        }
    }
    else if (selectedCard.team === 'bot' && isTwoPlayer) {
         if (selectedCard.stats.type === 'Spell') {
            botElixir -= selectedCard.stats.cost;
            deploySpell('bot', selectedCard.stats, x, y);
            botDeckNextCardIndex = drawNextCard(botDeck, botHand, selectedCard.index, botDeckNextCardIndex);
        }
        else if (y < RIVER_Y && y > 0) {
            botElixir -= selectedCard.stats.cost;
            const target = getPlayerTarget(x);
            deployUnit('bot', selectedCard.stats, x, y, target);
            botDeckNextCardIndex = drawNextCard(botDeck, botHand, selectedCard.index, botDeckNextCardIndex);
        }
    }
    
    selectedCard = null;
    updateUI();
}

// --- 7. GAME LOOP ---

function gameLoop(currentTime) {
    if (!lastTime) {
        lastTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    update(currentTime, deltaTime);
    draw();
    updateUI();

    requestAnimationFrame(gameLoop);
}

// --- Start the game! ---
console.log("Game is starting...");
setupGame();
