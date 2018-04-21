var fs = require("fs");
var rmnum = require("roman-numerals");


var MAX_PAGES=162;
var OFFSET = 2;
var NOM_LLIBRE = "llibre-3ESO-color";

var pagesToEnlarge = [];
var pagesToReduce = [124];
var pagesToDoubleCol = [];
var forceOneColumn = [12, 14, 15, 49, 94, 111, 116];
var skipNotes = [8, 22, 26, 28,  32, 38, 40, 62, 44, 71, 72, 77, 88, 89, 102, 124, 134, 146, 147];
var noOutputForPages = [152]
var beforeFlow = {31: 38, 72: 48, 88:57, 89: 67};	// 32:46 premature output of {page: exer} from page and activity since exer to page-1
var laterFlow = {40:53, 146:69, 129:7, 134: 49,147:83};		//  postpone output of {page: exer} from page and activity from exer to page+1
var forceColumns = {32: {46:4}, 71:{48:3}, 72:{48:3, 51:2, 53:2, 54:3, 55:3}, 81:{26:1}, 97:{39:1, 40:1, 41:1, 42:1} };
function getForceColumns(p, i){
	var ex = null;
	var page = forceColumns[p];
	if(page){
		ex = page[i]
	}
	return ex;
}


var json = [];

try{
	var text = fs.readFileSync("studentkeys.ans", "utf-8");
	var end = text.lastIndexOf(",");
	text = "["+text.substring(0, end)+"]";
	text = text.replace(/\\/g, "\\\\");
	json = JSON.parse(text);
} catch(Ex)
{
	console.log(Ex);
	return;
}

var extra = "";
try{
	extra = fs.readFileSync("./teacher-book-extra.tex", "utf-8");
} catch(Ex){
	console.log(Ex);
	//Create empty file
	//fs.openSync("./teacher-book-extra.tex", 'w');
}

var cachePage = [];
 
var tex = [];
function preamble(tex){
	tex.push("\\documentclass{book}");
	tex.push("\\usepackage{iesbbook}  % main style");
	tex.push("\\usepackage{pdfpages}  % insert pages from external pdf");
	tex.push("\\usepackage{pax}  % recover links from inserted pdf pages");	
	tex.push("\\usepackage{numdef}  % allow to create macro names with numbers e.g. \\page128");
	//tex.push("\\let\\ofrac\\frac");
	//tex.push("\\let\\frac\\dfrac");
	//tex.push("\\usepackage{pxfonts}");
	tex.push("\\input{./teacher-book-extra}")

	//tex.push("\\geometry{a4paper,total={170mm,257mm},left=20mm,right=13mm,top=20mm,bottom=20mm}");
	//tex.push("\\usepackage[export]{adjustbox}");
	tex.push("\\newcommand{\\displaynotes}{");
 	tex.push("\\vspace*{\\fill}");
	tex.push("\\heading{Notes:}");
	tex.push("");
	tex.push("\\begin{flushright}");
		tex.push("\\begin{minipage}{0.74\\paperwidth}");
		tex.push("	\\dotfill \\par \\vspace{0.25cm}");
			
		tex.push("	\\dotfill \\par \\vspace{0.25cm}");
			
			tex.push("\\dotfill \\par \\vspace{0.25cm}");
		tex.push("\\end{minipage}");	
	tex.push("\\end{flushright}");
	tex.push("\\newpage");
    tex.push("}");


	tex.push("\\newenvironment{pagesol}[2][]{");	
	tex.push("	\\vspace*{-1.5cm}");
	tex.push("	\\begin{center}");
	tex.push("		\\ifodd#2");
	tex.push("			\\includegraphics[page=#2, scale=0.8, trim={1cm 2cm 1cm 1.8cm}, clip, frame]{"+NOM_LLIBRE+".pdf}");
	tex.push("		\\else");
	tex.push("			\\includegraphics[page=#2, scale=0.8, trim={1cm 2cm 1cm 1.8cm}, clip, frame]{"+NOM_LLIBRE+".pdf}");
	tex.push("		\\fi");
	tex.push("	\\end{center}");
	//tex.push("	\\begin{mdframed}");
	tex.push("		\\begin{minipage}{0.75\\paperwidth}");
	tex.push("			\\begin{multicols}{2}");
	tex.push("		}{");
	tex.push("		\\end{multicols}");
	tex.push("		\\end{minipage}");
	//tex.push("	\\end{mdframed}");
	//tex.push("	\\newpage");
	tex.push("}");
	tex.push("");

	tex.push("\\newenvironment{pageandsol}[3][]{");	
tex.push("\\def\\nonotes{#1}");	
  tex.push("\\includepdf[pages=#2]{"+NOM_LLIBRE+".pdf}");
  tex.push("\\newpage");
  //tex.push("\\mbox{}\\vspace{0.5cm}");
  tex.push("");
  tex.push("\\heading{Solucions de la pàgina #3:}");
//	tex.push("\\begin{blueshaded}");
	tex.push("\\normalfont");
	tex.push("	\\vspace{0.25cm}");
		tex.push("}{");
		tex.push("\\vspace{0.25cm}");
 // tex.push("\\end{blueshaded}");
 	//tex.push("\\mbox{}\\vspace{0.5cm}");
 	tex.push("");
	tex.push("}");

	tex.push("");

	tex.push("\\newenvironment{pageandsolTwo}[3][]{");	
  tex.push("\\includepdf[pages=#2]{"+NOM_LLIBRE+".pdf}");
  tex.push("\\newpage");
  //tex.push("\\mbox{}\\vspace{0.5cm}");
  tex.push("");
  tex.push("\\heading{Solucions de la pàgina #3:}");
//	tex.push("\\begin{blueshaded}");
	tex.push("\\normalfont");
	tex.push("	\\vspace{0.25cm}");
	tex.push("  \\begin{multicols}{2}")
		tex.push("}{");
		tex.push("\\end{multicols} \n \\vspace{0.25cm}");
 // tex.push("\\end{blueshaded}");
 	//tex.push("\\mbox{}\\vspace{0.5cm}");
 	tex.push("");
    //tex.push("\\newpage");
	tex.push("}");
	tex.push("");

	//tex.push("\\fontsize{10.5}{12}\\selectfont");
	tex.push("\\setlength{\\columnseprule}{0.4pt}");

	tex.push("\\begin{document}");
	tex.push("	\\thispagestyle{empty}");
	tex.push("	\\pagestyle{empty}");
};

