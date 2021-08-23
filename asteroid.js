var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });


function preload() {

    game.load.image('asteroide-amarillo', 'assets/asteroide-amarillo.png');
    game.load.image('asteroide-azul', 'assets/asteroide-azul.png');
    game.load.image('asteroide-cafe', 'assets/asteroide-cafe.png');
    game.load.image('asteroide-cielo', 'assets/asteroide-cielo.png');
    game.load.image('asteroide-naranja', 'assets/asteroide-naranja.png');
    game.load.image('background', 'assets/fondo-juego.png');
    game.load.image('menu', 'assets/menu.png');
    game.load.image('ship', 'assets/nave-jugador.png');
    
}
var w=800;
var h=400;
var asteroids;
var asteroideAmarillo;
var asteroideAzul;
var asteroideCafe;
var asteroideCielo;
var asteroideNaranja;
var background;
var cursors;
var player;
var nnNetwork,
    nnEntrenamiento,
    nnSalida,
    datosEntrenamiento = [];

var modoAuto = false, eCompleto=false;

var salida = []

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //iniciamos el background
    background =game.add.tileSprite(0, 0, 800, 600, 'background');
    cursors = game.input.keyboard.createCursorKeys();


    //Pause
    pausaL = game.add.text(w - 100, 500, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, self);
    game.input.onDown.add(mPausa, self);

    //Nuestra nave
    player = game.add.sprite(400, 300, 'ship');
    player.anchor.setTo(0.2, 0.2);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    //  Texto
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    //asteroides
    createAsteroides();

    nnNetwork = new synaptic.Architect.Perceptron(4, 6, 5, 4);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);

}

