//version 1.14
console.log('running v 1.14');
var screenheight=window.innerHeight-40;
var screenwidth=window.innerWidth-40;
var shuttle;
var blackhole=[];
var iteration=1;
var numblackhole=50;
var thrustdir;
var thruststep=0;
var maxthruststep=16;
var background=[];
var ufo=new componentImg("ufo",ufoimg1,0,0,20,20,1);;
var shuttletop,shuttleflame1,shuttleflame2,shuttleflame3,shuttlereverse1,shuttlereverse2,shuttlereverse2,blackholeimg;
var ufoimg1,ufoimg2,ufoimg3,ufoimg4;
var liveswindow=document.getElementById("lives");
var scorewindow=document.getElementById("score");
var lives=3;
var fuel=100;
var score=0;
var fuelmeter=document.getElementById("fuel");

preloadimg();
window.addEventListener('keydown', function(event) {
    switch(event.keyCode) {

        case 65:
        case 37  : {
            console.log('left pressed');
            moveleft();
            break;}

        case 87:
        case 38 : {
            console.log('up pressed');
            moveup();
            break;}

        case 68:
        case 39 : {
            console.log('right pressed');
            moveright();
            break;}
        
        case 83:
        case 40 : {
            console.log('down pressed');
           movedown();
            break;}
        
        
    }
 });

function startGame() {
    shuttle = new componentImg ("shuttle",shuttletop,screenwidth/2,screenheight/2 ,158, 62,1);
    for(i=0;i<numblackhole;i++) {
        var bx=myrandom(-2*screenwidth,2*screenwidth);
        var by=myrandom(-2*screenheight,2*screenheight);
        if(distance(bx,by,screenwidth/2,screenheight/2)>150) {
            blackhole[i]= new componentImg("blackhole1",blackholeimg,bx ,by, myrandom(100,300),myrandom(50,150),1);
            } else {
                i-=1;
                
            }
    }
    var ix,iy,i=0;
    for(ix=-4*screenwidth;ix<4*screenwidth;ix+=80) 
        for(iy=-4*screenheight;iy<4*screenheight;iy+=80) {
            background[i]=new component(2, 2, "white", ix, iy);
            i+=1;
        }    
    startufo();
    
    myGameArea.start();
  }


var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width =screenwidth;
        this.canvas.height = screenheight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        var image = new Image();
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.speed=0;
    this.heading=0;
    this.startx=this.x;
    this.starty=this.y;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function componentImg(name,image,centerx, centery,width, height,mass) {
    this.name=name;
    this.speed=0;
    this.heading=0;
    this.width = width;
    this.height = height;
    this.maxwidth = width;
    this.maxheight = height;
    this.mass=mass;
    this.speedX = 0;
    this.absspeedX=0;
    this.absspeedY=0;
    this.speedY = 0;
    this.leftx = centerx-this.width/2;
    this.topy = centery-this.height/2;
    this.x = centerx;
    this.y= centery;
    this.image=image;
    this.startx=this.x;
    this.starty=this.y;
    this.update = function() {
        ctx = myGameArea.context;
      
        if(this.name=="shuttle") ctx.drawImage(this.image, -1*this.width/2,-1*this.height/2, this.width,this.height);
        else 
            ctx.drawImage(this.image, this.leftx,this.topy, this.width,this.height);
    }
    this.newPos = function() {      
        this.x += this.speedX+this.absspeedX;
        this.y += this.speedY+this.absspeedY;
        this.leftx = this.x-this.width/2;
        this.topy = this.y-this.height/2;
        
    }
}

function updateGameArea() {
    var result;
    var ranufo;
    iteration+=1;
    if(iteration%4==0) {
        ranufo=myrandom(1,4);
        switch(ranufo) {
            case 1 : {
                ufo.image=ufoimg1;
                break;
            }
            case 2 : {
                ufo.image=ufoimg2;
                break;
            }
            case 3 : {
                ufo.image=ufoimg3;
                break;
            }
            case 4 : {
                ufo.image=ufoimg4;
                break;
            }
        }

    }
    myGameArea.clear(); //note clears the screen and make the gap with time every 20 mili second
    crunchshuttle();
    gravity();
    chaseshuttle(0,0);
    for(i=0;i<blackhole.length;i++){
        blackhole[i].speedX-=shuttle.speedX;
        blackhole[i].speedY-= shuttle.speedY;
        blackhole[i].newPos();
        blackhole[i].update();
    }
    for(i=0;i<background.length;i++) {
        background[i].speedX+=-1*shuttle.speedX;
        background[i].speedY+= -1* shuttle.speedY;
        background[i].newPos();
        background[i].update();
    }
    ufo.speedY-=shuttle.speedY;
    ufo.speedX-=shuttle.speedX;
    ufovelocity();

    ufo.newPos();
    ufo.update();
    shuttle.speedY=0;
    shuttle.speedX=0;
    fuel+=.08;
    if(fuel>100) fuel=100;
    fuelmeter.value=fuel;
    pointshuttle();
    if(checkcollisionblackhole()) {
        lives-=1;
        updatestatus();
        if(lives==0){
            dead(); 
        }
        reset();
    }

    if(checkcollisionufo()) {
        score+=1;
        updatestatus();
        reset();
    }
    if(checkufolost()) {
        reset();
        updatestatus();
        if(lives==0){
            dead(); 
        }
        
    }       
}

