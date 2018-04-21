//Calcula l'area de poligons regulars

var c=60
var n=6 

var alf = 180/n;

function toRad(x){
	return x*Math.PI/180.0;
}

var ap = 0.5*c / Math.tan(toRad(alf))
var r = 0.5*c / Math.sin(toRad(alf))

var per = n*c;

var area = per*ap/2;

console.log("Apotema=", ap);
console.log("Radi=", r);
console.log("Perimetre=", per);
console.log("area=", area);

