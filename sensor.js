class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI/2;  //45degrees

        //This is going to keep one by one array after we create them.
        this.rays = [];
        this.readings = [];          //to check on borders         //will have value as {X,Y,offset},{},{}
        
    }
 
    update(roadBorders,traffic) {
        this.#castRays();
        this.readings = [];
        for(let i=0; i<this.rays.length; i++) {             //For each ray
            this.readings.push(             //gets value as : x, Y, offset
                this.#getReading(
                    this.rays[i], 
                    roadBorders,
                    traffic
                )    
            );
        } 
    }

    #getReading(ray,roadBorders,traffic) {
        let touches = [];
        for(let i=0; i<roadBorders.length; i++) {
            const touch = getIntersection(                      //getIntersection() returns : X, Y, offset
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if(touch) {
                touches.push(touch);
            }
        }

        if(touches.length == 0) {      //Absolutely no touches : That means there is no reading here, we dont encounter anything with this array. 
            return null;
        }else {
            const offsets = touches.map(e=>e.offset);      //offset is approx the distance from the ray to road border 
            //Minimum offset to avoid the nearest obstacle 
            const minOffset = Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
    }

    #castRays() {
        this.rays = [];
        for(let i=0; i<this.rayCount; i++) {
            //Angle of each individual Ray
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount == 1?0.5 : i/(this.rayCount-1)
            )+this.car.angle;

            const start = {x:this.car.x, y:this.car.y};
            const end = {
                x:this.car.x - Math.sin(rayAngle)*this.rayLength,
                y:this.car.y - Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push([start,end]);    //Push the start and end of rays inside the array to start a segment.
        } 
    }

    draw(ctx) {
        for(let i=0; i<this.rayCount; i++) {
            let end = this.rays[i][1];
            if(this.readings[i]) {         //If there is a reading of touch for this particular ray
                end = this.readings[i];    //{X,Y,offset}
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
} 