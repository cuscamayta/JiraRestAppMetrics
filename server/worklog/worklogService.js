'use strict'

var linq = require('node-linq').LINQ;

exports.getUserIssuesInSprint = function (data) {
    var issuesInSprintForuser = new linq(data.issues)
        .Where(function (issue) {
            return issue.fields.issuetype.name != 'Story';
        })
        .Select(function (issue) {
            return {
                key: issue.key,
                issueType: issue.fields.issuetype.name,
                parent: issue.fields.parent ? issue.fields.parent.key : issue.key,
                parentDescription: issue.fields.parent ? issue.fields.parent.fields.summary : issue.fields.summary,
                timeSpent: issue.fields.timeSpent,
                status: issue.fields.status.name,
                priority: issue.fields.priority.name,
                timeTracking: issue.fields.timetracking,
                description: issue.fields.summary,
                timeLogged: 0,
                timeLoggedLabel: '0 h'
            }
        })
    return issuesInSprintForuser.GroupBy(function (issue) {
        return issue.parent;
    });
}

exports.addWorklog = function (result) {
    var success = result == "Success" ? true : false,
        message = result == "Success" ? 'Worklog Success' : 'Error while worklogged';
    return {
        success: success,
        message: message
    };
}



