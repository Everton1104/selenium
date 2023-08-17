const { Builder, By, Key, until } = require("selenium-webdriver");
require("selenium-webdriver/chrome");

(async () => {
  let pivo = "Pivo";
  let nome = "numero nao identificado";
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("https://web.whatsapp.com/");
  setInterval(async () => {
    try{
      //ESPERA CONECAO DO CELULAR
      await driver.wait(until.elementLocated(By.xpath('//span[@title="' + pivo + '"]')),30000);

      //PROCURA O GRUPO COM O NOME DO PIVO
      if (await driver.findElement(By.xpath('//span[@title="' + pivo + '"]')).isDisplayed()) {
        //VAI PARA O GRUPO DE PIVO QUANDO OCIOSO
        await driver.findElement(By.xpath('//span[@title="' + pivo + '"]')).click();
      }

      // DETECTA MENSAGEM NÃO LIDA
      await driver.wait(until.elementLocated(By.xpath('//span[contains(@aria-label,"ão lida")]')),1000);
      if (await driver.findElement(By.xpath('//span[contains(@aria-label,"ão lida")]')).isDisplayed()) {
        // DETECTA MENSAGEM NÃO LIDA E ABRE A CONVERSA
        await driver.findElement(By.xpath('//span[contains(@aria-label,"ão lida")]')).click();
      }

      // PROCURA O NOME OU NUMERO DO CONTATO
      if (await driver.findElement(By.xpath('//span[@data-testid="conversation-info-header-chat-title"]')).isDisplayed()) {
        // SALVA O NOME OU NUMERO EM VARIAVEL
        nome = await driver.findElement(By.xpath('//span[@data-testid="conversation-info-header-chat-title"]')).getText();
      }

      //salvar a ultima mensagem recebida
      let msg = await driver.findElements(By.xpath('//div[contains(@data-pre-plain-text, "' + nome +'")]/div/span/span'));
      await salvar(nome, await msg[msg.length - 2].getText());
      msg = await msg[msg.length - 2].getText();
    
      ////////////////////////////////////INICIO ROTINA DE CONVERSAS////////////////////////////////////

      let msgs;
      // pegar historico de mensagens
      const fs = require("fs");  
      fs.readFile("conversas/" + nome + ".txt", async (err, his) => {
        if(!err){
          msgs = his.toString().split("{{|}}");    //msgs[msgs.length - 1] pega ultima msg. msgs[msgs.length - 2] pega a penultima. etc...
          // INICIO DO CHAT

          // RESPOSTAS DE NIVEL 2
          if(msgs[msgs.length - 2] == "MAPA"){
            fetch('https://viacep.com.br/ws/'+ msgs[msgs.length - 1] +'/json/')
                .then(response => response.json())
                  .then(async json => {
                    await sendMsg(driver, 'Endereço: ' + json.logradouro + '{{enter}}'+
                    'Bairro: ' + json.bairro + '{{enter}}'+
                    'Cidade: ' + json.localidade + '{{enter}}'+
                    'Estado: ' + json.uf + '{{enter}}'+
                    'Digite MAPA para pesquisar outro CEP ou FIM para finalizar.')
                })
                .catch(() => {sendMsg(driver, 'CEP não encontrado.')})
            return;
          }

          // RESPOSTAS DE NIVEL 1
          if(msgs[msgs.length - 1] == "MAPA"){
            await sendMsg(driver, 'Digite o CEP: {{enter}}');
            return;
          }
          if(msgs[msgs.length - 1] == "FIM"){
            salvarHistorico(nome)
            await sendMsg(driver, 'Atendimento Finalizado');
            return;
          }
          await sendMsg(driver,
            "Olá, este é o Whatsapp da Assembleia de Deus em Jundiaí {{enter}}"+
            "Ainda estamos em fase de testes, vamos retornar em breve. {{enter}}"+
            "Agradecemos seu contato. {{enter}}"+
            "Deus te abençoe. {{enter}}"+
            " {{enter}}-------------------------- {{enter}}"+
            "*Aviso:*{{enter}}"+
            "_Este WhatsApp *NÃO* recebe áudios, imagens ou ligações!_ {{enter}}"+
            "Apenas mensagens de texto."
          );
          // FIM DO CHAT
        }
      });
    }catch(err){}
  }, 3000);
})();

  ////////////////////////////////////FIM ROTINA DE CONVERSAS////////////////////////////////////
  // FAZER ROTINA QUE DETECTA CONVERSAS OCIOSAS PARA ENCERRAR O ATENDIMENTO
         

async function salvar(nome, txt) {
  const fs = require("fs");
  fs.readFile("conversas/" + nome + ".txt", (err, his) => {
    if(err){
      fs.writeFile("conversas/" + nome + ".txt", txt, () => {});
    }else{
      fs.writeFile("conversas/" + nome + ".txt", his + "{{|}}" + txt, () => {});
    }
  });
}

async function sendMsg(driver, txt) {
  await driver.wait(
      until.elementLocated(By.xpath('//div[@title="Mensagem"]')),
      5000
  );
  if(txt.split('{{enter}}').length > 1){
      txt.split('{{enter}}').forEach(async linha => {
          await driver.findElement(By.xpath('//div[@title="Mensagem"]')).sendKeys(linha + ' ', Key.SHIFT + Key.ENTER);
      });
  }else{
      await driver.findElement(By.xpath('//div[@title="Mensagem"]')).sendKeys(txt);
  }
  await driver.findElement(By.xpath('//div[@title="Mensagem"]')).sendKeys(Key.ENTER);
}

function salvarHistorico(nome) {
  const fs = require("fs");
  fs.readFile("conversas/" + nome + ".txt", (err, his) => {
    if(!err){
      var data = new Date();
      fs.writeFile("historico/" + nome + '_' + data.getDate() + '-' + (data.getMonth() + 1) + '-' + data.getFullYear() + '_' + 
      data.getHours() + '-' + data.getMinutes() + '-' + data.getSeconds() +
      ".txt", his, () => {});
    }
  });
  fs.unlink("conversas/" + nome + ".txt", () => {});
}