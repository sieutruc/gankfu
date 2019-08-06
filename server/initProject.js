Meteor.methods({
    "Game.seed": function() {

        console.log(Games.find().fetch());

        Games.remove();

        let gamesList = [{
            name:"Dota 2",
            url:"img/dota.png"
        }, {
            name:"League Of Legends",
            url:"img/lol.png"
        }, {
            name:"Starcraft II",
            url:"img/sc2.png"

        }, {
            name:"Counter Strike",
            url:"img/cs.png"

        }, {
            name:"Starcraft",
            url:"img/sc.png"

        }, {
            name:"Counter-Strike: Global Offensive",
            url:"img/global.png"

        }, {
            name:"Warcraft III",
            url:"img/war3.png"

        }, {
            name:"Counter-Strike: Source",
            url:"img/cssource.png"

        }, {
            name:"Call of Duty: Advanced Warfare",
            url:"img/cod.png"

        }, {
            name:"World of Warcraft",
            url:"img/wow.png"

        }];
        if (Games.find().count() < 10)
        {
            gamesList.forEach(gameEntry => {
                Games.insert(gameEntry);
            });
        }
    },
    "User.seed": function () {
        var chance = new Chance();
        var geo = new GeoCoder();

        Meteor.users.remove();

        if (Meteor.users.find().count() < 100) {
            for (var i = 0; i < 100; i++) {
                var gender = chance.gender(); // get only M or F
                var dob = chance.birthday({string: true, american: false, year: chance.year({min: 1970, max: 2010})});
                // ex: dobtime=610668000
                var dobtime = moment(dob, 'DD-MM-YYYY').toDate();
                var coordinates = [46.888406499999995 + (Math.random() * 2), 0.2559593 + (Math.random() * 2)];
                Meteor._sleepForMs(200);

                var locPriv = 0;
                if (i % 4 === 0)
                    locPriv = 1;
                // the reverse function fail if it cannot resolve the address, ex: a point on the sea
                // console.log(coordinates);
                var reverseCoord = (geo.reverse(coordinates[0], coordinates[1]))[0];
                //console.log(reverseCoord);
                var physicalAddr = "";
                if (reverseCoord['streetNumber'])
                    physicalAddr += reverseCoord['streetNumber'] + " ";
                if (reverseCoord['streetName'])
                    physicalAddr += reverseCoord['streetName'] + ", ";
                if (reverseCoord['city'])
                    physicalAddr += reverseCoord['city'] + ", ";
                if (reverseCoord['state'])
                    physicalAddr += reverseCoord['state'] + ", ";
                if (reverseCoord['country'])
                    physicalAddr += reverseCoord['country'];

                console.log(physicalAddr);

                Meteor.users.insert({
                    "createdAt": new Date(1372216131137),
                    "emails": [
                        {
                            "address": chance.email(),
                            "verified": false
                        }
                    ],
                    "lastseen": new Date(1473524657763),
                    "online": 1,
                    "profile": {
                        "gender": gender[0],
                        "username": "fakeUser"+i,
                        "firstname": chance.first({ gender: gender }),
                        "lastname": chance.last({ gender: gender }),
                        "dobtime": dobtime,
                        "avatar": "https://public-image-gankfu.s3-eu-west-1.amazonaws.com/users/avatars/2cpXE4o8FKqDyBWuH/avartar-1450195476031"
                    },
                    "services": {
                    },
                    "settings": {
                        "invisible": false
                    },
                    "visible": 1,
                    "location": coordinates.reverse(),
                    "phyAdd": {
                        "country": reverseCoord['country'] ,
                        "state"  : reverseCoord['state'] ,
                        "city": reverseCoord['city'],
                        "streetName": reverseCoord['streetName'] ,
                        "streetNumber": reverseCoord['streetNumber'],
                        "add" : physicalAddr,
                        "priv": locPriv
                    }
                });
            }
        }
    },
    "Like.seed": () => {
        var chance = new Chance();
        if (Likes.find().count() < 5) {
            var userCursor = Meteor.users.find();
            var gameArray = Games.find().fetch();
            var numOfGames = gameArray.length;
            userCursor.forEach(function(user) {
                var numOfLikesPerGame = chance.natural({min:1,max: 6});
                for(var i= 0; i < numOfLikesPerGame; i++) {
                    var num = chance.natural({min: 0, max: numOfGames-1});
                    // test if the user has already subribed the game
                    if (! Likes.findOne({
                            "userId": user._id,
                            "gameId": gameArray[num]._id
                        }))
                        Likes.insert({
                            "userId": user._id,
                            "gameId": gameArray[num]._id
                        });
                }
                console.log(user.profile.username);
            });
        }
    }
});