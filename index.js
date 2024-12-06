const TelegramBot = require('node-telegram-bot-api');
const categories = require('./data.json'); // Import the categories from the JSON file

const token = '7835715024:AAGWssjUiKJByf-WJdkCiVv3Zw9VroVVAs0';
const bot = new TelegramBot(token, { polling: true });

const userCategories = {};

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.trim();

    if (text === 'ចាប់ផ្តើម' || text === 'ចាប់ផ្ដើម') {
        bot.sendMessage(chatId, 'សូមស្វាគមន៍មកកាន់ Empower U bot! សូមជ្រើសរើសផ្នែកដែលអ្នកចង់ដឹងអំពីច្បាប់ការងារ:', {
            reply_markup: {
                keyboard: Object.keys(categories).map(category => [category]),
                resize_keyboard: true,
                one_time_keyboard: true
            },
        });
    } else if (categories[text]) {
        userCategories[chatId] = text;
        const { questions } = categories[text];
        const questionList = questions
            .map((q, index) => `${index + 1}. ${q.question}`)
            .join('\n');

        const questionButtons = questions.map((_, index) => [`${index + 1}`]);
        bot.sendMessage(chatId, `នេះជាសំណួរសម្រាប់ផ្នែក "${text}":\n${questionList}`, {
            reply_markup: {
                keyboard: questionButtons,
                resize_keyboard: true,
                one_time_keyboard: true
            },
        });
    } else if (/^\d+$/.test(text)) {
        const category = userCategories[chatId];
        if (category) {
            const { questions } = categories[category];
            const questionIndex = parseInt(text, 10) - 1;

            if (questions[questionIndex]) {
                const { question, answer } = questions[questionIndex];
                bot.sendMessage(chatId, `សំណួរ: \t${question}\n\nចម្លើយ: \n\t${answer}`, {
                    reply_markup: {
                        keyboard: Object.keys(categories).map(category => [category]),
                        resize_keyboard: true
                    },
                });
            } else {
                bot.sendMessage(chatId, 'លេខសំណួរមិនត្រឹមត្រូវ។ សូមជ្រើសរើសសំណួរដែលត្រឹមត្រូវ។');
            }
        } else {
            bot.sendMessage(chatId, 'សូមជ្រើសរើសផ្នែកមុនសួរសំណួរ។');
        }
    } else {
        bot.sendMessage(chatId, 'សូមបំពេញពាក្យថា "ចាប់ផ្តើម" ដើម្បីសួរសំនួរផ្សេងៗអំពីច្បាប់ការងារ។');
    }
});

console.log('Bot is running...');
