var game = new Phaser.Game(400,450, Phaser.AUTO, 'gameDiv')
var timer = 60
var cursors
var right = true
var counter=0
var swipeLeft=false,swipeRight=false, gameWin=false
var timerText=null
var swipeCoordX, swipeCoordY, swipeCoordX2, swipeCoordY2, swipeMinDistance = 100

var mainState = {
    preload: function() { 
         this.game.load.image('tree', 'assets/tree.png')
         this.game.stage.backgroundColor = "#ffffff"
         this.game.load.spritesheet('monkey','assets/jump.png',82,108)
         this.game.load.image('sky','assets/sky.png')
         this.game.load.image('platform','assets/platform.png')
         this.game.load.image('sky','assets/sky.png')
         this.game.load.spritesheet('chain', 'assets/chain.png', 16, 26)
         this.game.load.spritesheet('chain', 'assets/btn.png', 193, 71)
    },

    create: function() {

         //make the GAME full screen 
         this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
         this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
         this.game.scale.refresh()

         //initialization of global variables
         gameWin = false
         right = true
         timer = 60
        
        //start the system
        //this.game.physics.startSystem(Phaser.Physics.P2JS)
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        
        //add preloaded sprites to the game
        this.sky = this.game.add.sprite(0,0,"sky")
        this.tree = this.game.add.sprite(0,0,"tree")
        this.monkey = this.game.add.sprite(400,1000,'monkey')
        this.ground = this.game.add.sprite(0,1200,'platform')
        
        //apply physics on the objects
        game.physics.arcade.enable(this.tree)
        game.physics.arcade.enable(this.monkey)
        game.physics.arcade.enable(this.ground)
        
        //timer ticks interval 1s per tick
        interval=setInterval(function(){timer-=1},1000)

        
        //create animations
        this.monkey.animations.add('game',[3,0,1,2], 5, true)
        
        //start animation
        this.monkey.animations.play('game')
        
        
         //scales and anchors
        this.monkey.anchor.setTo(.5,.5)
        this.monkey.scale.setTo(.8,.8)
        this.sky.scale.setTo(2,2)
        this.ground.scale.setTo(1.8,0.8)
        
        
        this.monkey.body.gravity.y = 300
        this.ground.body.gravity.y = 300
        this.ground.body.immovable = true

        // stop falling from the world's bound
        this.monkey.body.collideWorldBounds = true
        this.ground.body.collideWorldBounds = true
                
        //camera bounds and activate follow
        this.game.world.setBounds(0, 0, 900, 1200)
        game.camera.follow(this.monkey)
        
        //keyboard inputs
        cursors = this.game.input.keyboard.createCursorKeys()
        
        //swipe co-ordinates
        this.game.input.onDown.add(function(pointer) {
            swipeCoordX = pointer.clientX
            swipeCoordY = pointer.clientY    
        }, this)

        this.game.input.onUp.add(function(pointer) {
            swipeCoordX2 = pointer.clientX
            swipeCoordY2 = pointer.clientY
            if(swipeCoordX2 < swipeCoordX - swipeMinDistance){
                //console.log("left")
                swipeLeft=true
            }
            else if(swipeCoordX2 > swipeCoordX + swipeMinDistance){
                //console.log("right")
                swipeRight=true
            }
        }, this);      
        
     },
     update: function() {

        //detect monkey and ground collision
        if(!gameWin){
            game.physics.arcade.collide(this.monkey, this.ground)
            if(timerText!=null)timerText.destroy()
                  timerText = game.add.text(
                        10,
                        10,
                        "Time: "+timer+"s",
                        {
                            font: '24px Comic Sans MS',
                            fill: '#fff',
                            stroke: '#000',
                            strokeThickness: 2,
                            align: 'center'
                        })
            timerText.fixedToCamera = true
            timerText.cameraOffset.setTo(10, 10)
            
            counter++
            
            //commented for testing purpose, it will allow the monkey to jump infinitely
            //if (cursors.up.isDown && this.monkey.body.touching.down){
            this.monkey.body.velocity.x=0
            if (swipeLeft || swipeRight || cursors.up.isDown ){
                console.log("up")
                this.monkey.body.velocity.y = -350
                this.monkey.frame = 1
            }
            if (swipeLeft || cursors.left.isDown){
                //console.log("left")
                this.monkey.body.velocity.x = -350
                this.monkey.animations.play('game')
                if(right) {right =  false
                this.monkey.scale.x*=-1
                }
            }
            else if (swipeRight || cursors.right.isDown){
                //console.log("right")
                this.monkey.body.velocity.x = 350
                if(!right) {
                    right =  true
                    this.monkey.scale.x*=-1
                }


                this.monkey.animations.play('game')
            }
            else{
                this.monkey.animations.stop()
                this.monkey.frame = 5
            }
           
            if(counter>20){
                counter=0
                swipeLeft=swipeRight=false
            }
            if((350<=this.monkey.body.x && this.monkey.body.x<450) && (50<=this.monkey.body.y && this.monkey.body.y <=130)){
                //console.log("Home Win!")
                gameWin=true
                gameOverText = game.add.text(
                    game.world.width / 2,
                    game.world.height / 2,
                    "Level Complete",
                    {
                        font: '32px Comic Sans MS',
                        fill: '#fff',
                        stroke: '#430',
                        strokeThickness: 4,
                        align: 'center'
                    }
                )
                gameOverText.fixedToCamera = true
                gameOverText.cameraOffset.setTo(60, 200)
                
                this.button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'button', this.actionOnClick, this, 1, 1, 1)
                this.button.anchor.setTo(.5,-1)
                this.button.scale.setTo(.6,.6)
                this.button.onInputUp.add(this.up, this)
                this.button.fixedToCamera = true
                this.button.cameraOffset.setTo(180,240)
                clearInterval(interval)

            }
        }
        else{


        }

        
    },
    render: function() {

    //game.debug.cameraInfo(game.camera, 32, 32)
    //game.debug.spriteCoords(this.monkey, 0, 32)
   },
    up: function() {
        //start main state
        this.game.state.add('main', mainState)  
        this.game.state.start('main')

    },
     actionOnClick: function(){
       
    },
    tick: function(){
        timer-=1
    }
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
     actionOnClick: function(){
    },
}

game.state.add('welcomeScreen',welcomeScreenState)
game.state.start('welcomeScreen')
