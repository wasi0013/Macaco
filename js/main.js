var game = new Phaser.Game(400,400, Phaser.AUTO, 'gameDiv')
var player
var cursors
var right = true

var mainState = {
    preload: function() { 
        //this.game.load.spritesheet('monkey','assets/walk.png',72,115)
         this.game.load.image('tree', 'assets/tree.png')
         this.game.stage.backgroundColor = "#ffffff"
         this.game.load.spritesheet('monkey','assets/walk.png',71.5,109)
         this.game.load.image('sky','assets/sky.png')
         this.game.load.image('platform','assets/platform.png')
         this.game.load.image('sky','assets/sky.png')
          //this.game.load.image('background','assets/tests/debug-grid-1920x1920.png')
    },
    create: function() {
        //make the GAME full screen 
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        this.game.scale.refresh()
        
        //start the system
        //this.game.physics.startSystem(Phaser.Physics.P2JS)
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        
        //add preloaded sprites to the game
        this.sky = this.game.add.sprite(0,0,"sky")
        this.tree = this.game.add.sprite(0,0,"tree")
        this.monkey = this.game.add.sprite(50,1000,'monkey')
        this.ground = this.game.add.sprite(0,1200,'platform')
        
        //scales and anchors
        this.monkey.anchor.setTo(.5,.5)
        this.monkey.scale.setTo(.8,.8)
        this.sky.scale.setTo(2,2)
        this.ground.scale.setTo(1.8,0.8)
        
        //player = this.game.add.sprite(game.world.centerX, game.world.centerY, 'monkey')
        //game.physics.p2.enable(this.monkey)
        // this.back=this.game.add.sprite(0,0,'background')
        
        
        //create animations
        this.monkey.animations.add('game',[0,1,2], 5, true)
        
        //start animation
        this.monkey.animations.play('game')
        
        //apply physics on the objects
        game.physics.arcade.enable(this.tree)
        game.physics.arcade.enable(this.monkey)
        game.physics.arcade.enable(this.ground)
        
        this.monkey.body.gravity.y = 300
        this.ground.body.gravity.y = 300
        this.ground.body.immovable = true

        // stop falling from the world's bound
        this.monkey.body.collideWorldBounds = true
        this.ground.body.collideWorldBounds = true
        
        //this.game.add.tileSprite(0, 0, 900, 1200, 'sky')
        
        //camera bounds and activate follow
        this.game.world.setBounds(0, 0, 900, 1200)
        game.camera.follow(this.monkey)
        
        //keyboard inputs
        cursors = this.game.input.keyboard.createCursorKeys()
        
     },
     update: function() {
        //detect monkey and ground collision
        game.physics.arcade.collide(this.monkey, this.ground)
        
        this.monkey.body.velocity.x=0
        if (cursors.left.isDown){
            this.monkey.body.velocity.x = -350
            this.monkey.animations.play('game')
            if(right) {right =  false
            this.monkey.scale.x*=-1
            }
        }
        else if (cursors.right.isDown){
            this.monkey.body.velocity.x = 350
            if(!right) {
                right =  true
                this.monkey.scale.x*=-1
            }


            this.monkey.animations.play('game')
        }
        else{
            this.monkey.animations.stop()
            this.monkey.frame = 2
        }
        //commented for testing purpose, it will allow the monkey to jump infinitely
        //if (cursors.up.isDown && this.monkey.body.touching.down){
        if (cursors.up.isDown ){
            this.monkey.body.velocity.y = -350
        }

        
    },
    render: function() {

    //game.debug.cameraInfo(game.camera, 32, 32)
    //game.debug.spriteCoords(this.monkey, 0, 32)
   },
    jump: function() { 
            
    },

    restartGame: function() {
        game.state.start('main')
    },
    
    addCreeper: function(x, y) {  
    
    },
    addEnemymonkey: function() {
   
    },
    hitGround: function() {  
  
    },
}


var button
var background
var welcomeScreenState = {
    preload: function() {
    this.game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71)
    this.game.load.image('background','assets/screen.png')
    },



    create: function() {
        //make the GAME full screen 
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        this.game.scale.refresh()

        this.game.stage.backgroundColor = '#182d3b'
        this.background = this.game.add.tileSprite(0, 0, 900, 1200, 'background')
        
        this.button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'button', this.actionOnClick, this, 2, 1, 0)
        this.button.anchor.setTo(.5,-1)
        this.button.scale.setTo(.5,.5)
        //this.button.onInputOver.add(this.over, this)
        //this.button.onInputOut.add(this.out, this)
        this.button.onInputUp.add(this.up, this)
    },

    up: function() {
        //start main state
        this.game.state.add('main', mainState)  
        this.game.state.start('main')

    },

    over: function() {
        console.log('button over')
    },

    out: function() {
        console.log('button out')
    },

     actionOnClick: function(){
        this.background.visible =! this.background.visible
    },
}


game.state.add('welcomeScreen',welcomeScreenState)
game.state.start('welcomeScreen')
