let cells =[];
let cellSize = 10;
let w, h;
let minSphereSize = 2;
let maxSphereSize = 60;
let rotVal = 0.8;


let img;


//setTimeout(pulse, 3000);

function pulse(){

  
  let valX = floor(random(2, 500/cellSize));
  let valY = floor(random(2,500/cellSize));
  
  for(let i = 0; i < 600/cellSize; i++){
    cells[valX+i%10][i].state = i/10;
  }
  
  
//   cells[valX][valY].size = 0;
//   cells[valX-1][valY].size = 0;
//   cells[valX+1][valY].size = 0;
   console.log("working");
  
  
  let newPause = random(1000,5000);
  
  setTimeout(pulse, newPause);

}



function preload(){

  //img = loadImage("dion2.jpg");
  //img = loadImage("hands_crowd_blue_shirt.jpg");
  // img = loadImage("obama-crowd-smaller.jpg");
   //img = loadImage("color-crowd1.jpg");
  // img = loadImage("royals.jpg");
  //  img = loadImage("crowd2.jpg");
  //img = loadImage("crowd3.jpg");

 img = loadImage("crowd4.jpg");
}



function setup() {
  createCanvas(800, 600, WEBGL);
  frameRate(5);
  
  
  
 // image(img, 0, 0);
  // translate(-width/2, -height/2);
  loadPixels();
  w = floor((width-(width/6))/cellSize);
  h = floor((height-(height/6))/cellSize);
  
  cells = new Array(w);
  
  for(let i = 0; i < cells.length; i++){
    cells[i] = new Array(h);
  }
  
    for(let x = 0; x < w; x++){
    for(let y =0; y < h; y++){ 
      cells[x][y] = new Cell(x * cellSize+cellSize/2, y * cellSize+cellSize/2, cellSize);
      }
    }
  
  
      for(let x = 0; x < w; x++){
    for(let y =0; y < h; y++){ 
      
      cells[x][y].addNeighbors(x,y);     
      cells[x][y].grabPixels(x,y);
      cells[x][y].display();
      }
    }
 
   
  //console.log(cells[20][20].neighbors);
  
  
  
  
  
  
}

function draw() {
  rotateX(rotVal);
  translate(-width/2+50, -height/2, 20);
  background(255);
  //image(img, 0, 0);
  
    let dirX = (mouseX / width - 0.5) * 2;
  let dirY = (mouseY / height - 0.5) * 2;
  
 // pointLight(255, 255, 255, 0, 0, 200);
  
    for(let x = 0; x < w; x++){
    for(let y =0; y < h; y++){ 

       cells[x][y].checkWhite();
          cells[x][y].calcAverage();
          cells[x][y].calcState();
      
       if(!cells[x][y].white){

         cells[x][y].display();
       } 
      
      }
    }
  
// rotVal+=0.01;
  
}




function Cell(x, y, size){
  this.x = x;
  this.y = y;
  this.z = -10;
  this.theta = 0;
  this.speed = random(0.0001,0.001);
  this.size = size+random(0,20);
  this.col = [];
  this.neighbors = [];
  this.nextState = (this.x/width + this.y/height) * this.size;
  this.state = this.nextState;
  this.prevState = 0;
  this.white = false;
  this.avg = 120;
  this.change = this.state-this.prevState;
  
  this.addNeighbors = function(_x, _y){
  
    //this cell is at _x, _y;
      let currentX = _x;
      let currentY = _y;
      let above = _y - 1;
      let below = _y + 1;
      let left = _x - 1;
      let right = _x +1;
      
      let rightEdge = w - 1;

      
      if(left < 0){left = rightEdge};
      if(right == w){ right = 0};
      if(above < 0){above = h -1};
      if(below == h){below = 0};  
      
      this.neighbors.push(cells[left][above]);    
      this.neighbors.push(cells[currentX][above]);
      this.neighbors.push(cells[right][above]);
      this.neighbors.push(cells[left][currentY]);
      this.neighbors.push(cells[right][currentY]);
      this.neighbors.push(cells[left][below]);
      this.neighbors.push(cells[currentX][below]);
      this.neighbors.push(cells[right][below]);
  
  }
  
  
  
  
  this.calcAverage = function(){
  
    let total  =  this.state*72;
    
    for(let i = 0; i < this.neighbors.length; i++){
      
        total+= this.neighbors[i].state;
    
    }
    
   this.avg = total/(this.neighbors.length*10);
    
  }
  
  this.checkWhite = function(){
  
   // let all = (this.state[0] + this.state[1] + this.state[2])/3;
   
    let rVal = red(this.col);
    let gVal = green(this.col);
    let bVal = blue(this.col);
    
    let allCol = rVal + gVal + bVal;
    
    if (allCol/3 > 250){
      this.white = true;
    }
    
  }
    
   this.calcState = function(){
     

     if(this.avg == maxSphereSize) {
       this.nextState = minSphereSize;
     } else if(this.avg == minSphereSize){
       this.nextState = maxSphereSize;
     } else {
       this.nextState = this.state + this.avg;
       
       if(this.prevState > minSphereSize){
         this.nextState -= this.prevState;
       }
       
       if(this.nextState > maxSphereSize){
         this.nextState = maxSphereSize;
       } else if(this.nextState < minSphereSize){
         this.nextState = minSphereSize;
       }
     }
    
       this.change = this.state-this.prevState;
     
      this.prevState = this.state;
    
      
      
  }
  
  
  this.grabPixels = function(x, y){
     
    this.cg = createGraphics(100, 100);
    this.col = img.get(x*cellSize, y*cellSize);
     this.cg.background(this.col);
      this.cg.fill(255);
      this.cg.rect(width/2, height/2, 10, 10);
    
  for(let i = 0; i < 4; i++){
    this.state[i] = this.col[i];
  }
    
      if(x == 10 && y == 10){
      console.log(this.state);
      }
  }


this.display = function(){

  this.state = this.nextState;
  this.size = this.state;
  
  
  push()
  translate(this.x + this.change*2, this.y + this.change*3, this.z+this.change);
  
  rotateZ(this.theta);
  rotateX(this.theta*2);
  
  texture(this.cg);
  noStroke();
  strokeWeight(1)
 // stroke(150,25);
  
  
  //this.size = map(this.size, 5, 50, 5, 100);
  
  if(this.state < 200){  
  sphere(this.size);
  } else {
   sphere(this.size/10);
  }
  pop();

  

this.theta+=this.speed/10;
}

  



}