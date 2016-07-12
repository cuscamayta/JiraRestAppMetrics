'use strict'

var linq = require('node-linq').LINQ,
    moment = require('moment'),
    utils = require('../common/utils');

exports.getProjects = function (message, data, hasBeenLogged) {
    try {
        return {
            message: message,
            data: data,
            hasBeenLogged: hasBeenLogged
        }
    }
    catch (error) {
        return error;
    }
}




exports.getMetricsByTypeIssue = function (issuesData) {

    var worklogs = new linq(issuesData.issues).SelectMany(function (issue) {
        return getIssuesWithWorklogTime(issue);
    })
    return { worklogs: worklogs, sprintDetail: getSprintDetail(issuesData.issues) };
}


exports.getMetricsByBugInPeriod = function (issuesData) {
    try {
        
        var worklogs = new linq(issuesData.issues).SelectMany(function (issue) {
            return getIssuesWithWorklogTime(issue);
        })
        console.log(worklogs);
         return { worklogs: worklogs, sprintDetail: getSprintDetail(issuesData.issues) };
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

function getIssuesWithWorklogTime(issue) {
    return {
        issueId: issue.id,
        key: issue.key,
        priority: { name: issue.fields.priority.name, iconUrl: issue.fields.priority.iconUrl },
        issueType: { name: issue.fields.issuetype.name, iconUrl: issue.fields.issuetype.iconUrl },
        project: { name: issue.fields.project.name, key: issue.fields.project.key },
        worklogs: getWorklogs(issue.fields.worklog.worklogs),
        timeSpent: issue.fields.aggregatetimespent
    }
}

function getWorklogs(worklogs) {
    var worklogs = new linq(worklogs).Select(function (worklog) {
        return {
            author: worklog.author.name,
            timeSpent: worklog.timeSpent,
            timeSpentSeconds: worklog.timeSpentSeconds
        }
    })
    return worklogs;
}

exports.getMetricsOfTimeForIssue = function (dataIssues) {
    try {

        var sprintDetail = getSprintDetail(dataIssues.issues);
        var issues = new linq(dataIssues.issues).Select(function (issue) {
            return {
                issue: getIssue(issue),
                type: issue.fields.issuetype.name,
                timeSpent: issue.fields.aggregatetimespent,
                taskParent: issue.fields.parent ? issue.fields.parent.key : '',
                timeEstimated: issue.fields.aggregatetimeoriginalestimate
            }
        }).GroupBy(function (item) {
            return item.type;
        });

        return getIssuesSummary(issues, sprintDetail.totalTimeAvailable);
    }
    catch (error) {
        // console.log(error);
        return error;
    }
}
function getIssuesSummary(groupIssue, totalTimeInTeam) {
    var summaryIssues = [];
    for (var key in groupIssue) {
        var issues = groupIssue[key];
        summaryIssues.push(getIssueSummary(issues, totalTimeInTeam, key));
    }

    return {
        issueTypeSummary: summaryIssues,
        timeNotRegisterSummary: getItemTimeNotRegister(summaryIssues, totalTimeInTeam),
        totaTimeInTeam: totalTimeInTeam
    };
}

function getIssueSummary(issues, totalTimeInTeam, issueType) {
    var timeSpent = new linq(issues).Sum(function (issue) { return issue.timeSpent; }),
        timeStimate = new linq(issues).Sum(function (issue) { return issue.timeEstimated; }),
        timeSpentInHours = timeSpent / 3600,
        timeSpentPercent = (timeSpentInHours * 100) / totalTimeInTeam
    return {
        issueType: issueType,
        issuesGroup: issues,
        countStartSprint: getIssuesOnStartSprint(issues),
        countEndSprint: getIssuesOnEndSprint(issues),
        timeStimate: timeStimate,
        timeSpent: timeSpent,
        timeSpentInHours: timeSpentInHours,
        timeSpentPercent: timeSpentPercent,
        timeSpentString: utils.convertSecondsToTime(timeSpent),
        timeStimateString: utils.convertSecondsToTime(timeStimate)
    };
}

function getItemTimeNotRegister(issues, totalTimeInTeam) {
    var totalHoursWorked = new linq(issues).Sum(function (issue) { return issue.timeSpentInHours; }),
        timeSpentInHours = totalTimeInTeam - totalHoursWorked;
    return {
        timeSpentInHours: timeSpentInHours,
        timeSpent: totalTimeInTeam - timeSpentInHours,
        timeSpentPercent: (timeSpentInHours * 100) / totalTimeInTeam
    };
}


function getIssuesOnStartSprint(issues) {
    return issues.length;
}

function getIssuesOnEndSprint(issues) {
    return issues.length;
}

function getIssue(issue) {
    return {
        key: issue.key,
        issuetype: { icon: issue.fields.issuetype.iconUrl, name: issue.fields.issuetype.name },
        assignee: issue.fields.assignee ? issue.fields.assignee.name : '',
        status: issue.fields.status.name,
        worklogs: getWorklogs(issue.fields.worklog.worklogs)
    }
}

function getWorklogs(worklogs) {
    var worklogs = new linq(worklogs).Select(function (worklog) {
        return {
            author: worklog.author.name,
            timeSpent: worklog.timeSpent,
            timeSpentSeconds: worklog.timeSpentSeconds
        };
    })
    return worklogs;
}


function getSprintDetail(issues) {
    if (issues.length > 0) {
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
        sprintDetail.startDate = moment(sprintDetail.startDate).format('DD/MM/YYYY');
        sprintDetail.endDate = moment(sprintDetail.endDate).format('DD/MM/YYYY');
        return sprintDetail;
    }
    return {};
}

function getDatesInSprint(sprint) {
    var startDate = moment(sprint.startDate).format('YYYY-MM-DD'),
        endDate = moment(sprint.endDate).format('YYYY-MM-DD');

    var daysInSprint = moment(endDate).diff(moment(startDate), 'days');
    return getDatesWorkLogged(startDate, endDate);
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
            dates.push(currentDate.format('D/M/YYYY'));
    }

    dates.push(endDate.utc().format('D/M/YYYY'));
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

