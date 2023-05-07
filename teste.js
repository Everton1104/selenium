const fs = require("fs");
 
let nome = 'teste'
let txt = 'txt teste'

fs.writeFile("conversas/" + nome + ".txt", txt, ()=>{});

fs.readFile("conversas/" + nome + ".txt", (err, txt)=>{console.log(txt.toString())})
