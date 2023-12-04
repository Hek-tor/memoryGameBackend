const THEMES_ANIMALS = 'animals';
const THEMES_FOOD = 'food';
const THEMES_SPORTS = 'sports';

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;
var databaseURL = 'https://hectorcamachomemorycard-default-rtdb.firebaseio.com';

app.use(cors());


const animalsIcons = ['🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🐕‍🦺', '🐩', '🐺', '🦊', '🦝',
    '🐱', '🐈', '🦁', '🐅', '🐏', '🐗', '🐖', '🐄', '🐮', '🦌', '🐴', '🐆', '🦔',
    '🐑', '🐐', '🦇', '🐻', '🐨', '🐘', '🦏', '🦛', '🐭', '🐿️', '🦥', '🦨', '🦘',
    '🦡', '🦃', '🦜', '🦉', '🦆', '🦅', '🐧', '🐬', '🐸', '🐍', '🐝', '🐛', '🐌',
    '🐞', '🦗', '🦟'];

const foodIcons = ['🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🥒', '🥬', '🥦', '🧄', '🥜',
    '🌭', '🍕', '🍟', '🍔', '🥓', '🥩', '🍗', '🍖', '🧀', '🥞', '🥖', '🥐', '🍞', '🥪',
    '🌮', '🌯', '🥚', '🥗', '🍡', '🍤', '🍣', '🍙', '🍘', '🍦', '🍧', '🍩', '🍪', '🎂',
    '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '☕', '🍹', '🍺', '🥤', '🧃'];

const sportsIcons = ['🏆', '🏅', '🥇', '🥈', '⚽', '⚾', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾',
    '🥏', '🎳', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥅', '⛳', '⛸️', '🎣', '🥌', '🎯', '🪀',
    '🪁', '🎱', '🎮', '🕹️', '🎲', '🀄', '🎨', '♟️', '🧩'];

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/scores', (req, res) => {
    const url = `${databaseURL}/scores.json`;
    axios.get(url)
        .then(function (res) {
            let scores = [];
            let userData = res.data;
            for (const key in userData) {
                const score = userData[key];
                scores.push(score);
            };
            const result = scores.sort((firstItem, secondItem) => firstItem.score - secondItem.score);

            res.send(JSON.stringify(result.slice(0, 9)));
        }).catch(function (err) {
            console.warn(err);
            res.send(err);
        })
});

app.get('/cards/:difficulty/:theme', (req, res) => {
    let data = { cards: [] };

    if (req.params != null) {
        if (req.params.difficulty !== null && req.params.theme !== null) {
            let theme = req.params.theme;
            let difficulty = req.params.difficulty;
            let cards = getCards(difficulty, theme);

            cards.forEach(card => {
                data.cards.push(card);
            });

            cards.forEach(card => {
                data.cards.push(card);
            });

            shuffle(data.cards);
        };
    };
    res.send(JSON.stringify(data));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}/cards/8/food`);
});

function getCards(difficulty, theme) {
    let cards = [];
    let iconList = null;

    switch (theme) {
        case THEMES_ANIMALS:
            iconList = animalsIcons;
            break;
        case THEMES_FOOD:
            iconList = foodIcons;
            break;
        case THEMES_SPORTS:
            iconList = sportsIcons;
            break;
        default:
            break;
    };

    for (let i = 1; i <= difficulty; i++) {
        let iconIndex = getIconIndex(-1, cards, iconList.length);
        let card = { id: iconIndex, icon: iconList[iconIndex] };
        cards.push(card);
    };
    return cards;
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
};

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

function getIconIndex(iconIndex, cards, length) {
    let newIconIndex = getRandom(0, (length - 1));

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (card.id === newIconIndex) {
            return getIconIndex(-1, cards, length);
        };
    };

    if (iconIndex === newIconIndex) {
        return getIconIndex(iconIndex, cards, length);
    };
    return newIconIndex;
};