function fixText(text){
	return text.replace(/end \{tasks\}/gi,"end{tasks}").replace(/begin \{tasks\}/gi,"begin{tasks}").replace(/euro \{\}/gi, "euro{}").replace(/infy/gi,"infty").replace(/ i /g, " \\, i \\, ").replace(/; /g, ";\\, ");
}

function handleNewItem(tex, i){
	if(!isNaN(i)){
		tex.push("\\item[\\fontfamily{phv}\\selectfont\\large\\color{blue}\\textbf{"+i+". }] \n");
	} else{
		tex.push("\\item[$\\bullet$] {\\fontfamily{phv}\\selectfont\\large\\color{blue}\\textbf{"+i+" }} \n");
	}
}

function handlePageVertical(tex, bean){
	tex.push("");
	var page = bean.p;

	if(!page){
		tex.push("	\\includepdf[pages="+bean.n+"]{"+NOM_LLIBRE+".pdf}");

		//check if extra material must be included?
		if(bean.n>OFFSET){
			var roman = rmnum.toRoman(bean.n-OFFSET).toLowerCase();
			console.log("Searching ", "{\\page"+roman+"}");
			if(extra.indexOf(("page"+roman+"}"))>=0){
				console.log("Included ", "{\\page"+roman+"}");

				tex.push("\\newpage")
				tex.push("\\page"+roman);
				tex.push("\\newpage")
			}
		}
 		return;
	} 

	console.log("Processing page "+bean.n+", ",page);

		tex.push("  \\begin{pagesol}{"+bean.n+"}");
		tex.push("  \\begin{enumerate}");
		 
		page.order.forEach(function(i, index){
			if(!i || !page.exer[i]){
				return;
			}
			if(index===1){	
				tex.push("\\begin{enumerate}");
			}
			var opts = page.exer[i].opts;
			exer = page.exer[i].answers;
			 
			if(exer.length===1){
				handleNewItem(tex, i);
				var anstext = exer[0];
				//check for errors in anstext
				anstext = anstext.replace(/end \{tasks\}/gi,"end{tasks}").replace(/begin \{tasks\}/gi,"begin{tasks}").replace(/euro \{\}/gi, "euro{}").replace(/infy/gi,"infty")  
				tex.push(anstext);
			} else {
				
				var maxtlen = 0;
				var cols = 3;
				if(opts.cols){
					cols = opts.cols;	
				} else {

				//Automatic length control
				exer.forEach(function(t){
					var ttemp = t.replace(/\\frac/gi, "").replace(/\\sqrt/gi, "").replace(/^/gi, "");
					if(ttemp.length>maxtlen){
						maxtlen = ttemp.length;
					}
				});

				if(maxtlen>50){
					cols = 2
				}
				if(cols>exer.length){
					cols = exer.length;
				}

				}

				handleNewItem(tex, i); 
			    tex.push(" \\begin{tasks}[label-format=\\bfseries\\large]("+cols+")");
				
				exer.forEach(function(t){
					var decora = "";
					if(t.length>30){
						decora = "*";
					}
					tex.push("\t \\task"+decora+" "+t);
				});

				tex.push("\\end{tasks}");
				 
			}
			if(index===0){
				tex.push(" \\end{enumerate}");				
				//tex.push(" \\end{minipage}");			
			}
		});
		
		if(Object.keys(page.exer).length>1){
			tex.push(" \\end{enumerate}");
		}
	tex.push("  \\end{pagesol}");

	tex.push("");
}
 


