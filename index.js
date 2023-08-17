const { Builder, By, Key, until } = require("selenium-webdriver");
require("selenium-webdriver/chrome");

(async () => {
  let pivo = "Pivo";
  let nome = "sem numero";
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("https://web.whatsapp.com/");
  setInterval(async () => {
    try {
      await driver.wait(       //ESPERA CONECAO DO CELULAR
        until.elementLocated(By.xpath('//span[@title="' + pivo + '"]')),
        30000
      );
      if (
        await driver     //PROCURA O GRUPO COM O NOME DO PIVO
          .findElement(By.xpath('//span[@title="' + pivo + '"]'))
          .isDisplayed()
      ) {
        await driver  //VAI PARA O GRUPO DE PIVO QUANDO OCIOSO
          .findElement(By.xpath('//span[@title="' + pivo + '"]'))
          .click();
      }
      try {
        await driver.wait(  // DETECTA MENSAGEM NÃO LIDA
          until.elementLocated(
            By.xpath('//span[contains(@aria-label,"ão lida")]')
          ),
          5000
        );
        if (
          await driver   // DETECTA MENSAGEM NÃO LIDA
            .findElement(By.xpath('//span[contains(@aria-label,"ão lida")]'))
            .isDisplayed()
        ) {
          await driver   // DETECTA MENSAGEM NÃO LIDA E ABRE A CONVERSA
            .findElement(By.xpath('//span[contains(@aria-label,"ão lida")]'))
            .click();
            setTimeout(() => {}, 5000);
        }
        try {
          if (
            await driver  // PROCURA O NOME OU NUMERO DO CONTATO
              .findElement(
                By.xpath(
                  '//span[@data-testid="conversation-info-header-chat-title"]'
                )
              )
              .isDisplayed()
          ) {
            nome = await driver  // SALVA O NOME OU NUMERO EM VARIAVEL
              .findElement(
                By.xpath(
                  '//span[@data-testid="conversation-info-header-chat-title"]'
                )
              )
              .getText();
          }
          let msg = await driver.findElements( //salvar a ultima mensagem recebida 
            By.xpath('//div[contains(@data-pre-plain-text, "' + nome +'")]/div/span/span')
          );
          await salvar(nome, await msg[msg.length - 2].getText());
          msg = await msg[msg.length - 2].getText();

          ////////////////////////////////////INICIO ROTINA DE CONVERSAS////////////////////////////////////

          let msgs;
          const fs = require("fs");  // pegar historico de mensagens
          fs.readFile("conversas/" + nome + ".txt", (err, his) => {
            if(!err){
              msgs = his.toString().split("{{|}}");    //msgs[msgs.length - 1] pega ultima msg. msgs[msgs.length - 2] pega a penultima. etc...


              // INICIO DO CHAT

              // RESPOSTAS DE NIVEL 2
              if(msgs[msgs.length - 2] == "MAPA"){
                fetch('https://viacep.com.br/ws/'+ msgs[msgs.length - 1] +'/json/')
                    .then(response => response.json())
                      .then(json => {
                        sendMsg(driver, 'Endereço: ' + json.logradouro + '{{enter}}'+
                        'Bairro: ' + json.bairro + '{{enter}}'+
                        'Cidade: ' + json.localidade + '{{enter}}'+
                        'Estado: ' + json.uf + '{{enter}}'+
                        'Digite MAPA para pesquisar outro CEP ou FIM para finalizar.')
                    })
                    .catch(() => {sendMsg(driver, 'CEP não encontrado.')})
                return;
              }
              // RESPOSTAS DE NIVEL 1
              else if(msgs[msgs.length - 1] == "MAPA"){
                sendMsg(driver, 'Digite o CEP: {{enter}}');
                return;
              }else if(msgs[msgs.length - 1] == "FIM"){
                salvarHistorico(nome)
                sendMsg(driver, 'Atendimento Finalizado');
              }else{
                sendMsg(driver,
                  "Olá, este é o Whatsapp da Assembleia de Deus em Jundiaí {{enter}}"+
                  "Ainda estamos em fase de testes, vamos retornar em breve. {{enter}}"+
                  "Agradecemos seu contato. {{enter}}"+
                  "Deus te abençoe. {{enter}}"+
                  " {{enter}}-------------------------- {{enter}}"+
                  "*Aviso:*{{enter}}"+
                  "_Este WhatsApp *NÃO* recebe áudios, imagens ou ligações!_ {{enter}}"+
                  "Apenas mensagens de texto."
                );
              }

              // FIM DO CHAT



            }
          });

          ////////////////////////////////////FIM ROTINA DE CONVERSAS////////////////////////////////////

          // FAZER ROTINA QUE DETECTA CONVERSAS OCIOSAS PARA ENCERRAR O ATENDIMENTO
          
        } catch (error) {console.log('erro ao procurar nome do contato-> '.error);}
      } catch (error) {console.log('erro pós msg nao lida-> '.error);}
    } catch (error) {console.log('erro whatsapp nao conectado-> '.error);}
  }, 5000);
})();

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