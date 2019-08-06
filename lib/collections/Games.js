import { Mongo } from 'meteor/mongo';

Games = new Mongo.Collection('games');

Schema.Games = new SimpleSchema({
    name: { // name of the game
        type: String,
        optional: false
    },
    url: { // url of the game avatar
        type: String,
        optional: true
    }
});

Games.attachSchema(Schema.Games);