function reset() {
    for(i=0;i<blackhole.length;i++) {
            blackhole[i].x=blackhole[i].startx;
            blackhole[i].y=blackhole[i].starty;
            blackhole[i].speedY=0;
            blackhole[i].speedX=0;
        }
            thruststep=0;
            fuel=100;
            fuelmeter.value=fuel;
        for(i=0;i<background.length;i++) {
            background[i].x=background[i].startx;
            background[i].y=background[i].starty;
            background[i].speedY=0;
            background[i].speedX=0;
        }
    ufo.speedX=0;
    ufo.speedY=0;
    startufo();
}
function updatestatus() {
    liveswindow.innerHTML="Lives: "+lives;
    scorewindow.innerHTML="Scores: "+score;
}

function startufo() {
    var option,position,startx,starty;
    
    option=myrandom(1,4);
    position=myrandom(-50,50);
    
    if(option === 1) {
        startx=screenwidth/2+position;
        starty=screenheight/2-200;
        ufo.heading=270;
    } else if(option ==3) {
        startx=screenwidth/2+position;
        starty=screenheight/2+200;
        ufo.heading=90;
    } else if(option ==2) {
        startx=screenwidth/2+200;
        starty=screenheight/2+position;
        ufo.heading=0;
    } else if(option ==4) {
        startx=screenwidth/2-200;
        starty=screenheight/2+position;
        ufo.heading=180;
    }
    ufo.x=startx;
    ufo.y=starty;
    ufo.speed=myrandom(0.5,2.5);
}
function ufovelocity() {
    ufo.heading+=myrandom(-10,10);
    ufo.absspeedX=ufo.speed*Math.cos(ufo.heading*Math.PI/180);
    ufo.absspeedY=ufo.speed*Math.sin(ufo.heading*Math.PI/180);
}
function gravity() {
    var dist,heading,acceleration;
    for(i=0;i<blackhole.length;i++) {
        dist=distance(shuttle.x,shuttle.y,blackhole[i].x,blackhole[i].y);
        
        if(dist<400) {
            acceleration=200/(dist*dist)
            var heading = Math.atan2(shuttle.y - blackhole[i].y, shuttle.x - blackhole[i].x);
            shuttle.speedX-=acceleration*Math.cos(heading);
            shuttle.speedY-=acceleration*Math.sin(heading);
            var dheading=(heading*180 / Math.PI)
        }
    }
}
function moveup() {
    usefuel(2);
    thrustdir="forward";
    thruststep=maxthruststep;
    addthrust(shuttle.heading,1);
}



function movedown() {
    usefuel(1);
    thrustdir="reverse";
    thruststep=maxthruststep;
    addthrust((shuttle.heading+180),.5);
}

function moveleft() {
    usefuel(.5);
    thrustdir="left";
    thruststep=maxthruststep;
    shuttle.heading-=4; 
    if(shuttle.heading<-180) shuttle.heading=180;
}

function moveright() {
    usefuel(.5);
    thrustdir="right";
    thruststep=maxthruststep;
    shuttle.heading+=4; 
    if(shuttle.heading>180) shuttle.heading=-180;
}

function usefuel(amount) {
    fuel-=amount;
    if(fuel>0) {fuelmeter.value=fuel;}
        else {
                lives-=1;
                updatestatus();
                if(lives==0){
                    dead(); 
                }
                reset();          
            }
}

function dead() {
    localStorage.setItem("score", score);
    window.location="./dead.html";

}
function clearmove() {
    shuttle.speedX = 0;
    shuttle.speedY = 0;
}

function addthrust(heading,power) {
    var rheading=heading*Math.PI/180;
    shuttle.speedX+=power*Math.cos(rheading);
    shuttle.speedY+=power*Math.sin(rheading);
}
function distance(x1,y1,x2,y2) {
    return (Math.sqrt((x1-x2)*(x1-x2)+((y1-y2)*(y1-y2))));
}

