
// let nome = 'Everton Rodrigues';
// let msgs;
// const fs = require("fs");  //pegar historico de mensagens e salva em msgs
// fs.readFile("conversas/" + nome + ".txt", async (err, his) => {
//     if(!err){
//         msgs = his.toString().split("{{|}}");
//         console.log(msgs[msgs.length - 1].toString());
//     }
// });

var data = new Date();
console.log(data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds());