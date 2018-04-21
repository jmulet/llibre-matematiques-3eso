var chap=11;
var fs = require("fs");

var tex = fs.readFileSync("kk"+chap+".tex", "utf8");

//Neteja de coses inutils
var ind = tex.indexOf("\\begin{document}");
if(ind>=0){
	tex = tex.substring(ind);
}

var nnb = tex.match(/\\textbf{\s*}/gi) || [];
 
nnb.forEach(function(e){
	tex = tex.replace(e, " " );
})


tex = tex.replace(/\\noindent/gi, "").replace(/\\begin{quoute}/gi,"").replace(/\\end{quoute}/gi,"");
tex = tex.replace(/\\begin{enumerate}/gi, "");
tex = tex.replace(/\\end{enumerate}/gi, "");
 
 var opts = ["a)", "b)", "c)", "d)", "e)", "f)", "g)", "h)", "i)", "j)", "k)", "l)", "m)", "n)"];


//Reemplaça dels comandes rapids
console.log("search _bt");
var m;
var regex = /_bt4(.|\r\n)*?_et4/gmi;
 
while ((m = regex.exec(tex)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);

        var repl = match.replace(/\\item/gi, " ").replace("\n", "");
        opts.forEach(function(e){
        	repl = repl.replace(e, "\n\t\\task ");
        });
        repl = repl.replace(/\n\r(\t|\s*)\n\r/,"");
        tex = tex.replace(match, repl);
    });
}

regex = /_bt3(.|\r\n)*?_et3/gmi;
 
while ((m = regex.exec(tex)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);

        var repl = match.replace(/\\item/gi, " ").replace("\n", "");
        opts.forEach(function(e){
            repl = repl.replace(e, "\n\t\\task ");
        });
        repl = repl.replace(/\n\r(\t|\s*)\n\r/,"");
        tex = tex.replace(match, repl);
    });
}

regex = /_bt(.|\r\n)*?_et/gmi;
 
while ((m = regex.exec(tex)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);

        var repl = match.replace(/\\item/gi, " ").replace("\n", "");
        opts.forEach(function(e){
            repl = repl.replace(e, "\n\t\\task ");
        });
        repl = repl.replace(/\n\r(\t|\s*)\n\r/,"");
        tex = tex.replace(match, repl);
    });
}


//Processa els videos
m = null;
regex = /\\includegraphics.*{Vídeo\s*(\d*)\:}([\s\wa-z\u00E0-\u00FC]*)\r/gi;
while ((m = regex.exec(tex)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.

      //console.log(`Found match, group ${groupIndex}: ${match}`);
 		tex = tex.replace(m[0], "\\videonw{"+(m[1] || "").trim()+"}{"+(m[2] || "").trim()+"}\n");
}
tex = tex.replace(/_bl/gi, "\\begin{mylist}\n");
tex = tex.replace(/_el/gi, "\\end{mylist}\n");
tex = tex.replace(/_bte/gi, "\\begin{theorybox}\n");
tex = tex.replace(/_ete/gi, "\\end{theorybox}\n");
tex = tex.replace(/_bt4/gi, "\\begin{tasks}(4)\n");
tex = tex.replace(/_et4/gi, "\\end{tasks}\n");
tex = tex.replace(/_bt3/gi, "\\begin{tasks}(3)\n");
tex = tex.replace(/_et3/gi, "\\end{tasks}\n");
tex = tex.replace(/_bt/gi, "\\begin{tasks}(2)\n");
tex = tex.replace(/_et/gi, "\\end{tasks}\n");
tex = tex.replace(/_bai/gi, "\\begin{iniaval}\n");
tex = tex.replace(/_eai/gi, "\\end{iniaval}\n");
tex = tex.replace(/_baa/gi, "\\newpage\n\\begin{autoaval}{40}\n");
tex = tex.replace(/_eaa/gi, "\\end{autoaval}\n");
tex = tex.replace(/_ss/gi, "\\subsection{");
tex = tex.replace(/_s/gi, "\\section{");
tex = tex.replace(/\\section{ \\item \\textbf{/gi, "\\section{");
tex = tex.replace(/\\begin{document}/gi, "").replace(/\\end{document}/gi, "");
tex = tex.replace(/{tabular}/gi, "{longtable}");
tex = tex.replace(/image/gi, "img"+chap+"/image");

fs.writeFileSync("chap"+chap+".tex", tex);
