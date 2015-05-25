var game = new Phaser.Game(900,1200, Phaser.AUTO, 'gameDiv')

var mainState = {

    preload: function() { 
        //this.game.load.spritesheet('monkey','assets/walk.png',72,115)
         this.game.load.image('tree', 'assets/tree.png')
         this.game.stage.backgroundColor = "#ffffff"
         this.game.load.spritesheet('monkey','assets/walk.png',72,109)
         this.game.load.image('sky','assets/sky.png')
         this.game.load.image('platform','assets/platform.png')
         this.game.load.image('sky','assets/sky.png')
          //this.game.load.image('background','assets/tests/debug-grid-1920x1920.png');
    },
     var player;
     var cursors;
    create: function() { 
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        this.sky = this.game.add.sprite(0,0,"sky")
        this.sky.scale.setTo(2,2)
        this.tree = this.game.add.sprite(0,0,"tree")
        this.monk = this.game.add.sprite(50,1000,'monkey')
        this.ground = this.game.add.sprite(0,1200,'platform')
//player = this.game.add.sprite(game.world.centerX, game.world.centerY, 'monk');
//game.physics.p2.enable(this.monk);
       // this.back=this.game.add.sprite(0,0,'background')
        this.ground.scale.setTo(1.8,0.8);
        this.monk.animations.add('game',[0,1,2], 5, true);
        this.monk.animations.play('game')
        game.physics.arcade.enable(this.tree)
        game.physics.arcade.enable(this.monk)
        game.physics.arcade.enable(this.ground)
        this.monk.body.gravity.y = 300;
        this.monk.body.collideWorldBounds = true;
        this.ground.body.gravity.y = 300;
        this.ground.body.immovable = true;
        this.ground.body.collideWorldBounds = true;


        this.game.add.tileSprite(0, 0, 900, 1200, 'sky');
    this.game.world.setBounds(0, 0, 900, 1200);
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    cursors = this.game.input.keyboard.createCursorKeys();
    game.camera.follow(this.monk);
     },

    update: function() {
        game.physics.arcade.collide(this.monk, this.ground);
        cursors = game.input.keyboard.createCursorKeys();
        this.monk.body.velocity.x=0;
    if (cursors.left.isDown)
    {
        this.monk.body.velocity.x = -350;
        this.monk.animations.play('game');
    }
    else if (cursors.right.isDown)
    {
        this.monk.body.velocity.x = 350;
        this.monk.animations.play('game');
    }
    else
    {
        this.monk.animations.stop();
        this.monk.frame = 2;
    }
    if (cursors.up.isDown && this.monk.body.touching.down)
    {
        this.monk.body.velocity.y = -350;
    }





     this.monk.body.setZeroVelocity();

    if (cursors.up.isDown)
    {
        this.monk.body.moveUp(300)
    }
    else if (cursors.down.isDown)
    {
        this.monk.body.moveDown(300);
    }

    if (cursors.left.isDown)
    {
        this.monk.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        this.monk.body.moveRight(300);
    }
},


    render: function() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(this.monk, 32, 500);
   },

    jump: function() { 
    	    
    },

    restartGame: function() {
        game.state.start('main')
	},
    
    addCreeper: function(x, y) {  
    
    },
    addEnemyMonkey: function() {
   
	},
	hitGround: function() {  
  
	},
}

   //action on button click
var screenState = {
    preload: function() {
    this.game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
    this.game.load.image('background','assets/starfield.jpg');
},

var button;
var background;

create: function() {
    this.game.stage.backgroundColor = '#182d3b';
    this.background = this.game.add.tileSprite(0, 0, 900, 1200, 'background');
    this.button = this.game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
    this.button.onInputOver.add(over, this);
    this.button.onInputOut.add(out, this);
    this.button.onInputUp.add(up, this);
},

up: function() {
    console.log('button up', arguments);
},

over: function() {
    console.log('button over');
},

out: function() {
    console.log('button out');
},

 actionOnClick: function(){
    background.visible =! background.visible;
},
}

game.state.add('main', mainState)  
game.state.start('main')

game.state.add('screen',screenState)
game.state.start('screen')