function pointshuttle () {

ctx.translate(shuttle.x , shuttle.y);
ctx.rotate(shuttle.heading * (Math.PI/180));
setflame();
shuttle.update();
ctx.rotate(-shuttle.heading * (Math.PI/180));
ctx.translate(-1*shuttle.x, -1*shuttle.y);

}

function chaseshuttle(i,speed) {
    if(shuttle.x<blackhole[i].x) {blackhole[i].absspeedX=-1*speed;} else {blackhole[i].absspeedX=speed;}
    if(shuttle.y<blackhole[i].y) {blackhole[i].absspeedY=-1*speed;} else {blackhole[i].absspeedY=speed;}
}
function myrandom(min,max) {
    return Math.floor((max-min+1)*Math.random())+min;
}
function crunchshuttle() {
    var mindist=10000;
    var dist;
    var mind=0;
    for(i=0;i<blackhole.length;i++) {
        dist=distance(shuttle.x,shuttle.y,blackhole[i].x,blackhole[i].y);
        if(dist<mindist) {mindist=dist;mind=i;}
    }
    

    if(mindist <100) {
        shuttle.height=shuttle.maxheight/(blackhole[mind].mass*100/mindist);
        shuttle.width=shuttle.maxwidth/(blackhole[mind].mass*100/mindist);
    }
    else {
        shuttle.height=shuttle.maxheight;
        shuttle.width=shuttle.maxwidth;
    }
}
function setflame() {
    var randimg;
    if(thruststep==0) {
        shuttle.image=shuttletop;
        return;
        }
    thruststep-=1;
    if(thruststep%4==0) return;
    if(thrustdir == "left") {
        shuttle.image=shuttleflameleft;
        return;
    }
    if(thrustdir == "right") {
        shuttle.image=shuttleflameright;
        return;
    }

    randimg= myrandom(1,3);
    if(thrustdir == "forward") {
        
         switch(randimg) {
            case 1 : {
                shuttle.image=shuttleflame1;
                break;
            }
            case 2: {
                shuttle.image=shuttleflame2;
                break;
            }
            case 3: {
                shuttle.image=shuttleflame3;
                break;
            }
        }
        return;
    }
switch(randimg) {
            case 1 : {
                shuttle.image=shuttlereverse1;
                break;
            }
            case 2: {
                shuttle.image=shuttlereverse2;
                break;
            }
            case 3: {
                shuttle.image=shuttlereverse3;
                break;
            }
        }
    
}
function checkcollisionblackhole () {
    var dist;
    
    for(i=0;i<blackhole.length;i++) {
        dist=distance(shuttle.x,shuttle.y,blackhole[i].x,blackhole[i].y);
        if(dist<20) {return true;}
    }
    return false;
    
}

function checkcollisionufo () {
    var dist;
    
    dist=distance(shuttle.x,shuttle.y,ufo.x,ufo.y);
    if(dist<70) {return true;}
    
    return false;
    
}

function checkufolost() {
    if(ufo.x<background[0].x || ufo.x>background[background.length-1].x || ufo.y<background[0].y || ufo.y>background[background.length-1].y) { 
        /*changed ufo.y>background[background.length-1 from ufo.y>background[blackhole.length-1 */
        return true;
    }
    return false;
}


function restart() {
    window.location="./index.html";
}
function preloadimg() {
    ufoimg1 = new Image();
    ufoimg1.src= "./images/ufo1.png";

    ufoimg2 = new Image();
    ufoimg2.src= "./images/ufo2.png";

    ufoimg3 = new Image();
    ufoimg3.src= "./images/ufo3.png";

    ufoimg4 = new Image();
    ufoimg4.src= "./images/ufo4.png";

    shuttletop=new Image();
    shuttletop.src="./images/shuttle-top.png";

    shuttleflame1=new Image();
    shuttleflame1.src="./images/shuttle-flame1.png";

    shuttleflame2=new Image();
    shuttleflame2.src="./images/shuttle-flame2.png";

    shuttleflame3=new Image();
    shuttleflame3.src="./images/shuttle-flame3.png";

    shuttleflameleft=new Image();
    shuttleflameleft.src="./images/shuttleLeftFlame.png";

    shuttleflameright=new Image();
    shuttleflameright.src="./images/shuttleRightFlame.png";

    shuttlereverse1=new Image();
    shuttlereverse1.src="./images/shuttle-reverse1.png";

    shuttlereverse2=new Image();
    shuttlereverse2.src="./images/shuttle-reverse3.png";

    shuttlereverse3=new Image();
    shuttlereverse3.src="./images/shuttle-reverse2.png";

    blackholeimg=new Image();
    blackholeimg.src="./images/bblackhole.png";
}