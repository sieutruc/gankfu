import { Class } from 'meteor/jagi:astronomy';

const UserProfile = Class.create({
    name: "UserProfile",
    fields: {
        username: {
            type: String,
            optional: true
        },
        firstname: {
            type: String,
            optional: true,
            validators: [{
                type: 'regexp',
                param: /^[a-zA-Z-]{2,25}$/
            }]
        },
        lastname: {
            type: String,
            optional: true,
            validators: [{
                type: 'regexp',
                param: /^[a-zA-Z]{2,25}$/
            }]
        },
        dobtime: {
            type: Date,
            optional: true
        },
        gender: {
            type: String,
            optional: true,
            validators: [{
                type: 'choice',
                param: ['M', 'F']
            }]
        },
        avatar: {
            type: String,
            optional: true
        },
        occupation: {
            type: String,
            optional: true
        },
        phoneNumber: {
            type: Number,
            optional: true,
            validators: [{
                type: 'minLength',
                param: 7
            }, {
                type: 'maxLength',
                param: 16
            }]
        }
    }
});

const User = Class.create({
    name: 'User',
    collection: Meteor.users,
    fields: {
        createdAt: Date,
        emails: {
            type: [Object],
            default: function() {
                return [];
            }
        },
        location: {
            type: [Number],
            index: "2d",
            optional: true
        },
        profile: {
            type: UserProfile,
            default: function() {
                return {};
            }
        }
    }
});

if (Meteor.isServer) {
    User.extend({
        fields: {
            services: Object
        }
    });
}

export default User;