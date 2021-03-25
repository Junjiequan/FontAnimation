//setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = 50;
let adjustY = 0;

//handle mouse
const mouse = {
    x: null,
    y: null, 
    radius: 50
}
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;  //default X coordinate
    mouse.y = event.y;  //default Y coordinate
});
ctx.fillStyle = 'white';
ctx.font = '2rem  Kanit';
ctx.fillText("Hard" , 10, 100);  // font, x-position,y-position
// ctx.strokeStyle = 'white'; //storke is border?
// ctx.strokeRect(10,0,240,200);
const textCoordinates = ctx.getImageData(0,50,200,200);  // x-pos, y-pos, width, height

class Particle{
    constructor(x, y){   // constructor creates new blank object. its like blue print
         this.x = x;
         this.y = y;
         this.size = 3;
         this.baseX = this.x;
         this.baseY = this.y;
         this.density = (Math.random() * 40) + 5;
    };
    draw(){
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
       let dx = mouse.x - this.x;   //X-distance between particle and mouse
       let dy = mouse.y - this.y;   // same
       let distance = Math.sqrt(dx * dx + dy * dy);
       let forceDirectionX = dx / distance;
       let forceDirectionY = dy / distance;
       let maxDistance = mouse.radius;
       let force = (maxDistance - distance) / maxDistance;
       let directionX = forceDirectionX * force * this.density;
       let directionY = forceDirectionY * force * this.density;
       if( distance < mouse.radius){
           this.x = this.x - directionX;
           this.y = this.y - directionY ; 
       } else {
           if(this.x !== this.baseX){
               let dx = this.x - this.baseX;
               this.x = this.x - dx/3;   // number is speed
           }
           if(this.y !== this.baseY){
               let dy = this.y - this.baseY;
               this. y = this.y - dy/7;
           }
       }
   }
}
//shape
function init(){
    particleArray = [];
    for (let y = 0, y2 = textCoordinates.height ; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if(textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 10, positionY * 10));
            }
        }
    }
}
init();

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i =0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    effect();
    requestAnimationFrame(animate);
}
animate() 

function effect(){
    let opacityValue = 1;
    for(let x = 0; x < particleArray.length; x++){
        for(let y = x; y < particleArray.length; y++){
            let dx = particleArray[x].x - particleArray[y].x;
            let dy = particleArray[x].y - particleArray[y].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < 15){
                opacityValue = 2 - (distance/15);
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue +')'; 
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[x].x, particleArray[x].y);
                ctx.lineTo(particleArray[y].x, particleArray[y].y);
                ctx.stroke();
            }
        }
    }
}
