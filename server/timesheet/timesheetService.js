'use strict';

var linq = require('node-linq').LINQ,
    utils = require('../common/utils'),
    common = require('../common/common');

exports.getTimeSheetInDates = function (data, user, startDate, endDate) {
    try {
    var workglogsByDate = getWorklogsByDate(data.issues, user),
        workingDates = common.getDatesInRange(startDate, endDate);
    return getSprintWithDatesAndWorklogs(workglogsByDate, workingDates);
    }catch (error) {
        return error;
    }
}


exports.getTimeSheetInSprint = function (data, user) {
    try{
    var sprintDetail = common.getSprintDetail(data.issues),
        workglogsByDate = getWorklogsByDate(data.issues, user);

    return getSprintWithDatesAndWorklogs(workglogsByDate, sprintDetail.daysInSprint);
    } catch (error) {
        return error;
    }
}

function getWorklogsByDate(issues, user) {
    var worklogs = new linq(issues).SelectMany(function (issue) {
        issue = getWorklogsWithParent(issue);
        return issue
    }).items;

    var workglogsByDate = new linq(worklogs).Where(function (worklog) {
        return worklog.author.key == user;
    }).GroupBy(function (worklogItem) {
        return worklogItem.updated;
    })
    return workglogsByDate;
}

function getSprintWithDatesAndWorklogs(workglogsByDate, daysInSprint) {
    var dayNumber = 0,
        user = getUserForWorklog(workglogsByDate);

    var datesWithWorklogs = new linq(daysInSprint).Select(function (day) {
        var worklogsInDate = workglogsByDate[day];
        dayNumber++;
        return {
            date: day,
            totaTimeRegister: utils.convertSecondsToTime(getTotalTimeRegister(worklogsInDate)),
            worklogs: worklogsInDate ? workglogsByDate[day] : [],
            dayNumber: dayNumber,
            dayName: utils.getDayName(day),
            timeSpentSeconds: getTotalTimeRegister(worklogsInDate),
            userAvatar: user.avatarUrls["48x48"]
        };
    });
    return datesWithWorklogs.items;
}

function getUserForWorklog(worklogs) {
    var user = {};
    for (var key in worklogs) {
        var worklogs = worklogs[key];
        if (worklogs.length) {
            user = worklogs[0];
            break;
        }
    }
    return user.author;
}


function getTotalTimeRegister(worklogs) {
    if (!worklogs) return 0;

    var totalTimeSpent = new linq(worklogs).Sum(function (worklog) {
        return worklog.timeSpentSeconds;
    });

    return totalTimeSpent;
}

function getWorklogsWithParent(issue) {
    var worklogs = new linq(issue.fields.worklog.worklogs).Map(function (worklog) {
        worklog.updated = utils.toDate(worklog.updated);
        worklog.issue = { key: issue.key, issueType: issue.fields.issuetype.name };
        return worklog;
    });
    return worklogs.items;
}

