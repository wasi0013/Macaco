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
    },

    create: function() { 
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        this.sky = this.game.add.sprite(0,0,"sky")
        this.sky.scale.setTo(2,2)
        this.tree = this.game.add.sprite(0,0,"tree")
        this.monk = this.game.add.sprite(50,1000,'monkey')
        
        this.ground = this.game.add.sprite(0,1200,'platform')
        this.ground.scale.setTo(2,1);
        
        this.monk.animations.add('game',[0,1,2], 5, true);
        this.monk.animations.play('game')
        game.physics.arcade.enable(this.tree)
        game.physics.arcade.enable(this.monk)
        game.physics.arcade.enable(this.ground)
        this.monk.body.gravity.y = -50;
        this.monk.body.collideWorldBounds = true;
        this.ground.body.gravity.y = 300;
        this.ground.body.immovable = true;
        this.ground.body.collideWorldBounds = true;
        
    },

    update: function() {
        game.physics.arcade.collide(this.monk, this.ground);
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






game.state.add('main', mainState)  
game.state.start('main')  