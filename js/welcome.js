var width = window.innerWidth;
var height = window.innerHeight;
var canvas = document.querySelector("#canvas");
var div = document.querySelectorAll('div');
for(var i=0 ; i<div.length ; i++){
	div[i].style.top = height/div.length*i + 'px';
	div[i].style.height = height/div.length + 'px';
	div[i].style.backgroundPosition = '0 ' + i*(100/div.length) + '%';
	div[i].style.marginLeft= i%2==0 ? '100%' : '-100%';
}
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");
//加背景这里
var img = new Image();
img.onload = function(){
	ctx.drawImage(img,0,0,width,height);
}

class CreateBall{
	constructor(ctx,color,arcX,arcY,r){
		this.ctx = ctx;
		this.ctx.fillStyle = color;
		this.arcX = arcX;
		this.arcY = arcY;
		this.r = r;
	}
	create(){
		this.ctx.beginPath();
		this.ctx.arc(this.arcX,this.arcY,this.r,0,Math.PI*2,false);
		this.ctx.fill();
	}
};

class CreateSpecialBall extends CreateBall{
	constructor(ctx,color,arcX,arcY,r,x,y){
		super(ctx,color,arcX,arcY,r);
		this.random = Math.random()-0.5;
		this.x = x;
		this.y = y;
	}
	create(){
		this.arcX += this.x;
		this.arcY += this.y;
		super.create();
	}
}

class CreateLine{
	constructor(ctx,x,y){
		this.ctx = ctx;
		this.x = x;
		this.y = y;
	}
	create(tarX,tarY){
		this.tarX = tarX;
		this.tarY = tarY;
		this.ctx.beginPath();
		this.ctx.strokeStyle = "rgba(129, 129, 129, 0.1)";
		this.ctx.lineWidth = 1;
		this.ctx.moveTo(this.x,this.y);
		this.ctx.lineTo(this.tarX,this.tarY);
		this.ctx.stroke();
	}
}

var ctrl = {
	ballList : [],
	ctrl1 : function(index){
		if(index.arcX<0-index.r*2 || index.arcX>width+index.r*2 || index.arcY<0-index.r*2 || index.arcY>height+index.r*2){
			index.x = -index.x;
			index.y = -index.y;
		};
	},
	ctrl2 : function(i,index,line,min,max){
		var dis = Math.sqrt((index.arcX-ctrl.ballList[i].arcX)*(index.arcX-ctrl.ballList[i].arcX) + (index.arcY-ctrl.ballList[i].arcY)*(index.arcY-ctrl.ballList[i].arcY));
		if(dis<max && dis>min){
			line.create(ctrl.ballList[i].arcX,ctrl.ballList[i].arcY);
		}
	},
	each : function(){
		var len = ctrl.ballList.length;
		var fn = [].shift.call(arguments);
		var i = [].shift.call(arguments);
		for(i+=1 ; i<len ; i++){
			fn.apply(this,[].concat.apply([i],arguments));
		}
	}
};


for(var i=0 ; i<70 ; i++){
	ctrl.ballList.push(new CreateSpecialBall(ctx,"rgba(58, 142, 255, 0.5)",Math.random()*width,Math.random()*height,Math.random()*5+1,Math.random()*2-1,Math.random()*2-1));
}

setInterval(function(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.drawImage(img,0,0,width,height);
	ctrl.ballList.forEach(function(index,i){
		ctrl.ctrl1(index);
		var line = new CreateLine(ctx,index.arcX,index.arcY);
		ctrl.each(ctrl.ctrl2,i,index,line,160,250);//数据输入
		index.create();
	});

},100);width

document.body.onmousemove = function(e){
	var x = e.clientX;
	var y = e.clientY;
	ctrl.ballList.pop();
	ctrl.ballList.push(new CreateSpecialBall(ctx,"rgba(58, 142, 255, 0.5)",x,y,0,0,0));
}


