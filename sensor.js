class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI/2;  //45degrees

        //This is going to keep one by one array after we create them.
        this.rays = [];
        this.readings = [];          //to check on borders
        
    }

    update(roadBorders) {
        this.#castRays();
        this.readings = [];
        for(let i=0; i<this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders)
            );
        } 
    }

    #getReading(ray, roadBorders) {
        let touches = [];
        for(let i=0; i<roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if(touch) {
                touches.push(touch);
            }else {
                const offsets = touches.map(e=>e.offset);
            }
        }

        if(touches.length == 0) {      //Absolutely no touches : That means there is no reading here, we dont encounter anything with this array. 
            return null;
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
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.stroke();
        }
    }
} 