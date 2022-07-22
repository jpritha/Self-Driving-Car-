class Car {
    constructor(x,y,width,height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;

        this.sensor = new Sensor(this);   //Passing the car to this
        this.controls = new Controls();
    }

    update(roadBorders) {
        this.#move();  //private method: #
        this.sensor.update(roadBorders);
    } 

    #move() {
        if(this.controls.forward) {
            this.speed += this.acceleration;
        }
        if(this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        if(this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed/2) {  //it indicates car is going backwards(reverse speed)
            this.speed = -this.maxSpeed/2;
        }

        if(this.speed > 0) {
            this.speed -= this.friction;
        }
        if(this.speed < 0) {
            this.speed += this.friction; 
        }

        if(Math.abs(this.speed) < this.friction) {    //To stop the car eventually [when the car eventually slows down to the point where its speed becomes less than the friction]
            this.speed = 0;
        }

        if(this.speed != 0) {
            const flip = this.speed>0? 1 : -1;

            if(this.controls.left) {
                this.angle += 0.03*flip;
            }
            if(this.controls.right) {
                this.angle -= 0.03*flip;   
            }
        }

        this.x -= Math.sin(this.angle)*this.speed;          //According to unit circle in computer
        this.y -= Math.cos(this.angle)*this.speed;
    }
    
       //context
    draw(ctx) {
        //We save the context 
        ctx.save();
        //We translate to the point where we want the rotation to be centered at
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();

        //ctx.rect(this.x,this.y,this.width)
        ctx.rect(
            //x (x should be at the centre of the rectangle)
            -this.width/2,
            //y (y should be at the centre of the rectangle)
            -this.height/2,
            //width 
            this.width,
            //height
            this.height
        );

        ctx.fill();

        ctx.restore();

        //The car has now the responsibility to draw its own sensor(lights)
        this.sensor.draw(ctx);
    }
} 