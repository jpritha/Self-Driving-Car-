class Car {
    constructor(x,y,width,height,controlType,maxSpeed=3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        if(controlType == "KEYS") {
            this.sensor = new Sensor(this);   //Passing the car to this
        }

        this.controls = new Controls(controlType);
    }

    update(roadBorders,traffic) {     //traffic: array of other dummy cars
        if(!this.damaged) {
            this.#move();  //private method: #
            this.polygon = this.#createPolygon();  //Corner points of car
            this.damaged = this.#assessDamage(roadBorders,traffic);
        }
        if(this.sensor) {    //this.sensor exists only if the controlType : "KEY"
            this.sensor.update(roadBorders,traffic);        //roadBorders is a matrix containg the border values of road
        }
    } 

    #assessDamage(roadBorders,traffic) {
        for(let i=0; i<roadBorders.length; i++) {
            if(polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for(let i=0; i<traffic.length; i++) {
            if(polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    #createPolygon() {             //corners of car
        const points = [];         //point for corners of car
        const rad = Math.hypot(this.width, this.height)/2;    //radius

        //arc tangent method to find out the angle between the radius and the height.
        const alpha = Math.atan2(this.width, this.height);   
        points.push({
            x : this.x - Math.sin(this.angle-alpha)*rad ,
            y : this.y - Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x : this.x - Math.sin(this.angle+alpha)*rad ,
            y : this.y - Math.cos(this.angle+alpha)*rad
        });  
        points.push({
            x : this.x - Math.sin(Math.PI+this.angle-alpha)*rad ,
            y : this.y - Math.cos(Math.PI+this.angle-alpha)*rad
        });  
        points.push({
            x : this.x - Math.sin(Math.PI+this.angle+alpha)*rad ,
            y : this.y - Math.cos(Math.PI+this.angle+alpha)*rad
        });  
        return points;                            
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
        // //We save the context 
        // ctx.save();
        // //We translate to the point where we want the rotation to be centered at
        // ctx.translate(this.x, this.y);
        // ctx.rotate(-this.angle);

        // ctx.beginPath();

        // //ctx.rect(this.x,this.y,this.width)
        // ctx.rect(
        //     //x (x should be at the centre of the rectangle)
        //     -this.width/2,
        //     //y (y should be at the centre of the rectangle)
        //     -this.height/2,
        //     //width 
        //     this.width,
        //     //height
        //     this.height
        // );

        // ctx.fill();

        // ctx.restore();
        if(this.damaged) {
            ctx.fillStyle = "gray";
        }else {
            ctx.fillStyle = "black";
        }

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1; i<this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        //The car has now the responsibility to draw its own sensor(lights)
        if(this.sensor) {
            this.sensor.draw(ctx);
        }
    }
} 