function handlePageSideBySide(tex, bean){
	tex.push("");
	var page = bean.p;

	if(!page){
		tex.push("	\\includepdf[pages="+bean.n+"]{"+NOM_LLIBRE+".pdf}");

		//check if extra material must be included?
		if(bean.n>OFFSET){
			var roman = rmnum.toRoman(bean.n-OFFSET).toLowerCase();
			console.log("Searching ", "{\\page"+roman+"}");
			if(extra.indexOf(("page"+roman+"}"))>=0){
				console.log("Included ", "{\\page"+roman+"}");

				tex.push("\\newpage")
				tex.push("\\page"+roman);
				tex.push("\\newpage")
			}
		}
 		return;
	} 

	var environment = "pageandsol";
	var LIMIT_CUT_TASK = 100;
	if(bean.dc){
		environment = "pageandsolTwo";
		LIMIT_CUT_TASK = 30;
	}

	var VSPACE ="0.25cm";
	if(bean.enlarge){
		VSPACE ="0.5cm";
	}

		//Sempre començar en pàgina parell per que a la dreta hi va les solucions.
		tex.push("\\clearemptydoublepage\\normalsize");
		tex.push("  \\begin{"+environment+"}{"+bean.n+"}{"+(bean.n-OFFSET)+"}");
		tex.push("  \\begin{enumerate}");
		 
		page.order.forEach(function(i, index){
			if(!i || !page.exer[i]){
				return;
			}
			if(index===1){	
				tex.push("\\begin{enumerate}");
			}
			var opts = page.exer[i].opts;
			exer = page.exer[i].answers;
			 
			if(exer.length===1){
				handleNewItem(tex, i);
				var anstext = exer[0];
				//check for errors in anstext
				anstext = fixText(anstext);
				if(!bean.dc){
					anstext = anstext.replace(/\\linebreak/," ");
				}
				tex.push(anstext);

				tex.push("\\mbox{}\\vspace{0.25cm}\n");
			} else {
				
				var maxtlen = 0;
				var cols = 3;

				if(opts.cols){
					
					cols = opts.cols;
					//if(!bean.enlarge && !bean.dc && cols==1) cols=2;

				} else {

					//Automatic length control
					exer.forEach(function(t){
						var ttemp = t.replace(/\\frac/gi, "").replace(/\\sqrt/gi, "").replace(/^/gi, "");
						if(ttemp.length>maxtlen){
							maxtlen = ttemp.length;
						}
					});

					if(maxtlen>50){
						cols = 2
					}
					if(cols>exer.length){
						cols = exer.length;
					}

				}

				if(exer.length==4 && cols==3){
					cols=2;
				}
				var nnn = getForceColumns(bean.n-OFFSET, i);
				if(nnn){
					console.log("getForceColumns ",bean.n-OFFSET, ", ", i," = ",nnn)
					cols = nnn;
				}

				handleNewItem(tex, i);
			    tex.push(" \\begin{tasks}[label-format=\\bfseries\\large]("+cols+")");
				
				exer.forEach(function(t){
					var t2= fixText(t);
					if(!bean.dc){
						t2 = t2.replace(/\\linebreak/," ");
					}
					var decora = "";
					if(t2.length>LIMIT_CUT_TASK){
						decora = "*("+(cols+1)+")";
					}
					tex.push("\t \\task"+decora+" "+t2);
				});

				tex.push("\\end{tasks}\n");
				if(!bean.reduce) tex.push("\\mbox{}\\vspace{"+VSPACE+"}")
				 
			}
			if(index===0){
				tex.push(" \\end{enumerate}\n");				
				//tex.push(" \\end{minipage}");			
			}
		});
		
		if(Object.keys(page.exer).length>1){
			tex.push(" \\end{enumerate}\n");
		}
		tex.push("  \\end{"+environment+"}\n");



	//Add extra stuff if applicable
	if(bean.n>OFFSET){
		var delta = bean.n-OFFSET;
		var roman = rmnum.toRoman(delta).toLowerCase();
		console.log("Search ",delta," : ",roman)
		if(extra.indexOf(("page"+roman+"}"))>=0){
			console.log("Found ", "{\\page"+roman+"}");

			tex.push("\\vspace{0.25cm} \\hrule \\vspace{0.25cm}")
			tex.push("\\page"+roman);
		}
	} else {
		console.log(bean.n, "<", OFFSET)
	}


	//Add notes to footpage if not disabled
	tex.push("");

   (skipNotes.indexOf(bean.n-OFFSET)>=0)?  tex.push("\\newpage") : tex.push("\\displaynotes");

	tex.push("");


}//End method handleSidebySide


