'use strict'

var linq = require('node-linq').LINQ;

exports.getProjects = function (message, data, hasBeenLogged) {
    return {
        message: message,
        data: data,
        hasBeenLogged: hasBeenLogged
    }
}


exports.getMetricsByTypeIssue = function (issuesData) {
    var worklogs = new linq(issuesData.issues).SelectMany(function (issue) {
        return issue.fields.worklog.worklogs;
    })
    return worklogs;
}

exports.getMetricsByTypeIssue = function (issuesData) {

    var worklogs = new linq(issuesData.issues).SelectMany(function (issue) {
        return getIssuesWithWorklogTime(issue);
    })
    return worklogs;
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
    var issues = new linq(dataIssues.issues).Select(function (issue) {
        return {
            issue: getIssue(issue),
            type: issue.fields.issuetype.name,
            timeSpent: issue.fields.aggregatetimespent,
            taskParent: issue.fields.parent ? issue.fields.parent.key : ''
        }
    }).GroupBy(function (item) {
        return item.type;
    });

    return getResumeissues(issues);
}

function getResumeissues(groupIssue) {
    var issuesResume = [];
    for (var key in groupIssue) {
        var issues = groupIssue[key];
        issuesResume.push({
            issueType: key,
            issuesGroup: issues,
            countStartSprint: issues.length,
            countEndSprint: issues.length,
            timeStimate:new linq(issues).Sum(function (issue) { return issue.timeSpent; }),
            timeSpent: new linq(issues).Sum(function (issue) { return issue.timeSpent; }),
        })
    }
    return issuesResume;
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

