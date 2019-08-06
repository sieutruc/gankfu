
if(Meteor.isServer){
    Meteor.users._ensureIndex({location:'2dsphere'});
}


Schema.UserProfile = new SimpleSchema({
    username: {
        type: String,
        //regEx: /^[a-zA-Z-]{2,25}$/,
        optional: true
    },
    firstname: {
        type: String,
        label: "First name",
        regEx: /^[a-zA-Z-]{2,25}$/,
        optional: true
    },
    lastname: {
        type: String,
        label: "Last name",
        regEx: /^[a-zA-Z]{2,25}$/,
        optional: true
    },
    dobtime: {
        type: Date,
        label: "Date of birth",
        optional: true
    },
    gender: {
        type: String,
        label: "Gender",
        allowedValues: ['M', 'F'],
        autoform: {
            options: [
                {label: "Male", value: "M"},
                {label: "Female", value: "F"},
            ]
        },
        optional: true
    },
    avatar: {
        type: String,
        optional: true
    },
    occupation: {
        type: String,
        label: "Job",
        optional: true
    },
    phoneNumber: {
        type: Number,
        label: "Phone number",
        min: 7,
        max: 16,
        optional: true
    }
});

Schema.UserLastLogin = new SimpleSchema({
    date: {
        type: Date,
        optional: true
    },
    ipAddr: {
        type: Schema.UserLastLogin,
        optional: true
    },
    userAgent: {
        type: String,
        optional: true
    }
});

Schema.UserStatus = new SimpleSchema({
    online: {
        type: Boolean,
        optional: true
    },
    lastLogin: {
        type: Schema.UserLastLogin,
        optional: true
    },
    idle: {
        type: Boolean,
        optional: true
    },
    lastActivity: {
        type: Date,
        optional: true
    }
});



Schema.UserSettings = new SimpleSchema({
    invisible: {
        type: Boolean,
        optional: true
    }
});


Schema.locationPoint = new SimpleSchema({
	type: {
		type: String
	},
	coordinates: {
		type: [Number],
		decimal: true
	}
});

AddressSchema =new SimpleSchema({
  fullAddress: {
    type: String
  },
  lat: {
    type: Number,
    decimal: true
  },
  lng: {
    type: Number,
    decimal: true
  },
  geometry: {
    type: Object,
    blackbox: true
  },
  street: {
    type: String,
    max: 100
  },
  city: {
    type: String,
    max: 50
  },
  state: {
    type: String,
    regEx: /^A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/
  },
  zip: {
    type: String,
    regEx: /^[0-9]{5}$/
  },
  country: {
    type: String
  }
});

Schema.UserLocation = new SimpleSchema({
    country: {
        type: String,
        optional: true
    },
    state: {
        type: String,
        optional: true
    },
    city: {
        type: String,
        optional: true
    },
    streetName: {
        type: String,
        optional: true
    },
    streetNumber: {
        type: String,
        optional: true
    },
    add: {
        label: "Your location",
        type: String,
        optional: true,
       
        autoform: {
            type: 'google-places-input'
            // geopointName: "myOwnGeopointName"
        }
    },
    priv: {
        type: Number,
        optional: true
    },
});


Schema.User = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date,
        optional: true
    },
    lastseen: {
        type: Date,
        optional: true
    },
    online: {
        type: Number,
        optional: true
    },
    profile: {
        type: Schema.UserProfile,
        optional: true
    },
    visible: {
        type: Number,
        optional: true
    },
    settings: {
        type: Schema.UserSettings,
        optional: true
    },
    location: {
        type: [Number],
        decimal: true
    },
    phyAdd: {
        type: Schema.UserLocation,
        optional: true
    },

    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    status: {
        type: Schema.UserStatus,
        optional: true
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: [String],
        optional: true
    }
});

Schema.User.messages({
    "locationInvalid": "Your location is invalid",
});

Meteor.users.attachSchema(Schema.User);