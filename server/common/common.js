var linq = require('node-linq').LINQ,
    moment = require('moment');

var queries = {
    getIssuesField: 'https://innovision.atlassian.net/rest/api/latest/issue/createmeta',
    getProjects: 'https://innovision.atlassian.net/rest/api/latest/issue/createmeta',
    getSprintByProject: 'https://innovision.atlassian.net/rest/greenhopper/1.0/integration/teamcalendars/sprint/list?jql=project=MANRMTOOLS'
}

exports.response = function (message, data, hasBeenLogged) {
    return {
        message: message,
        data: data,
        hasBeenLogged: hasBeenLogged
    }
}


exports.getSprintDetail = function (issues) {
    if (!issues) return {};

    var sprintDetailText = new linq(issues).First().fields.customfield_10007;


    sprintDetailText = sprintDetailText[0].match(/\[(.*?)\]/).toString().replace(']', '').replace('[', '');
    if (!sprintDetailText) return {};

    var sprintDetailsList = sprintDetailText.split(','),
        sprintDetail = {};

    var items = new linq(sprintDetailsList).Select(function (data) {
        var object = data.split('=');
        sprintDetail[object[0]] = object[1];
        return sprintDetail;
    })
    sprintDetail.daysInSprint = getDatesInSprint(sprintDetail);
    sprintDetail.peopleAvailableInsprint = getPeopleAvailableInSprint(issues);
    sprintDetail.totalTimeAvailable = sprintDetail.daysInSprint.length * (sprintDetail.peopleAvailableInsprint.length * 8);
    return sprintDetail;
}



function getDatesInSprint(sprint) {
    var startDate = moment(sprint.startDate).format('YYYY-MM-DD'),
        endDate = moment(sprint.endDate).format('YYYY-MM-DD');

    var daysInSprint = moment(endDate).diff(moment(startDate), 'days');
    return getDatesWorkLogged(startDate, endDate);
}

exports.getDatesInRange = function (startDate, endDate) {
    var fromDate = moment(new Date(startDate)),
        toDate = moment(new Date(endDate));
    var datesInRange = enumerateDaysBetweenDates(fromDate, toDate);
    return datesInRange;
}


function getDatesWorkLogged(startDate, endDate) {
    var fromDate = moment(new Date(startDate)),
        toDate = moment(new Date(endDate));
    var datesSprint = enumerateDaysBetweenDates(fromDate, toDate);
    return datesSprint;
}

function enumerateDaysBetweenDates(startDate, endDate) {
    var dates = [];

    var currDate = startDate.clone().startOf('day');
    var lastDate = endDate.clone().startOf('day');

    while (currDate.add('days', 1).diff(lastDate) <= 0) {
        var currentDate = moment(currDate.clone().toDate());
        if (currentDate.day() > 0 && currentDate.day() < 6)
            dates.push(currentDate.format('YYYY-MM-DD'));
    }

    dates.push(endDate.utc().format('YYYY-MM-DD'));
    return dates;
}


function getPeopleAvailableInSprint(issues) {
    var people = new linq(issues).GroupBy(function (issue) {
        return issue.fields.assignee.key;
    });

    var peopleInSprint = [];
    for (var key in people) {
        peopleInSprint.push(key);
    }
    return peopleInSprint;
}

