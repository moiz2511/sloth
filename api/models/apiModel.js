'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserDataSchema = new Schema({
    user_type: {
        type: String,
    },
    name: {
        type: String,
        required: 'Kindly enter the full name'
    },
    email: {
        type: String,
        // unique: true,
        required: 'Kindly enter the email address'
    },
    store_number: {
        type: String,
    },
    servicing_dc: {
        type: String,
    },
    store_name: {
        type: String,
    },
    store_address: {
        type: String,
    },
    business_name: {
        type: String,
    },
    business_address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    zip: {
        type: String,
    },

    products_buying: {
        type: String,
    },
    Created_date: {
        type: Date,
        default: Date.now
    }
});

var UsersSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the full name'
    },
    email: {
        type: String,
        unique: true,
        required: 'Kindly enter the email address'
    },
    password: {
        type: String
    },
    Created_date: {
        type: Date,
        default: Date.now
    }
});

var FormDataSchema = new Schema({
    user_type: {
        type: String,
    },
    name: {
        type: String,
        required: 'Kindly enter the full name'
    },
    email: {
        type: String,
        // unique: true,
        required: 'Kindly enter the email address'
    },
    store_number: {
        type: String,
    },
    servicing_dc: {
        type: String,
    },
    store_name: {
        type: String,
    },
    store_address: {
        type: String,
    },
    business_name: {
        type: String,
    },
    business_address: {
        type: String,
    },

    products_buying: {
        type: String,
    },
    Created_date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('UserData', UserDataSchema);
module.exports = mongoose.model('Users', UsersSchema);
module.exports = mongoose.model('FormData', FormDataSchema);
