const telegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./option')
const token = '8082186622:AAE_RxRhhgtONUA9NrPqZagrT6gojZlP3wY'

const bot = new telegramApi(token, {polling: true})

const chats = {}

const stratGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадываю рандомное значение от 0 до 9\n А ты давай угадай)');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = 1;
    await bot.sendMessage(chatId, 'Отгадай значение', gameOptions);
}

const strart = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Информация'},
        {command: '/game', description: 'Начать игру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log(msg)
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn2.combot.org/clash_royale_e353d_by_tgemodzibot/webp/0xf09fa4a9.webp')
            return bot.sendMessage(chatId, `Приветсвую в своем боте, ${msg.from.first_name}`)
        }

        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}\nТвой юз @${msg.from.username}`)
        }
        if(text === '/game'){
            return stratGame(chatId)
        }
        
        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        console.log(msg)
        if (data === '/again'){
            return stratGame(chatId)
        }
        if(data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, угадал, ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Поробуй еще раз\nВерный ответ был ${chats[chatId]}`, againOptions)
        }
    })
}

strart()