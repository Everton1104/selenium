const { Builder, By, Key, until } = require('selenium-webdriver');
require("selenium-webdriver/chrome");

(async () => {
    let pivo = 'wp-selenium'
    let driver = await new Builder().forBrowser('chrome').build()
    await driver.get('https://web.whatsapp.com/');
    setInterval(async () => {
        try {
            await driver.wait(until.elementLocated(By.xpath('//span[@title="' + pivo + '"]')), 30000);
            if (await driver.findElement(By.xpath('//span[@title="' + pivo + '"]')).isDisplayed()) {
                await driver.findElement(By.xpath('//span[@title="' + pivo + '"]')).click()
            }
            try {
                await driver.wait(until.elementLocated(By.xpath('//span[contains(@aria-label,"não lida")]')), 5000);
                if (await driver.findElement(By.xpath('//span[contains(@aria-label,"não lida")]')).isDisplayed()) {
                    await driver.findElement(By.xpath('//span[contains(@aria-label,"não lida")]')).click()
                }
                try {
                    sendMsg(driver, 'ola, eu sou o chatbot do whatsapp')
                    // await driver.wait(until.elementsLocated(By.xpath('//div[@data-testid="msg-container"]')), 5000);
                    // let container = await driver.findElements(By.xpath('//div[@data-testid="msg-container"]'))
                    // let msgs = await container[0].findElements(By.xpath('//div[@data-testid="msg-container"]/div[1]/div[1]/div[1]/div/span[1]/span'))// não funciona em grupos
                    // console.log('penultima msg->' + await msgs[msgs.length - 2].getText());
                    // console.log('ultima msg->' + await msgs[msgs.length - 1].getText());
                    // sendMsg(driver, 'ola, eu sou o chatbot do whatsapp');
                } catch (error) { }
            } catch (error) { }
        } catch (error) { }
    }, 5000)
})()


// sendMsg(driver, 'ola, eu sou o chatbot do whatsapp');
async function sendMsg(driver, txt) {
    setTimeout(() => { }, 500)
    await driver.wait(until.elementLocated(By.xpath('//div[@title="Mensagem"]')), 5000);
    let msg = driver.findElement(By.xpath('//div[@title="Mensagem"]'))
    msg.sendKeys(txt, Key.ENTER)
}
