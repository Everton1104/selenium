let {By, Key, until } = require("selenium-webdriver");

let menuPrincipal = 
  "*Buscar CEP*{{enter}}"+
  "Digite seu CEP (Somente numeros):"+
  "{{enter}}_Ou digite MENU para voltar ao início._";

const cep = async (driver, msg = false)=>{
    if(msg){
        fetch('https://viacep.com.br/ws/'+ msg +'/json/')
            .then(response => response.json())
                .then(async json => {
                sendMsg(driver, 'Endereço: ' + json.logradouro + '{{enter}}'+
                'Bairro: ' + json.bairro + '{{enter}}'+
                'Cidade: ' + json.localidade + '{{enter}}'+
                'Estado: ' + json.uf + '{{enter}}'+
                'Digite MENU para voltar ao início ou um CEP para pesquisar.')
            })
            .catch(() => {sendMsg(driver, 'CEP não encontrado.')})
    }else{
        sendMsg(driver, menuPrincipal)
    }
}
module.exports = { cep }

async function sendMsg(driver, txt) {
    await driver.wait(until.elementLocated(By.xpath('//div[contains(@title, "Digite")]')),5000);
    if(txt.split('{{enter}}').length > 1){
        txt.split('{{enter}}').forEach(async linha => {
            await driver.findElement(By.xpath('//div[contains(@title, "Digite")]')).sendKeys(linha + ' ', Key.SHIFT + Key.ENTER);
        });
    }else{
        await driver.findElement(By.xpath('//div[contains(@title, "Digite")]')).sendKeys(txt);
    }
    await driver.findElement(By.xpath('//div[contains(@title, "Digite")]')).sendKeys(Key.ENTER);
}