function enRedNeural(){
    var neuronalDatos = nnEntrenamiento.train(datosEntrenamiento, {
        rate: 0.0003, 
        iterations: 5000, 
        shuffle: true,
        }
    );
    console.log(neuronalDatos);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

function createAsteroides(){

    asteroideAzul = game.add.sprite(getRandomInt(0, 800), getRandomInt(0, 600), 'asteroide-azul');   
    asteroideAmarillo = game.add.sprite(getRandomInt(0, 800), getRandomInt(0, 600), 'asteroide-amarillo');   
    asteroideCafe = game.add.sprite(getRandomInt(0, 800), getRandomInt(0, 600), 'asteroide-cafe');   
    asteroideCielo = game.add.sprite(getRandomInt(0, 800), getRandomInt(0, 600), 'asteroide-cielo');   
    asteroideNaranja = game.add.sprite(getRandomInt(0, 800), getRandomInt(0, 600), 'asteroide-naranja'); 

    game.physics.arcade.enable([asteroideAzul, asteroideAmarillo, asteroideCafe, asteroideCielo, asteroideNaranja]);
    //game.physics.arcade.enable([asteroideAmarillo, asteroideCafe]);

    asteroideAmarillo.body.setCircle(20);
    
    asteroideAmarillo.body.bounce.set(1);
    asteroideAzul.body.bounce.set(1);
    asteroideCafe.body.bounce.set(1);
    asteroideCielo.body.bounce.set(1);
    asteroideNaranja.body.bounce.set(1);

    asteroideAmarillo.body.collideWorldBounds = true;
    asteroideAzul.body.collideWorldBounds = true;
    asteroideCafe.body.collideWorldBounds = true;
    asteroideCielo.body.collideWorldBounds = true;
    asteroideNaranja.body.collideWorldBounds = true;

    asteroideAmarillo.body.gravity.y = 100;
    asteroideAzul.body.gravity.y = 100;
    asteroideCafe.body.gravity.y = 100;
    asteroideCielo.body.gravity.y = 100;
    asteroideNaranja.body.gravity.y = 100;

    asteroideAmarillo.body.velocity.set(60);
    asteroideAzul.body.velocity.set(90);
    asteroideCafe.body.velocity.set(250);
    asteroideCielo.body.velocity.set(80);
    asteroideNaranja.body.velocity.set(150);
}

function izquierda(){
    
    if(player.position.x >=30) player.body.velocity.x = -250;
    else player.body.velocity.x = 0;
}

function derecha(){
    
    if(player.position.x <= 775) player.body.velocity.x = 250;
    else player.body.velocity.x = 0;

}

function arriba(){
    
    if(player.position.y >= 30) player.body.velocity.y = -250;
    else player.body.velocity.y = 0;
}

function abajo(){
    
    if(player.position.y <=570) player.body.velocity.y = 250;
    else player.body.velocity.y = 0;
}


function colisionNave(){
    var col1;
    var col2;
    var col3;
    var col4;
    var col5;
    
    col1 = game.physics.arcade.collide(asteroideAmarillo, player);
    col2 = game.physics.arcade.collide(asteroideAzul, player);
    col3 = game.physics.arcade.collide(asteroideCafe, player);
    col4 = game.physics.arcade.collide(asteroideCielo, player);
    col5 = game.physics.arcade.collide(asteroideNaranja, player);

    if(col1 || col2 || col3 || col4 || col5){
        return true;
    }

    return false;
    
}

function colisiones() {
    //colisiones entre los asteroides
    game.physics.arcade.collide(asteroideAmarillo, asteroideAzul);
    game.physics.arcade.collide(asteroideAmarillo, asteroideCafe);
    game.physics.arcade.collide(asteroideAmarillo, asteroideCielo);
    game.physics.arcade.collide(asteroideAmarillo, asteroideNaranja);
    game.physics.arcade.collide(asteroideAzul, asteroideCafe);
    game.physics.arcade.collide(asteroideAzul, asteroideCielo);
    game.physics.arcade.collide(asteroideAzul, asteroideNaranja);
    game.physics.arcade.collide(asteroideCafe, asteroideCielo);
    game.physics.arcade.collide(asteroideCafe, asteroideNaranja);
    game.physics.arcade.collide(asteroideCielo, asteroideNaranja);

}


function update(){
    player.body.velocity.setTo(0, 0);
    
    colisiones();
    var movR=0, movL=0, movU=0, movD=0;

    //colisiones de asteroides con la nave
        //Distancia nave-Amarillo
    var posxAma = asteroideAmarillo.body.x;
    var posyAma = asteroideAmarillo.body.y;

    var posxNave = player.body.x;
    var posyNave = player.body.y;

    var a = posxAma-posxNave
    var b = posyAma-posyNave

    var distAma = Math.sqrt( (a*a) + (b*b))

        //Distancia nave-Café
    var posxCafe = asteroideCafe.body.x;
    var posyCafe = asteroideCafe.body.y;

    var ca = posxCafe - posxNave;
    var cb = posyCafe - posyNave;

    var distCafe = Math.sqrt((ca*ca )+(cb*cb));
    

        //Distancia  nave-Azul
    var posxAzul = asteroideAzul.body.x;
    var posyAzul = asteroideAzul.body.y;

    var aa = posxAzul - posxNave;
    var ab = posyAzul - posyNave;

    var distAzul = Math.sqrt( (aa*aa) + (ab*ab) );

        //Distancia nave-Naranja
    var posxNaranja = asteroideNaranja.body.x;
    var posyNaranja = asteroideNaranja.body.y;

    var na = posxNaranja - posxNave;
    var nb = posyNaranja - posyNave;

    var distNaranja = Math.sqrt( (na*na) + (nb*nb));

        //Distancia nave-Cielo
    var posxCielo = asteroideCielo.body.x;
    var posyCielo = asteroideCielo.body.y;

    var cia = posxCielo - posxNave;
    var cib = posyCielo - posyNave;

    var distCielo = Math.sqrt( (cia*cia) + (cib*cib))


    //Movimientos del spaceship
    if (cursors.left.isDown) {
        movL = 1;
        izquierda();
        
    }
    if (cursors.right.isDown) {
        movR = 1;
        derecha();
    }
    if (cursors.up.isDown) {
        movU = 1;
        arriba();
    }
    if (cursors.down.isDown) {
        movD = 1;
        abajo();
    }
    


    if(colisionNave()){
        stateText.text=" \n GAME OVER ";
        stateText.visible = true;
        pausa();
    }
    

    if(distAma < 200){

        datosEntrenamiento.push({
            input: [posyNave, posxNave, posxAma, posyAma],
            output: [movL, movD, movU, movR ]
        });   
    }

    if(distCafe < 200){

        datosEntrenamiento.push({
            input: [posyNave, posxNave, posxCafe, posyCafe],
            output: [movL, movD, movU, movR ]
        });   
    }

    if(distAzul < 200){
        datosEntrenamiento.push({
            input: [posyNave, posxNave, posxAzul, posyAzul],
            output: [movL, movD, movU, movR ]
        }); 
    }

    if(distNaranja < 200){
        datosEntrenamiento.push({
            input: [posyNave, posxNave, posxNaranja, posyNaranja],
            output: [movL, movD, movU, movR ]
        }); 
    }

    if(distCielo < 200){
        datosEntrenamiento.push({
            input: [posyNave, posxNave, posxCielo, posyCielo],
            output: [movL, movD, movU, movR ]
        }); 
    }


    
    
    if(modoAuto){
        colisiones();
        if(distAma < 100){
            nnSalida = nnNetwork.activate([posxNave, posyNave, posxAma, posyAma]);
            console.log("Distancia Amarillo: "+distAma);
            console.log(`Izquierda = ${nnSalida[0]}`);
            console.log(`Derecha = ${nnSalida[3]}`);
            console.log(`Arriba = ${nnSalida[2]}`);
            console.log(`Abajo = ${nnSalida[1]}`);

            if(nnSalida[0] > nnSalida[3]) izquierda();
            if(nnSalida[1] > nnSalida[2]) abajo();
            if(nnSalida[2] > nnSalida[1]) arriba();
            if(nnSalida[3] > nnSalida[0]) derecha();
        
        }

        if(distCafe < 100){
            nnSalida = nnNetwork.activate([posxNave, posyNave, posxCafe, posyCafe]);
            console.log("Distancia Cafe: "+distCafe);
           
            console.log(`Izquierda = ${nnSalida[0]}`);
            console.log(`Derecha = ${nnSalida[3]}`);
            console.log(`Arriba = ${nnSalida[2]}`);
            console.log(`Abajo = ${nnSalida[1]}`);

            if(nnSalida[0] > nnSalida[3]) izquierda();
            if(nnSalida[1] > nnSalida[2]) abajo();
            if(nnSalida[2] > nnSalida[1]) arriba();
            if(nnSalida[3] > nnSalida[0]) derecha();
        
        }

        if(distAzul < 100){
            nnSalida = nnNetwork.activate([posxNave, posyNave, posxAzul, posyAzul]);
            console.log("Distancia Azul: "+distAzul);
            
            console.log(`Izquierda = ${nnSalida[0]}`);
            console.log(`Derecha = ${nnSalida[3]}`);
            console.log(`Arriba = ${nnSalida[2]}`);
            console.log(`Abajo = ${nnSalida[1]}`);

            if(nnSalida[0] > nnSalida[3]) izquierda();
            if(nnSalida[1] > nnSalida[2]) abajo();
            if(nnSalida[2] > nnSalida[1]) arriba();
            if(nnSalida[3] > nnSalida[0]) derecha();
        
        }

        if(distNaranja < 100){
            nnSalida = nnNetwork.activate([posxNave, posyNave, posxNaranja, posyNaranja]);  
            console.log("Distancia Naranja: "+distNaranja);
           
            console.log(`Izquierda = ${nnSalida[0]}`);
            console.log(`Derecha = ${nnSalida[3]}`);
            console.log(`Arriba = ${nnSalida[2]}`);
            console.log(`Abajo = ${nnSalida[1]}`);

            if(nnSalida[0] > nnSalida[3]) izquierda();
            if(nnSalida[1] > nnSalida[2]) abajo();
            if(nnSalida[2] > nnSalida[1]) arriba();
            if(nnSalida[3] > nnSalida[0]) derecha();
        
        }

        if(distCielo < 100){
            nnSalida = nnNetwork.activate([posxNave, posyNave, posxCielo, posyCielo]);  
            console.log("Distancia Cielo: "+distCielo);
            
            console.log(`Izquierda = ${nnSalida[0]}`);
            console.log(`Derecha = ${nnSalida[3]}`);
            console.log(`Arriba = ${nnSalida[2]}`);
            console.log(`Abajo = ${nnSalida[1]}`);

            if(nnSalida[0] > nnSalida[3]) izquierda();
            if(nnSalida[1] > nnSalida[2]) abajo();
            if(nnSalida[2] > nnSalida[1]) arriba();
            if(nnSalida[3] > nnSalida[0]) derecha();
        
        }

    }
}


function render() {
    
}


function pausa(){
    game.paused = true;
    menu = game.add.sprite(w/2,h/2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
}

function mPausa(event){
    if(game.paused){
        var menu_x1 = w/2 - 270/2, menu_x2 = w/2 + 270/2,
            menu_y1 = h/2 - 180/2, menu_y2 = h/2 + 180/2;

        var mouse_x = event.x  ,
            mouse_y = event.y  ;

        if(mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2 ){
            if(mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1 && mouse_y <=menu_y1+90){
                eCompleto=false;
                datosEntrenamiento = [];
                modoAuto = false;
                restart();
            }else if (mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1+90 && mouse_y <=menu_y2) {
                if(!eCompleto) {
                    console.log("","Entrenamiento "+ datosEntrenamiento.length +" valores" );
                    console.log(datosEntrenamiento);   
                    enRedNeural();
                    eCompleto=true;
                    player.position.x = 400;

                }
                modoAuto = true;
            }

            menu.destroy();
            restart();
            game.paused = false;

        }
    }
}

function restart() {
    asteroideAmarillo.kill();
    asteroideAzul.kill();
    asteroideCafe.kill();
    asteroideCielo.kill();
    asteroideNaranja.kill();
    createAsteroides();
    player.kill();
    player.revive();
    player.position.x = 400;
    player.position.y = 300;
    stateText.visible = false;
}
