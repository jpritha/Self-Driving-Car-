
const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2,canvas.width*0.9);                            
const car = new Car(road.getLaneCenter(1),100,30,50);         //x,y,width,height : where we want our car to be and how big should our car be

animate();

function animate() {
    car.update(road.borders);

    canvas.height = window.innerHeight;      //to maintain the short size of the car everytime we update 

    ctx.save();                //save() method to save the default state
    ctx.translate(0,-car.y+canvas.height*0.7);

    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();         
    //restores the most recently saved canvas state by popping the top entry in the drawing state stack. If there is no saved state, this method does nothing.
    
    requestAnimationFrame(animate);
}


