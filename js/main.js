var game = new Phaser.Game(400,450, Phaser.AUTO, 'gameDiv')
var timer = 60
var cursors
var right = true
var counter=0
var swipeLeft=false,swipeRight=false, isGameRunning=true
var timerText=null
var swipeCoordX, swipeCoordY, swipeCoordX2, swipeCoordY2, swipeMinDistance = 100
var isJumped = false, touchingGround = true ,touchingRopes = false
var flipper=true
var lastRect

//collisions for P2 Physics
var monkeyCollisionGroup 
var ropeCollisionGroup 
var groundCollisionGroup  

var mainState = {
    preload: function() { 
         this.game.load.image('tree', 'assets/tree.png')
         this.game.stage.backgroundColor = "#ffffff"
         this.game.load.spritesheet('monkey','assets/jumpy.png',82,108)
         this.game.load.image('sky','assets/sky.png')
         this.game.load.image('platform','assets/platform.png')
         this.game.load.image('sky','assets/sky.png')
         this.game.load.spritesheet('chain', 'assets/chain.png', 16, 26)
         this.game.load.spritesheet('chain', 'assets/btn.png', 193, 71)
         this.game.load.spritesheet('chain', 'assets/chain.png', 16, 26)
    },

    create: function() {
        //makes phaser state go Full Screen
        fullScreenMode()
         
        //initialization of global variables
        isGameRunning = true
        right = true
        timer = 60
        isJumped = false
        touchingGround = true
        touchingRopes = false
        
        //start the system
        this.game.physics.startSystem(Phaser.Physics.P2JS)
        
        this.game.physics.p2.setImpactEvents(true)
        this.game.physics.p2.restitution = 0.8
        this.game.physics.p2.gravity.y = 12000
        
        //collisions for P2 Physics
        monkeyCollisionGroup = game.physics.p2.createCollisionGroup()
        ropeCollisionGroup = game.physics.p2.createCollisionGroup()
        groundCollisionGroup = game.physics.p2.createCollisionGroup()
        
        
        //add preloaded sprites to the game
        this.sky = this.game.add.sprite(0,0,"sky")
        this.tree = this.game.add.sprite(0,0,"tree")
        this.ground = this.game.add.sprite(0,1200,'platform')
        this.monkey = this.game.add.sprite(400,1000,'monkey')
        
        
        //apply physics on the objects
        this.game.physics.p2.enable(this.monkey)
        this.game.physics.p2.enable(this.ground)
        this.monkey.body.fixedRotation = true
        this.monkey.body.setRectangle(40, 40)
        
        //timer ticks interval 1s per tick
        interval=setInterval(function(){timer -= 1},1000)

        
        //create animations
        this.monkey.animations.add('game',[3, 0, 1, 2], 5, true)
        
        //start animation
        this.monkey.animations.play('game')
        
        
         //scales and anchors
        this.monkey.anchor.setTo(.5, .5)
        this.monkey.scale.setTo(.8, .8)
        this.sky.scale.setTo(2, 2)
        this.ground.scale.setTo(4, 1.8)
        this.ground.body.setRectangle(2000,100)
        
        
        this.ground.body.gravity.y = 10000
        this.ground.body.immovable = true
        this.ground.body.static = true
        
        //update world bounds with the new constraints
        //this.game.physics.p2.updateBoundsCollisionGroup()
        //this.monkey.body.setCollisionGroup(monkeyCollisionGroup)
        //this.ground.body.setCollisionGroup(groundCollisionGroup)
        //this.monkey.body.collides([groundCollisionGroup,ropeCollisionGroup])

        
        // stop falling from the world's bound
        this.monkey.body.collideWorldBounds = true
        this.ground.body.collideWorldBounds = true
        this.ground.body.onBeginContact.add(isGrounded, this)
        this.monkey.body.onBeginContact.add(isRoped, this)

                
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
        }, this)

        
    //  Length, xAnchor, yAnchor
    createRope(5, 280, 885)
    lastRect = null
    createRope(5, 572, 744)
    lastRect = null
    createRope(5,539,590)
    lastRect=null  
    createRope(5,232,690)
    lastRect=null  
    createRope(5,314,525)
    lastRect=null  
    createRope(5,466,395)
    lastRect=null 
    createRope(5,293,170)
    lastRect=null
    createRope(5,500,250)
    lastRect=null 

    
        
     },
     update: function() {

        if(isGameRunning){
            //detect monkey and ground collision 
            //game.physics.arcade.collide(this.monkey, this.ground)

            //console.log(this.monkey.body.touching.down)
            //if(timer<=0 || (isJumped && this.monkey.body.touching.down) ){
            if(timer<=0 || (isJumped && touchingGround) ){
                //Game Over
                console.log("game over")
                isGameRunning = false

                this.game.add.tween(this.monkey).to({angle: right? -90:90}, 100).start()
                gameOverText = game.add.text(
                    game.world.width / 2,
                    game.world.height / 2,
                    "Game Over",
                    {
                        font: '32px Comic Sans MS',
                        fill: '#fff',
                        stroke: '#430',
                        strokeThickness: 4,
                        align: 'center'
                    }
                )
                gameOverText.fixedToCamera = true
                gameOverText.cameraOffset.setTo(100, 200)
                
                this.button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'button', this.actionOnClick, this, 1, 1, 1)
                this.button.anchor.setTo(.5,-1)
                this.button.scale.setTo(.6,.6)
                this.button.onInputUp.add(this.up, this)
                this.button.fixedToCamera = true
                this.button.cameraOffset.setTo(180,240)
                clearInterval(interval)





            }
           
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
            this.monkey.body.setZeroVelocity()
            if (swipeLeft || swipeRight || cursors.up.isDown ){
                //console.log("up")
                isJumped = true
                touchingGround = false
                this.monkey.body.moveUp(700)
                this.monkey.body.thrust(500)
                this.monkey.frame = 1
            }
            if (swipeLeft || cursors.left.isDown){
                //console.log("left")
                this.monkey.body.moveLeft(700)
                this.monkey.animations.play('game')
                if(right) {right =  false
                this.monkey.scale.x*=-1
                }
            }
            else if (swipeRight || cursors.right.isDown){
                //console.log("right")
                this.monkey.body.moveRight(700)
                if(!right) {
                    right =  true
                    this.monkey.scale.x *= -1
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
            if((300<=this.monkey.body.x && this.monkey.body.x<450) && (50<=this.monkey.body.y && this.monkey.body.y <=130)){
                //console.log("Home Win!")
                isGameRunning=false
                this.monkey.destroy()
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
                
                this.button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'button', this.actionOnClick, this)
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
    game.debug.spriteCoords(this.monkey, 0, 32)
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
    this.game.load.spritesheet('button', 'assets/btn.png', 193, 71)
    this.game.load.image('background','assets/screen.png')
    },

    create: function() {
        fullScreenMode()
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


function createRope(length, xAnchor, yAnchor) {

    var height = 20        //  Height for the physics body - your image height is 8px
    var width = 16         //  This is the width for the physics body. If too small the rectangles will get scrambled together.
    var maxForce = 20000   //  The force that holds the rectangles together.

    for (var i = 0; i <= length; i++)
    {
        var x = xAnchor                    //  All rects are on the same x position
        var y = yAnchor + (i * height)     //  Every new rect is positioned below the last

        if (i % 2 === 0)
        {
            //  Add sprite (and switch frame every 2nd time)
            newRect = game.add.sprite(x, y, 'chain', 1)

        } 
        else
        {
            newRect = game.add.sprite(x, y, 'chain', 1)
            lastRect.bringToTop()
        }

        //  Enable physicsbody
        game.physics.p2.enable(newRect, false)

        //  Set custom rectangle
        //newRect.body.setCollisionGroup(this.ropeCollisionGroup)
        newRect.body.setRectangle(width, height)
        
        if (i === 0)
        {
            newRect.body.static = true
        }
        else
        {  
            //  Anchor the first one created
            newRect.body.velocity.x = 400
            newRect.body.damping = 0
            newRect.body.restitution = 1
            newRect.body.gravity.x = 0
            newRect.body.gravity.y = 0      //  Give it a push :) just for fun
            newRect.body.mass = length / i     //  Reduce mass for evey rope element
        }

        //  After the first rectangle is created we can add the constraint
        if (lastRect)
        {
            game.physics.p2.createRevoluteConstraint(newRect, [0, -10], lastRect, [0, 10], maxForce)
        }

        lastRect = newRect

    }

}

function fullScreenMode(){
    //make the GAME full screen 
        if (this.game.device.desktop)
        {
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
            this.game.scale.setMinMax(480, 450, 1024, 768);
        }
        else{
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        this.game.scale.pageAlignHorizontally = true
        this.game.scale.pageAlignVertically = true
        this.game.scale.forceOrientation(true, false);
        }
        this.game.scale.refresh()
        
}

function isGrounded(){

        touchingGround = true
        touchingRopes = false
     
}
function isRoped(){
    if(!touchingGround){
        touchingRopes = true
        console.log("touching Ropes")
    }
}