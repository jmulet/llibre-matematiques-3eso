 a=29524.5
 r=0.5
 n=6

 sum = a;
 producte = a;

for(var i=2; i<=n; i++){
	a = a*r;
	sum += a;
	producte *= a;
	console.log("a_",i,"=", a);
}

console.log("suma=", sum);
console.log("producte=", producte);
