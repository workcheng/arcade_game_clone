var data = {
  // 'Y_POSITIONS': [65, 148, 231, 314, 397],
  'Y_POSITIONS': [65, 148, 231],
  // 'ENEMY_MIN_STARTING_X': -505,
  'ENEMY_MIN_STARTING_X': -91,
  'ENEMY_MAX_STARTING_X': -91,
  'ENEMY_MIN_SPEED': 100,
  'ENEMY_MAX_SPEED': 300,
  'PLAYER_STARTING_X': 303,
  'PLAYER_STARTING_Y': 400,
  'NUM_OF_POKEBALLS': 5
};

// Set the ememy sprite list.
var enemySpriteList = [
    'images/enemy-bug.png',
    'images/enemy-bug.png',
    'images/enemy-bug.png',
    'images/enemy-bug.png',
    'images/enemy-bug.png'
];

/* This Class manages game state.
 *
 */
var State = function() {
    this.gameOn = false;
};

// When game starts, play this function. Since gameOn is false, the update() does not updates, but render() renders. Therefore you need to hide pikachu and pokeball. And waits for player to click the play button.
State.prototype.intro = function() {
    // No need to hide the enemies because they are all off-screen somewhere between x=-101 and x=-505; Also no need to hide rocks because the list is not filled yet.
    player.hide();
};

State.prototype.restart = function() {
    // set the game state to be on so that the main function starts updateing.
    this.gameOn = true;
    // Since player and Pikachu are purposefully hidden, now show them.
    player.reset();
    // re-fill the allEnemies list.
    // Don't make JavaScript read the length of an array at every iteration of a for loop. Store the length value in a different variable.
    for (var a = 0, b = enemySpriteList.length; a < b; a++) {
        allEnemies.push(new Enemy(enemySpriteList[a]));
    }
    // re-fill the pokeballBar.
    player.numOfPokeballs=data.NUM_OF_POKEBALLS;
};


// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = "images/enemy-bug.png";
    // the reset function will reset the enemy's position.
    this.reset();
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x = this.x + dt * this.speed;
    if (this.x >= canvas.width) {
        this.reset();
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset the enemy's position.
Enemy.prototype.reset = function() {
    // a new enemy will have a random starting x position.
    this.x = randomInt(data.ENEMY_MIN_STARTING_X, data.ENEMY_MAX_STARTING_X);
    // a new enemy will be randomly positioned in one of the three lanes.
    this.y = data.Y_POSITIONS[randomInt(0, 4)];
    this.speed = randomInt(data.ENEMY_MIN_SPEED, data.ENEMY_MAX_SPEED);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function() {
    this.sprite = 'images/char-horn-girl.png';
    this.x = data.PLAYER_STARTING_X;
    this.y = data.PLAYER_STARTING_Y;
}
// Each time this function is called, the player goes back to the original starting location.
Player.prototype.reset = function() {
    this.sprite = 'images/char-horn-girl.png';
    this.x = data.PLAYER_STARTING_X;
    this.y = data.PLAYER_STARTING_Y;
    this.catch = false;
};


Player.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
};

Player.prototype.render = function() {
    // Resources.load(this.sprite);
    // Resources.onReady();
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
    // console.log(im);
    
};

Player.prototype.hide = function() {
    this.x = -101;
};

Player.prototype.handleInput = function(input) {
    var self=this;
    // Collision detection for obstacles must be put inside handleInput function.
    switch (input) {
        case 'left':
            if (self.x >= 101) {
                self.x = self.x - 101;
            }
            break;
        case 'up':
            // No matter the player catches pikachu or not, he can goes up to the second row.
            if (self.y >= 148) {
                self.y = self.y - 83;
                // When at second row, if the player catches pikachu, he can go a step further. Now hands to updateShrinesState() to handle player.
            } else if (self.y === 65 && self.catch === true) {
                self.y = self.y -83;
            }

            break;
        case 'right':
            if (self.x <= 303) {
                self.x = self.x + 101;
            }

            break;
        case 'down':
            if (self.y <= 397) {
                self.y = self.y + 83;
            }

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
 *
 */
// Create random integers between min and max, inclusive.
function randomInt(min, max) {
    // Math.floor() returns the largest integer less than or equal to a given number.
    // Math.random() return [0, 1).
    // So to be inclusive of min and max, you need to add 1 to the multiplier.
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
