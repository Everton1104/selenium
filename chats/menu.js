const {By, Key, until } = require("selenium-webdriver");
const menu = async (driver)=>{
  // PROCURA O NOME OU NUMERO DO CONTATO
  let nome = "numero nao identificado";
  if (await driver.findElement(By.xpath('//div[@id="main"]/header/div[2]/div/div/div/span')).isDisplayed()) {
    nome = await driver.findElement(By.xpath('//div[@id="main"]/header/div[2]/div/div/div/span')).getText();
    console.log("Mensagem de " + nome);
  }
  // RECUPERA HISTORICO DE MENSAGENS
  let msgs;
  const fs = require("fs");  
  fs.readFile("conversas/" + nome + ".txt", async (err, his) => {
    if(!err){
      msgs = his.toString().split("{{|}}");    //msgs[msgs.length - 1] pega ultima msg. msgs[msgs.length - 2] pega a penultima. etc...
    }
  });
  //  PEGA A MENSAGEM QUE FOI ENVIADA
  let msg = await driver.findElements(By.xpath('//div[contains(@data-pre-plain-text, "' + nome +'")]/div/span/span'));
  msg = await msg[msg.length - 2].getText();
  await salvar(nome, await msg);
}
module.exports = { menu }

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


/*

        


        


            // INICIO DO CHAT

            // RESPOSTAS DE NIVEL 1
            if(msgs[msgs.length - 1] == "MAPA"){
                console.log("Mapa");
                await sendMsg(driver, 'Digite o CEP: {{enter}}');
                return;
              }
              if(msgs[msgs.length - 1] == "Imagem"){
                console.log("pedindo Imagem");
                await sendMsg(driver, 'Envie sua imagem.{{enter}}Caso ja tenha enviado digite Ok.');
                return;
              }
              if(msgs[msgs.length - 1] == "Ok"){
                try {
                  if (await driver.findElement(By.xpath('//img[contains(@src, "blob")]')).isDisplayed()) {
                    await salvarImg(driver, nome)
                    await sendMsg(driver, 'Imagem salva');
                    console.log("Imagem salva");
                    return;
                  }
                } catch (error) {
                  await sendMsg(driver, 'Não foi possivel salvar a imagem.');
                  return;
                }
              }
              if(msgs[msgs.length - 1] == "FIM"){
                await salvarHistorico(nome)
                await sendMsg(driver, 'Atendimento Finalizado');
                console.log("Finalizado");
                return;
              }
  
              // RESPOSTAS DE NIVEL 2
              if(msgs[msgs.length - 2] == "MAPA"){
              console.log("enviando response mapa");
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
              // MSG PADRAO
              console.log("enviando msg padrao");
              await sendMsg(driver,
                "Olá, este é o Whatsapp da Assembleia de Deus em Jundiaí {{enter}}"+
                "Ainda não estamos atendendo por essa plataforma. {{enter}}"+
                "Agradecemos seu contato. {{enter}}"+
                "Deus te abençoe. {{enter}}"+
                " {{enter}}-------------------------- {{enter}}"+
                "*Aviso:*{{enter}}"+
                "_Este WhatsApp *NÃO* recebe áudios, imagens ou ligações do WhatsApp_ {{enter}}"+
                "Apenas mensagens de texto.{{enter}}"+
                "Para mais informações ligue para 11 4586-5878."
              );
              // FIM DO CHAT




  
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
  
  async function salvarHistorico(nome) {
    const fs = require("fs");
    fs.readFile("conversas/" + nome + ".txt", (err, his) => {
      if(!err){
        var data = new Date();
        fs.writeFile("historico/" + nome + '_' + data.getDate() + '-' + (data.getMonth() + 1) + '-' + data.getFullYear() + '_' + 
        data.getHours() + '-' + data.getMinutes() + '-' + data.getUTCSeconds() +
        ".txt", his, () => {});
      }
    });
    fs.unlink("conversas/" + nome + ".txt", () => {});
  }
  
  async function salvarImg(driver, nome) {
    try {
      await driver.wait(until.elementLocated(By.xpath('//img[contains(@src, "blob")]')),5000);
      if (await driver.findElement(By.xpath('//img[contains(@src, "blob")]')).isDisplayed()) {
          let img = await driver.findElements(By.xpath('//img[contains(@src, "blob")]'));
          img[img.length -1].click();
      }
      await driver.wait(until.elementLocated(By.xpath('//span[@data-icon="download"]')),5000);
      if (await driver.findElement(By.xpath('//span[@data-icon="download"]')).isDisplayed()) {
          await driver.findElement(By.xpath('//span[@data-icon="download"]')).click();
      }
      await driver.wait(until.elementLocated(By.xpath('//span[@data-icon="x-viewer"]')),5000);
      if (await driver.findElement(By.xpath('//span[@data-icon="x-viewer"]')).isDisplayed()) {
          await driver.findElement(By.xpath('//span[@data-icon="x-viewer"]')).click();
      }
      var data = new Date();
      await salvar(nome, 'Imagem Salva -> WhatsApp Image ' +
        data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate() + ' at ' + 
        data.getHours() + '.' + data.getMinutes() + '.' + data.getUTCSeconds()
      )
    } catch (error) {
      console.log('Imagem nao encontrada');
      await sendMsg(driver, 'Imagem nao encontrada')
    }
  }
  
*/

