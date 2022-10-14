'use strict';

var mongoose = require('mongoose'),
    FormData = mongoose.model('FormData');

/*****************************************************************/
/**************************** Form *******************************/
/*****************************************************************/

exports.addFormData = function (req, res) {
    var user_data = new FormData(req.body);
    user_data.save(function (err, newUserDataRes) {
        if (newUserDataRes) {
            success(res, "Form Data added successfully", null);
        } else {
            fail(res, "Form Data not added", null);
        }
    });
};

exports.updateFormData = function (req, res) {
    FormData.findOne({
        _id: req.body.id
    }, function (err, data) {
        // if (err)
        //     res.send(err);

        if (data) {
            var query = {_id: req.body.id};
            var newValues = {$set: req.body};
            FormData.updateOne(query, newValues, function (err, newUserDataRes) {
                if (newUserDataRes) {
                    FormData.find({}, async function (err, list) {
                        if (list) {
                            success(res, "Form Data updated successfully", list);
                        } else {
                            fail(res, err.message);
                        }
                    });
                } else {
                    fail(res, err.message, err);
                }
            });
        } else {
            fail(res, "No form found with this id", null);
        }
    });
};

exports.deleteFormData = function (req, res) {
    if (req.body.id) {
        FormData.deleteOne({_id: req.body.id}, function (err, deleteUserDataRes) {
            if (deleteUserDataRes) {
                FormData.find({}, async function (err, data) {
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

exports.formDataList = async function (req, res) {
    FormData.find({}, async function (err, data) {
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