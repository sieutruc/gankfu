import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

const Likes = new Mongo.Collection('likes');

const Like = Class.create({
    name: "Like",
    collection: Likes,
    fields: {
        userId: {
            type: String, // has to be checked for objectid
            optional: false
        },
        gameId: {
            type: String,
            optional: false
        }
    },
    indexes: {
        userLikeIndex: {
            fields: { // List of fields.
                userId: 1,
                gameId: 1
            },
            options: {
                unique: true
            }
        }
    }
});

export default Like;






