const { Builder, By, Key, until } = require("selenium-webdriver");
require("selenium-webdriver/chrome");

(async () => {
    let pivo = "Everton Rodrigues";
    let nome = "Everton Rodrigues";
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://web.whatsapp.com/");
    setInterval(async () => {
        try{
            await driver.wait(until.elementLocated(By.xpath('//span[@title="' + pivo + '"]')),30000);
            if (await driver.findElement(By.xpath('//span[@title="' + pivo + '"]')).isDisplayed()) {
                await driver.findElement(By.xpath('//span[@title="' + pivo + '"]')).click();
            }
            
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





        } catch (e) {console.log('erro-> '+e);}
    }, 30 * 1000)
})();
