import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

const Games = new Mongo.Collection('games');


const Game = Class.create({
    name: 'Game',
    collection: Games,
    fields: {
        name: { // name of the game
            type: String,
            optional: false
        },
        url: { // url of the game avatar
            type: String,
            optional: true
        }
    }
});

export default Game;