//Sort answers by chapter and by page
//pages = { 8: {exercici1: {opts: {}, answers: ] } } }

var pages = {};
json.forEach(function(e){
	if(e.part){
		e.chap = e.part;
	}
}); 


function getPage(n){
	var page = pages[n]; 
	if(!page){
		pages[n] = {exer: {}, order: [] };
		page = pages[n];
	} 
	return page;
}



//Once json is completely build, then reflow activities

console.log(">>>>>>>>>>>>>>>>>>>>> MANAGE REFLOW DIRECTLY FROM JSON object");

var op = 0;
var found1, found2

json.forEach(function(e){

	if(op!=e.page){			//new page found
		found1 = false;  //afterflow
		found2 = true;	//beforeFlow
		op = e.page
	}

	var n = e.page;
	var realPage = n;
	//Reflow exercicis to previous or latter page
	var toLaterFlow = laterFlow[n];
	var toBeforeFlow = beforeFlow[n];
 

	if(toLaterFlow){
		 if(e.exer==toLaterFlow){
		 	found1  = true
		 }
		 if(found1){
		 	realPage +=1;
		 } 		
	}

	if(toBeforeFlow){
		  if(e.exer==toBeforeFlow){
		 	found2  = false
		 }
		 if(found2){
		 	realPage -=1;
		 } 		
	}

	if(n!==realPage){
		e.page = realPage;
		console.log("REFLOW RULE>> Exercice ", e.exer, " originally from page "+n+ " will be moved to page "+realPage)
	}
			 
 
});
console.log(">>>>>>>>>>>>>>>>>>>>> END MANAGE REFLOW");

console.log(">>>>>>>>>>>>>>>>>>>>> BEGIN BUILDING pages object from JSON");
json.forEach(function(e){
	 
	var page = getPage(e.page); 
	
	var exer = page.exer[e.exer];
	var order = page.exer[e.order];
	
	if(!exer){
		//Must expand answers in case of array defined by [xxx, yyy, zzz]. Note that [] are mandatory
		page.exer[e.exer] = {opts: {}, answers:[], type: e.type, id: e.id};
		page.order.push(e.exer);

		//Check if e contains opts
		if(e.opts){
			e.opts.toLowerCase().split(",").forEach(function(opt){
							var pair = opt.split("=");
							var key = (pair[0] || "").trim().toLowerCase();
							var value = pair[1].trim();	
							if(key==="cols"){
									try{
										value = parseInt(value);
									} catch(ex){
										value = 1;
									}
							}		
							page.exer[e.exer].opts[key] = value;		 
						})
		}

		var tmp = e.ans.trim();
		if(tmp.indexOf("[")===0){
			 tmp.substring(1, tmp.length-1).split(", ").forEach(function(t){
				page.exer[e.exer].answers.push(t);
			 });

		} else {
			page.exer[e.exer].answers.push(e.ans);
		}
		
	} 
});
console.log(">>>>>>>>>>>>>>>>>>>>> END BUILDING pages object");

//Get rid of no output pages
noOutputForPages.forEach(function(p){
	delete json[p];
});
preamble(tex);

for(var kk=1; kk<MAX_PAGES; kk++){
	console.log("Processing page ",kk)
	//Automaticament totes les pàgines que contenguin graphics renderitzar-les en double column

	var p = kk>=OFFSET? pages[kk-OFFSET]: null;
	var cg = false;
	if(p){
		for(var exern in p.exer){
			p.exer[exern].answers.forEach(function(a){
				if(a.indexOf("includegraphics")>=0){
					cg = true;
				}
			});
		}
	}
	var rkk = kk - OFFSET;
	//Include a new page in Vertical mode
	 handlePageSideBySide(tex, {n: kk, 
	 							p: p, 
	 							dc: (cg || pagesToDoubleCol.indexOf(rkk)>=0) && 
	 							(forceOneColumn.indexOf(rkk)<0), 
	 							reduce: pagesToReduce.indexOf(rkk)>=0, 
	 							enlarge: pagesToEnlarge.indexOf(rkk)>=0});
	 
	//Include a new page in Side by Side mode
} 
  
tex.push("\\end{document}");

console.log("Dumping generated tex file... teacher-book.tex")
fs.writeFileSync("teacher-book.tex", tex.join("\n"));
