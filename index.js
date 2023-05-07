const { Builder, By, Key, until } = require("selenium-webdriver");
require("selenium-webdriver/chrome");

(async () => {
  let pivo = "wp-selenium";
  let nome = "sem numero";
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get("https://web.whatsapp.com/");
  setInterval(async () => {
    try {
      await driver.wait(
        until.elementLocated(By.xpath('//span[@title="' + pivo + '"]')),
        30000
      );
      if (
        await driver
          .findElement(By.xpath('//span[@title="' + pivo + '"]'))
          .isDisplayed()
      ) {
        await driver
          .findElement(By.xpath('//span[@title="' + pivo + '"]'))
          .click();
      }
      try {
        await driver.wait(
          until.elementLocated(
            By.xpath('//span[contains(@aria-label,"não lida")]')
          ),
          5000
        );
        if (
          await driver
            .findElement(By.xpath('//span[contains(@aria-label,"não lida")]'))
            .isDisplayed()
        ) {
          await driver
            .findElement(By.xpath('//span[contains(@aria-label,"não lida")]'))
            .click();
        }
        try {
          if (
            await driver
              .findElement(
                By.xpath(
                  '//span[@data-testid="conversation-info-header-chat-title"]'
                )
              )
              .isDisplayed()
          ) {
            nome = await driver
              .findElement(
                By.xpath(
                  '//span[@data-testid="conversation-info-header-chat-title"]'
                )
              )
              .getText();
          }

          sendMsg(driver, "ola " + nome + ", eu sou o chatbot do whatsapp");

          let msg = await driver.findElements(
            By.xpath(
              '//div[contains(@data-pre-plain-text, "' +
                nome +
                '")]/div/span/span'
            )
          );

          //salvar a ultima mensagem recebida
          salvar(nome, await msg[msg.length - 2].getText());

          //pegar historico de mensagens
          const fs = require("fs");
          fs.readFile("conversas/" + nome + ".txt", (err, his) => {
            let msgs = his.toString().split(";");
            console.log(msgs[msgs.length - 1]);
          });
        } catch (error) {}
      } catch (error) {}
    } catch (error) {}
  }, 5000);
})();

async function sendMsg(driver, txt) {
  setTimeout(() => {}, 1000);
  await driver.wait(
    until.elementLocated(By.xpath('//div[@title="Mensagem"]')),
    5000
  );
  let msg = driver.findElement(By.xpath('//div[@title="Mensagem"]'));
  msg.sendKeys(txt, Key.ENTER);
}

async function salvar(nome, txt) {
  const fs = require("fs");
  try {
    fs.readFile("conversas/" + nome + ".txt", (err, his) => {
      fs.writeFile("conversas/" + nome + ".txt", his + ";" + txt, () => {});
    });
  } catch (error) {
    fs.writeFile("conversas/" + nome + ".txt", txt, () => {});
  }
}
