var moment = require('moment');

exports.convertSecondsToTime = function (timeSeconds) {
    var time = timeSeconds,
        minutes = (time % 3600) / 60,
        hours = parseInt(time / 3600);

    return hours.toString().concat('h', ' ', minutes, 'm');
}

exports.toDate = function (date) {
    return moment(date).format('YYYY-MM-DD');
}

exports.getDayName = function (date) {
    return moment(date).format('dddd');
}