class Road {
    constructor(x,width,laneCount=3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left =  x - width/2;
        this.right = x + width/2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;  //y increases downwards

        const topLeft = {x:this.left, y:this.top};
        const topRight = {x:this.right, y:this.top};
        const bottomLeft = {x:this.left, y:this.bottom};
        const bottomRight = {x:this.right, y:this.bottom};
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width/this.laneCount;
        return this.left + laneWidth/2 + 
        Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white"; //

        for(let i=1; i<=this.laneCount-1; i++) {

            const x = lerp(                             //We need to get values from left and right according to a percentage
                this.left,
                this.right,
                i/this.laneCount            //percentage
            );

            //Add dashes in the middle Line of Road
            ctx.setLineDash([20,20]);          //Our dash will be of 20 pixels and a break of 20 px and another dash and so on.

            ctx.beginPath();           // Start a new path
            ctx.moveTo(x, this.top);        // eg : ctx.moveTo(30, 50);    -> Move the pen to (30, 50)
            ctx.lineTo(x, this.bottom);     // eg : ctx.lineTo(150, 100);  -> Draw a line to (150, 100)
            ctx.stroke();              // Render the path
        }

        ctx.setLineDash([]);
        this.borders.forEach(border=>{         //To draw straight borders on both side of road
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }
}

