function Item() {

    this.imageObj = new Image();
    this.imageObj.onload = function () {
    };
    this.imageObj.src = 'http://www.in5d.com/images/maya46.jpg';

    this.id;
    this.beginDate;
    this.endDate;
    this.title;
    this.depth;
    this.hasChildren;
    this.source;
    this.update = update;
    this.draw = draw;
    this.image;
    this.x;
    var context = Canvas.getContext();

    function update () {
        this.width = Canvas.Timescale.getWidthForRange(this.beginDate, this.endDate);
        this.height = this.width * .75;
       // this.y = 100;s
        this.x = Canvas.Timescale.getXPositionForTime(this.beginDate);
    };

    function draw () {        
        
        //context.arc(this.x + (this.width / 2), this.y, this.width, 0, Math.PI * 2, true);
        //context.lineWidth = 5;

        //// line color
        
        //context.strokeStyle = 'rgb(150,20,111)';
        //context.stroke();
        //context.rect(this.x, this.y, this.width, this.height);
        //context.stroke();
        //context.fill();

        if (this.imageObj !== undefined) {
            context.beginPath();
            context.drawImage(this.imageObj, this.x, this.y, this.width, this.height);
            context.closePath();
        }
        
        if (this.height > 100) {
            context.beginPath();
            context.rect(this.x, this.y + (this.height - 50), this.width, 50);
            context.fillStyle = 'rgba(0,0,0,0.6)';
            context.fill();
            context.closePath();

            context.beginPath();
            context.fillStyle = "white";
            context.fillText(this.title, this.x+5, (this.y + (this.height - 50)) + 16);
            context.closePath();
        }

        
    };

 
    return this;
}
