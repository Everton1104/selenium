const { Builder, By, Key, until } = require("selenium-webdriver");
const { menu } = require("chats/menu.js");
let chrome = require('selenium-webdriver/chrome');
let driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options().setUserPreferences(
      { "download.default_directory": 'C:\\Users\\everton.rodrigues\\Desktop\\Program\\PHP\\selenium\\imgs\\' }
  ))
  .build();

(async () => {
  let pivo = "Pivo";
  let nome = "numero nao identificado";
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
        console.log("Nova mensagem");
        // CHAMA O MENU
        menu(driver, msgs);
      }
    }catch(err){}
  }, 5000);
})();


