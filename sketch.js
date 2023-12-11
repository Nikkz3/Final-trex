var PLAY = 1;
var END = 0;
var gameState = PLAY;


var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;


var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var backgroundImg
var score=0;
var jumpSound, collidedSound;


var gameOverImg,restartImg;





function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")

  backgroundImg = loadImage("backgroundImg.jpg");
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground.png");
 
  cloudImage = loadImage("cloud.png");
 
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
 
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
 
  
  
}


function setup() {
  createCanvas(windowWidth,windowHeight);
 
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.setCollider("circle",0,0,350);
  trex.debug = true
  trex.scale = 0.08;
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.shapeColor = "#f4cbaa"; 

  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
 
   gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
 
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
 
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
 
  //criar Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
 
  console.log("Olá" + 5);
 
  score = 0;
 
}


function draw() {
 
  background(backgroundImg);
  textSize(20);
  fill("black");
  text("score: "+ score,30,50);
  //exibir pontuação
  text("Pontuação: "+ score, 500,50);
 
  console.log("isto é ",gameState)
 
 
  if(gameState === PLAY){
    
    //mover o chão
    ground.velocityX = -(6 + 3*score/100);
    //pontuação
    score = score + Math.round(getFrameRate()/60);
   
    if (touches.length > 0 || keyDown("SPACE")&& trex.y >= height-120){
      jumpSound.play()
      trex.velocityY = -10;
       touches = [];
    }
   
    //pular quando a tecla espaço é pressionada
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
   
    //acrescentar gravidade
    trex.velocityY = trex.velocityY + 0.8
    trex.collide(invisibleGround);
    //gerar as nuvens
    spawnClouds();
 
    //gerar obstáculos no chão
    spawnObstacles();
   
    if(obstaclesGroup.isTouching(trex)){
        collidedSound.play();
        gameState = END;
    }
  }
   else if (gameState === END) {
     console.log("oi")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0;
     
      //mudar a animação do trex
      trex.changeAnimation("collided", trex_collided);
     
      //definir tempo de vida dos objetos do jogo para que eles nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);

    if ( touches.length>0 || keyDown("SPACE")) {
      reset();
      touches = []
    }
   }
 
 
  
  
 
 
 
  drawSprites();
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height-95,20,30);
   obstacle.setCollider('circle',0,0,45);

   obstacle.velocityX = -(6 + 3*score/100);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir dimensão e tempo de vida ao obstáculo          
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;

   //adicionar cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}


function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
   
     //atribua tempo de vida à variável
    cloud.lifetime = 300;
   
    //ajuste a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
   
    //adicionar nuvens ao grupo
   cloudsGroup.add(cloud);
    }
}




