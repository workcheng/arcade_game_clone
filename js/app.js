/**
 * app.JS 定义了玩家类，


/**
 * 定义常量
 * @type {{Y_POSITIONS: [*], ENEMY_MIN_STARTING_X: number, ENEMY_MAX_STARTING_X: number, ENEMY_MIN_SPEED: number, ENEMY_MAX_SPEED: number, PLAYER_STARTING_X: number, PLAYER_STARTING_Y: number}}
 */
var data = {
  'Y_POSITIONS': [65, 148, 231],
  'ENEMY_MIN_STARTING_X': -91,
  'ENEMY_MAX_STARTING_X': -91,
  'ENEMY_MIN_SPEED': 100,
  'ENEMY_MAX_SPEED': 300,
  'PLAYER_STARTING_X': 303,
  'PLAYER_STARTING_Y': 400,
  'WIDTH': 101,
  'HEIGHT': 83,
  'DELTA': 15
};

/**
 * 指定敌人不同的图片
 * @type {[*]}
 */
var enemySpriteList = [
    'images/enemy-bug.png',
    'images/enemy-bug.png',
    'images/enemy-bug.png',
    'images/enemy-bug.png',
    'images/enemy-bug.png'
];

/** 场景类
 *
 */
var State = function() {
};

/**
 * 场景开始／复位游戏
 */
State.prototype.restart = function() {
    player.reset();
    // re-fill the allEnemies list.
    // Don't make JavaScript read the length of an array at every iteration of a for loop. Store the length value in a different variable.
    for (var a = 0, b = enemySpriteList.length; a < b; a++) {
        allEnemies.push(new Enemy(enemySpriteList[a]));
    }
};


/**
 *这是我们的玩家要躲避的敌人
 */
var Enemy = function(sprite) {
    this.sprite = sprite;
    // the reset function will reset the enemy's position.
    this.reset();
};

/**
 * 此为游戏必须的函数，用来更新敌人的位置
 * 参数: dt ，表示时间间隙
 * @param dt
 */
Enemy.prototype.update = function(dt) {
    this.x = this.x + dt * this.speed;
    if (this.x >= canvas.width) {
        this.reset();
    }
};

/**
 * 此为游戏必须的函数，用来在屏幕上画出敌人，
  */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Reset the enemy's position.
  */
Enemy.prototype.reset = function() {
    // a new enemy will have a random starting x position.
    this.x = randomInt(data.ENEMY_MIN_STARTING_X, data.ENEMY_MAX_STARTING_X);
    // a new enemy will be randomly positioned in one of the three lanes.
    this.y = data.Y_POSITIONS[randomInt(0, 4)];
    this.speed = randomInt(data.ENEMY_MIN_SPEED, data.ENEMY_MAX_SPEED);
};

/**
 * 玩家类
  */
var Player = function() {
    this.sprite = 'images/char-horn-girl.png';
    this.x = data.PLAYER_STARTING_X;
    this.y = data.PLAYER_STARTING_Y - data.DELTA;
}
/**
 * Each time this function is called, the player goes back to the original starting location
 */
Player.prototype.reset = function() {
    this.sprite = 'images/char-horn-girl.png';
    this.x = data.PLAYER_STARTING_X;
    this.y = data.PLAYER_STARTING_Y;
};


Player.prototype.update = function() {
     if (this.x < 0) {
        this.x=0;
     } else if(this.x>4*data.WIDTH){
         this.x=4*data.WIDTH
     } else if (this.y > 5*data.HEIGHT) {
         this.y = 5*data.HEIGHT-data.DELTA;
     } else if (this.y < 0) {
         this.y = 0-data.DELTA;
     }

    if(this.y < data.HEIGHT-data.DELTA){
        this.reset();
        alert("YOU WIN!");
        // this.y = 4*101;

    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y-data.DELTA)

};

Player.prototype.hide = function() {
    this.x = -101;
};

/**
 * 根据上下左右按钮的输入控制玩家的移动
 * @param input
 */
Player.prototype.handleInput = function(input) {
    var self=this;
    // Collision detection for obstacles must be put inside handleInput function.
    switch (input) {
        case 'left':
            self.x = self.x - data.WIDTH;
            break;
        case 'up':
            self.y = self.y - data.HEIGHT;
            break;
        case 'right':
            self.x = self.x + data.WIDTH;
            break;
        case 'down':
            self.y = self.y + data.HEIGHT;
            break;
    }

};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var state = new State(),
    player = new Player(),
    allEnemies = [];
    state.restart();

/* Helper functions below.
 * Create random integers between min and max, inclusive.
 */
function randomInt(min, max) {
    // Math.floor() returns the largest integer less than or equal to a given number.
    // Math.random() return [0, 1).
    // So to be inclusive of min and max, you need to add 1 to the multiplier.
    return Math.floor(Math.random() * (max - min + 1) + min);
}


/**
 * 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
