// # Quintus platformer example
//
// [Run the example](../quintus/examples/platformer/index.html)
// WARNING: this game must be run from a non-file:// url
// as it loads a level json file.
//
// This is the example from the website homepage, it consists
// a simple, non-animated platformer with some enemies and a 
// target for the player.

var score=0;
var levelNu=1;

function scoreBijwerken(){
  document.getElementById("deScore").innerHTML=score;
  document.getElementById("hetLevel").innerHTML=levelNu;
}

window.addEventListener("load",function() {

scoreBijwerken();

// Set up an instance of the Quintus engine  and include
// the Sprites, Scenes, Input and 2D module. The 2D module
// includes the `TileLayer` class as well as the `2d` componet.
var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch()

// ## Player Sprite
// The very basic player sprite, this is just a normal sprite
// using the player sprite sheet with default controls added to it.
Q.Sprite.extend("Player",{

  // the init constructor is called on creation
  init: function(p) {

    // dit is de plek van het mannetje
    this._super(p, {
      sheet: "player",  // Setting a sprite sheet sets sprite width and height
      x: 90,           // You can also set additional properties that can
      y: 0             // be overridden on object creation
    });

    // Add in pre-made components to get up and running quickly
    // The `2d` component adds in default 2d collision detection
    // and kinetics (velocity, gravity)
    // The `platformerControls` makes the player controllable by the
    // default input actions (left, right to move,  up or action to jump)
    // It also checks to make sure the player is on a horizontal surface before
    // letting them jump.
    this.add('2d, platformerControls');

    // Write event handlers to respond hook into behaviors.
    // hit.sprite is called everytime the player collides with a sprite
    this.on("hit.sprite",function(collision) {

      // Check the collision, if it's the Tower, you win!
      if(collision.obj.isA("Tower")) {
        score=score+100;
        levelNu=levelNu+1;
        if (levelNu>4) {
          Q.stageScene("endGame",1, { label: "Het spel is afgelopen. Score was "+score+".het hele spel Opnieuw?" });
          levelNu=1;
          score=0;
        } else {
          Q.stageScene("endGame",1, { label: "Ben je klaar voor het volgende level?" });
        }
        this.destroy();
        scoreBijwerken();
      }
    });

  }

});


// ## Tower Sprite
// Sprites can be simple, the Tower sprite just sets a custom sprite sheet
Q.Sprite.extend("Tower", {
  init: function(p) {
    this._super(p, { sheet: 'tower' });
  }
});

// ## Enemy Sprite
// Create the Enemy class to add in some baddies
Q.Sprite.extend("Enemy",{
  init: function(p) {
    this._super(p, { sheet: 'enemy', vx: 100 });

    // Enemies use the Bounce AI to change direction 
    // whenver they run into something.
    this.add('2d, aiBounce');

    // Listen for a sprite collision, if it's the player,
    // end the game unless the enemy is hit on top
    
    //als je een monster raakt, auw!
    this.on("bump.left,bump.right,bump.bottom",function(collision) {
      if(collision.obj.isA("Player")) { 
        Q.stageScene("endGame",1, { label: "Je bent dood, score was " + score + " Opnieuw?"});
        score=0; 
        scoreBijwerken();
        collision.obj.destroy();
      }
    });

    // If the enemy gets hit on the top, destroy it
    // and give the user a "hop"
    this.on("bump.top",function(collision) {
      if(collision.obj.isA("Player")) { 
        this.destroy();
        score=score+10;
        scoreBijwerken();
        collision.obj.p.vy = -300;
      }
    });
  }
});

// ## Level1 scene
// Create a new scene called level 1
Q.scene("level1",function(stage) {

  // Add in a repeater for a little parallax action
  stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

  // Add in a tile layer, and make it the collision layer
  stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level1.json', sheet:     'tiles' }));


  // Create the player and add them to the stage
  var player = stage.insert(new Q.Player());

  // Give the stage a moveable viewport and tell it
  // to follow the player.
  stage.add("viewport").follow(player);

  // dit zijn de vijanden
 
  stage.insert(new Q.Enemy({ x: 800, y: 0 }));
  stage.insert(new Q.Enemy({ x: 400, y: 0 }));
  stage.insert(new Q.Enemy({ x: 300, y: 0 }));
  stage.insert(new Q.Enemy({ x: 780, y: 0 }));
  stage.insert(new Q.Enemy({ x: 90, y: 383 }));
  stage.insert(new Q.Enemy({ x: 90, y: 383 }));
  stage.insert(new Q.Enemy({ x: 760, y: 333 }));
 
 
  // dit is de schatkist x=rechts en y =van boven naar beneden
  stage.insert(new Q.Tower({ x: 660, y: 333 }));
});

// ## Level2 scene
// Create a new scene called level 1
Q.scene("level2",function(stage) {

  // Add in a repeater for a little parallax action
  stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

  // Add in a tile layer, and make it the collision layer
  stage.collisionLayer(new Q.TileLayer({
                             dataAsset: 'level2.json',
                             sheet:     'tiles' }));


  // Create the player and add them to the stage
  var player = stage.insert(new Q.Player());

  // Give the stage a moveable viewport and tell it
  // to follow the player.
  stage.add("viewport").follow(player);

  // dit zijn de vijanden
 
  stage.insert(new Q.Enemy({ x: 800, y: 0 }));
  stage.insert(new Q.Enemy({ x: 400, y: 0 }));
  stage.insert(new Q.Enemy({ x: 300, y: 0 }));
  stage.insert(new Q.Enemy({ x: 780, y: 0 }));
  stage.insert(new Q.Enemy({ x: 90, y: 383 }));
  stage.insert(new Q.Enemy({ x: 90, y: 383 }));
  stage.insert(new Q.Enemy({ x: 760, y: 333 }));
  stage.insert(new Q.Enemy({ x: 1040, y: 0 }));
  
  // dit is de schatkist x=rechts en y =van boven naar beneden
  stage.insert(new Q.Tower({ x: 87, y: 370, }));
});


// ## Level3 scene
// Create a new scene called level 1
Q.scene("level3",function(stage) {

  // Add in a repeater for a little parallax action
  stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

  // Add in a tile layer, and make it the collision layer
  stage.collisionLayer(new Q.TileLayer({
                             dataAsset: 'level3.json',
                             sheet:     'tiles' }));


  // Create the player and add them to the stage
  var player = stage.insert(new Q.Player());

  // Give the stage a moveable viewport and tell it
  // to follow the player.
  stage.add("viewport").follow(player);

  // dit zijn de vijanden
 
  stage.insert(new Q.Enemy({ x: 800, y: 0 }));
  stage.insert(new Q.Enemy({ x: 400, y: 0 }));
  stage.insert(new Q.Enemy({ x: 300, y: 0 }));
  stage.insert(new Q.Enemy({ x: 780, y: 0 }));
  stage.insert(new Q.Enemy({ x: 90, y: 383 }));
  stage.insert(new Q.Enemy({ x: 90, y: 383 }));
  stage.insert(new Q.Enemy({ x: 760, y: 333 }));
 
  // dit is de schatkist x=rechts en y =van boven naar beneden
  stage.insert(new Q.Tower({ x: 660, y: 333 }));
});


// ## Level3 scene
// Create a new scene called level 1
Q.scene("level4",function(stage) {

  // Add in a repeater for a little parallax action
  stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

  // Add in a tile layer, and make it the collision layer
  stage.collisionLayer(new Q.TileLayer({
                             dataAsset: 'level4.json',
                             sheet:     'tiles' }));


  // Create the player and add them to the stage
  var player = stage.insert(new Q.Player());

  // Give the stage a moveable viewport and tell it
  // to follow the player.
  stage.add("viewport").follow(player);

  // dit zijn de vijanden
 
  stage.insert(new Q.Enemy({ x: 800, y: 0 }));
  stage.insert(new Q.Enemy({ x: 400, y: 0 }));
  stage.insert(new Q.Enemy({ x: 300, y: 0 }));
  stage.insert(new Q.Enemy({ x: 780, y: 0 }));
  stage.insert(new Q.Enemy({ x: 90, y: 383 }));
  stage.insert(new Q.Enemy({ x: 90, y: 383 }));
  stage.insert(new Q.Enemy({ x: 760, y: 333 }));
 
  // dit is de schatkist x=rechts en y =van boven naar beneden
  stage.insert(new Q.Tower({ x: 660, y: 333 }));
});

// To display a game over / game won popup box, 
// create a endGame scene that takes in a `label` option
// to control the displayed message.
Q.scene('endGame',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",label: "go!" }))         
  var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, color:"red", label: stage.options.label }));
  // When the button is clicked, clear all the stages
  // and restart the game.
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level'+levelNu);
    console.log(levelNu);
  });

  // Expand the container to visibily fit it's contents
  // (with a padding of 20 pixels)
  container.fit(20);
});

// ## Asset Loading and Game Launch
// Q.load can be called at any time to load additional assets
// assets that are already loaded will be skipped
// The callback will be triggered when everything is loaded
Q.load("sprites.png, sprites.json, level1.json, level2.json, level3.json,level4.json, tiles.png, background-wall.png", function() {
  // Sprites sheets can be created manually
  Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });

  // Or from a .json asset that defines sprite locations
  Q.compileSheets("sprites.png","sprites.json");

  // Finally, call stageScene to run the game
  Q.stageScene("level1");
});

// ## Possible Experimentations:
// 
// The are lots of things to try out here.
// 
// 1. Modify level.json to change the level around and add in some more enemies.
// 2. Add in a second level by creating a level2.json and a level2 scene that gets
//    loaded after level 1 is complete.
// 3. Add in a title screen
// 4. Add in a hud and points for jumping on enemies.
// 5. Add in a `Repeater` behind the TileLayer to create a paralax scrolling effect.

});
