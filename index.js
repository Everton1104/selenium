const { Builder, By, Key, until } = require('selenium-webdriver');
require("chromedriver");

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
                await driver.wait(until.elementLocated(By.xpath('//span[@data-testid="icon-unread-count"]')), 5000);
                if (await driver.findElement(By.xpath('//span[@data-testid="icon-unread-count"]')).isDisplayed()) {
                    await driver.findElement(By.xpath('//span[@data-testid="icon-unread-count"]')).click()
                }
                try {
                    await driver.wait(until.elementsLocated(By.xpath('//div[@data-testid="msg-container"]')), 5000);
                    let container = await driver.findElements(By.xpath('//div[@data-testid="msg-container"]'))
                    let msgs = await container[0].findElements(By.xpath('//div[@data-testid="msg-container"]/div[1]/div[1]/div[1]/div/span[1]/span'))// não funciona em grupos
                    console.log('penultima msg->' + await msgs[msgs.length - 2].getText());
                    console.log('ultima msg->' + await msgs[msgs.length - 1].getText());
                } catch (error) { }
            } catch (error) { }
        } catch (error) { }
    }, 5000)
})()

async function sendMsg(driver, txt) {
    setTimeout(() => { }, 500)
    await driver.wait(until.elementLocated(By.xpath('//div[@data-lexical-editor="true"]')), 5000);
    let msg = driver.findElement(By.xpath('//div[@data-lexical-editor="true"]'))
    msg.sendKeys(txt, Key.ENTER)
}
