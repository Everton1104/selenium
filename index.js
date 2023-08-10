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

          switch (msg) {
            case "1":
              sendMsg(driver, 'Voce escolheu a opcao 1');
              break;
            case "2":
              sendMsg(driver, 'Voce escolheu a opcao 2');
              break;
            case "3":
              sendMsg(driver, 'Voce escolheu a opcao 3');
              break;
            case "datte".toUpperCase():
              sendMsg(driver, 'baYOOOOOOOOOOOOOOOO');
              break;
            default :
              sendMsg(driver,
                "Escolha uma das opções a baixo: {{enter}} {{enter}} "+
                "[ 1 ] teste 1.{{enter}} {{enter}}"+
                "[ 2 ] teste 2{{enter}} {{enter}}"+
                "[ 3 ] teste 3{{enter}} {{enter}}"+
                "{{enter}}" +
                "-------------------------- {{enter}} "+
                "*Atenção:*{{enter}}"+
                "_Este WhatsApp não recebe áudios, imagens ou ligações!_ {{enter}}"+
                "Apenas mensagens de texto."
              );
              break;
          }



          // let msgs;
          // const fs = require("fs");  //pegar historico de mensagens e salva em msgs
          // fs.readFile("conversas/" + nome + ".txt", (err, his) => {
          //   if(!err){
          //     msgs = his.toString().split("{{|}}");    //msgs[msgs.length - 1] pega ultima msg. msgs[msgs.length - 2] pega a penultima.
          //   }
          // });

          
          // ao terminar a conversa salvar arquivo txt de conversas em pasta de historico separada
          // depois excluir arquivo txt de conversas (colocar data no txt da conversa encerrada, que vai ficar no historico)
          // ex.: historico/+55 11 9 1234-5678_01-01-2020.txt
        } catch (error) {console.log('erro ao procurar nome do contato-> '.error);}
      } catch (error) {console.log('erro pós msg nao lida-> '.error);}
    } catch (error) {console.log('erro whatsapp nao conectado-> '.error);}
  }, 5000);
})();

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
