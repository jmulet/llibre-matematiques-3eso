var dia =0;
var h=17;
var m=30;

var dh=1;
var dm=27;


for(var i=1; i<332; i++){
	
	h +=dh;
	m +=dm;

	if(m>60){
		m -= 60;
		h += 1;
	}

	if(h>24){
		dia +=1;
		h -= 24;
	}

	console.log("Orbita ",i, " dia ", dia, " ",h,":",m)
}