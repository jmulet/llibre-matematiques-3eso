var fs = require("fs")
var exec = require("process").exec;

var regexImg = /includegraphics\[(([^\{\}]|(R))*)\]\{(([^\{\}]|(R))*)\}/gmi;
var regexImg2 = /includegraphics\*\[(([^\{\}]|(R))*)\]\{(([^\{\}]|(R))*)\}/gmi;

function hasExt(path){
	return (path.trim()).indexOf(".")>0;
}

function doMatches(bean, tex, regex){
	var matches = regex.exec(tex);
	while(matches!==null){
		var path = matches[4].trim();
		console.log("      Found "+path );
		var n = path.indexOf("/");
		if(n>=0){
			var splits = path.split("/");
			var name = splits[1].trim();
			var isSol = splits[0].trim().toLowerCase()==="img-sol";
			var newpath =  bean.imgdir+"/"+name;

			if(!isSol){
				var reg = new RegExp(path, "gmi")
				tex = tex.replace(reg, newpath)
			}
			
		//Copy image files to newpath
		if(hasExt(name) && !isSol){
				var target = "./"+bean.imgdir+"/"+name;
				var origin = path;
				if(target!==origin){
					try{
						fs.writeFileSync(target, fs.readFileSync(origin));
						console.log("      Copying "+origin +" --->  "+target );
					} catch(ex){
						//
					}
				}
		} else if(!hasExt(name) && !isSol) {
		 
			["pdf", "jpg", "png", "tiff", "ggb", "key", "svg", "cg3", "jpeg"].forEach(function(ext){
				var target = "./"+bean.imgdir+"/"+name+"."+ext;
				var origin = path+"."+ext;
				if(target!==origin){
					try{
						fs.writeFileSync(target, fs.readFileSync(origin));
						console.log("      Copying "+origin+" --->  "+target );
					} catch(ex){
						//
					}
				}
			});	
		}

		}
		matches = regex.exec(tex);	
	}
	return tex;
}

function process(bean){

	//Read file content
	console.log("Process "+bean.file)

	var tex = fs.readFileSync("./"+bean.file, "utf-8");
 
	//seach all image tags

	tex = doMatches(bean, tex, regexImg);
	tex = doMatches(bean, tex, regexImg2);

	//seach all video tags
	//seach all videonw tags
 

	var outfile = bean.outfile? bean.outfile : bean.file;

	fs.writeFileSync(outfile, tex);

}

var createBck = false;

var jobs = [
	{file: "iesbbook.sty", imgdir: "img-base"},
	{file: "portada.tex", imgdir: "img-00"},
	{file: "chap1.tex", imgdir: "img-01"},
	{file: "chap2.tex", imgdir: "img-02"},
	{file: "chap3.tex", imgdir: "img-03"},
	{file: "chap4.tex", imgdir: "img-04"},
	{file: "chap5.tex", imgdir: "img-05"},
	{file: "chap6.tex", imgdir: "img-06"},
	{file: "chap7.tex", imgdir: "img-07"},
	{file: "chap8.tex", imgdir: "img-08"},
	{file: "chap9.tex", imgdir: "img-09"},
	{file: "chap10.tex", imgdir: "img-10"},
	{file: "chap11.tex", imgdir: "img-11"},
	{file: "sintesi.tex", imgdir: "img-12"}
]

jobs.forEach(function(e){
	var dir =  "./"+e.imgdir;
	if(!fs.existsSync(dir)){
		console.log("Creating directory ", dir);
		fs.mkdirSync(dir);
	}

 	var target =  "./bck-"+e.file;
	if(createBck && !fs.existsSync(target)){
		console.log("Creating backup ", target);
		fs.writeFileSync(target, fs.readFileSync("./"+e.file, "utf-8"));
	}

	process(e);
});



