'use strict';

var mongoose = require('mongoose'),
    UserData = mongoose.model('UserData'),
    Users = mongoose.model('Users');
var md5 = require('md5');


/*****************************************************************/
/************************AUTHENTICATION***************************/
/*****************************************************************/

exports.login = function (req, res) {
    if (req.body.email && req.body.password) {
        var md5pass = md5(req.body.password);

        Users.findOne({
            email: req.body.email,
            password: md5pass
        }, function (err, data) {
            var status = false,
                message = "",
                resData = null;

            if (err)
                res.send(err);
            if (data) {
                resData = data;
                status = true;
                message = "Login successfully";
            } else {
                message = "Email or password is incorrect";
            }
            res.json({
                status,
                message,
                data: resData
            });
        });
    } else {
        res.json({
            status: false,
            message: "Email and Password is required",
            data: null
        });
    }
};

exports.signup = function (req, res) {
    if (req.body.email && req.body.password && req.body.name) {
        Users.findOne({
            email: req.body.email
        }, function (err, data) {
            var status = false,
                message = "",
                resData = null;

            if (err)
                res.send(err);
            if (data) {
                res.json({
                    status,
                    message: "Email already registered",
                    data: resData
                });
            } else {
                var md5pass = md5(req.body.password);
                var postData = {
                    ...req.body,
                    password: md5pass
                };
                var new_user = new Users(postData);
                new_user.save(function (err, newUserRes) {
                    // if (err)
                    //     res.send(err);

                    if (newUserRes) {
                        resData = newUserRes;
                        status = true;
                        message = "Your account created successfully";
                    } else {
                        message = err.message;
                        resData = err;
                    }

                    res.json({
                        status,
                        message,
                        data: resData
                    });

                });
            }
        });
    } else {
        fail(res, "name,email and password fields are required");
    }
};

/*****************************************************************/
/****************************USERS********************************/
/*****************************************************************/

exports.addUserData = function (req, res) {
    var user_data = new UserData(req.body);
    user_data.save(function (err, newUserDataRes) {
        if (newUserDataRes) {
            success(res, "User Data added successfully", null);
        } else {
            fail(res, "User Data not added", null);
        }
    });
};

exports.updateUserData = function (req, res) {
    UserData.findOne({
        _id: req.body.id
    }, function (err, data) {
        // if (err)
        //     res.send(err);

        if (data) {
            var query = {_id: req.body.id};
            var newValues = {$set: req.body};
            UserData.updateOne(query, newValues, function (err, newUserDataRes) {
                if (newUserDataRes) {
                    UserData.find({}, async function (err, list) {
                        if (list) {
                            success(res, "User Data updated successfully", list);
                        } else {
                            fail(res, err.message);
                        }
                    });
                } else {
                    fail(res, err.message, err);
                }
            });
        } else {
            fail(res, "No user found with this id", null);
        }
    });
};


exports.userDataList = async function (req, res) {
    UserData.find({}, async function (err, data) {
        var status = false,
            message = "",
            resData = null;

        if (err)
            res.send(err);
        if (data) {
            resData = data;
            status = true;
        } else {
            message = "Something went wrong";
        }

        res.json({
            status,
            message,
            data: resData
        });
    });
};


exports.deleteUserData = function (req, res) {
    if (req.body.id) {
        UserData.deleteOne({_id: req.body.id}, function (err, deleteUserDataRes) {
            if (deleteUserDataRes) {
                UserData.find({}, async function (err, data) {
                    if (data) {
                        success(res, "User Data deleted successfully", data);
                    } else {
                        fail(res, err.message);
                    }
                });
            } else {
                fail(res, err.message, err);
            }
        });
    } else {
        fail(res, "id is required");
    }
};

const success = (res, message, data = null) => {
    res.json({
        status: true,
        message,
        data
    });
}

const fail = (res, message, data = null) => {
    res.json({
        status: false,
        message,
        data
    });
};
