'use strict'

var linq = require('node-linq').LINQ;

exports.getProjects = function(projectData) {
    var projects = projectData ? new linq(projectData.projects).Select(function(project) {
        return { name: project.name, key: project.key, issuetypes: getIssueTypes(project.issuetypes) };
    }) : [];
    return projects;
}

exports.getSprints = function(sprintsData) {
    var sprints = sprintsData ? new linq(sprintsData.sprints)
        .OrderBy(function(sprint) { return sprint.id })
        .Select(function(sprint) {
            return { id: sprint.id, name: sprint.name };
        }) : [];
    return sprints;
}

function getIssueTypes(dataIssueTypes) {
    var issueTypes = dataIssueTypes ? new linq(dataIssueTypes).Select(function(issueType) {
        return { id: issueType.id, name: issueType.name };
    }) : [];
    return issueTypes;
}

exports.getProjectVersions = function(dataProjects) {
    var projectVersions = dataProjects ? new linq(dataProjects).Select(function(projectVersion) {
        return { id: projectVersion.id, name: projectVersion.name };
    }) : [];
    return projectVersions;
}

function getTimeWorkLogs(worklogs) {
    var worklogsResult = new linq(worklogs.items)
        .OrderBy(function(worklog) { return worklog.updateAuthor.name })
        .Select(function(worklog) {
            return {
                timeSpentSeconds: worklog.timeSpentSeconds,
                userId: worklog.updateAuthor.name,
                userName: worklog.author.displayName,
                userUrl: worklog.author.avatarUrls["48x48"]
            };
        });
    return worklogsResult;
}

exports.getTimebyDeveloper = function(issues) {
    var workLogs = issues ? new linq(issues).SelectMany(function(issue) {
        return issue.fields.worklog.worklogs;
    }) : [];
    var workLogsByUserId = getTimeWorkLogs(workLogs);

    var workLogsResume = [];
    var userId = "", userName = "", userUrl = "";
    var time = 0, total = 0;
    for (var i = 0; i < workLogsByUserId.items.length; i++) {
        if (userId != workLogsByUserId.items[i].userId) {
            if (i != 0) {
                var minutes = (time % 3600) / 60, hours = parseInt(time / 3600);
                var timeSring = hours.toString().concat('h', ' ', minutes, 'm');
                var item = { userId: userId, userName: userName, userUrl: userUrl, time: timeSring, timeValue: (time / 3600) };
                workLogsResume.push(item);
            }
            userId = workLogsByUserId.items[i].userId;
            userName = workLogsByUserId.items[i].userName;
            userUrl = workLogsByUserId.items[i].userUrl;
            time = 0;
        }
        time = time + workLogsByUserId.items[i].timeSpentSeconds;
        total = total + workLogsByUserId.items[i].timeSpentSeconds;
    }
    if (userId != "") {
        var minutes = (time % 3600) / 60, hours = parseInt(time / 3600);
        var timeSring = hours.toString().concat('h', ' ', minutes, 'm');
        var item = { userId: userId, userName: userName, userUrl: userUrl, time: timeSring, timeValue: (time / 3600) };
        workLogsResume.push(item);
    }
    var minutes = (total % 3600) / 60, hours = parseInt(total / 3600);
    var timeSring = hours.toString().concat('h', ' ', minutes, 'm');
    var result = { workLogsByDev: workLogsResume, totalTime: timeSring }

    return result;
}
