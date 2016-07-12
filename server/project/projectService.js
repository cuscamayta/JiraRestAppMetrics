'use strict'

var linq = require('node-linq').LINQ,
    utils = require('../common/utils');


exports.getProjects = function (projectData) {
    try {
        var projects = projectData ? new linq(projectData.projects).Select(function (project) {
            return { name: project.name, key: project.key, issuetypes: getIssueTypes(project.issuetypes) };
        }).OrderBy(function (projectItem) {
            return projectItem.name;
        }) : [];
        return projects;
    }
    catch (error) {
        return error;
    }
}

exports.getSprints = function (sprintsData) {
    try {
        var sprints = sprintsData ? new linq(sprintsData.sprints)
            .OrderBy(function (sprint) { return sprint.id })
            .Select(function (sprint) {
                return { id: sprint.id, name: sprint.name };
            }).OrderBy(function (sprintItem) {
                return sprintItem.name;
            }) : [];
        return sprints;
    }
    catch (error) {
        return error;
    }
}


function getIssueTypes(dataIssueTypes) {
    var issueTypes = dataIssueTypes ? new linq(dataIssueTypes).Select(function (issueType) {
        return { id: issueType.id, name: issueType.name };
    }) : [];
    return issueTypes;
}

exports.getProjectVersions = function (dataProjects) {
    try {
        var projectVersions = dataProjects ? new linq(dataProjects).Select(function (projectVersion) {
            return { id: projectVersion.id, name: projectVersion.name };
        }) : [];
        return projectVersions;
    }
    catch (error) {
        return error;
    }
}

function getTimeWorkLogs(worklogs) {
    var worklogsResult = new linq(worklogs.items)
        .OrderBy(function (worklog) { return worklog.updateAuthor.name })
        .Select(function (worklog) {
            return {
                timeSpentSeconds: worklog.timeSpentSeconds,
                userId: worklog.updateAuthor.name,
                userName: worklog.author.displayName,
                userUrl: worklog.author.avatarUrls["48x48"]
            };
        });
    return worklogsResult;
}


exports.getTimeAssignedForDeveloper = function (dataIssues) {
    try {
        var issues = dataIssues.issues;

        var worklogs = new linq(issues).SelectMany(function (issue) {
            return issue.fields.worklog.worklogs;
        }).items;

        var worklogByUser = new linq(worklogs).GroupBy(function (worklog) {
            return worklog.author.key;
        });


        var worklogSummaryByUser = [];
        for (var key in worklogByUser) {
            var worklogs = worklogByUser[key],
                author = worklogs ? new linq(worklogs).First().author : {};

            author.timeEstimate = getTimeAssignedInIssueByDeveloper(issues, key);

            var totalWorklogTime = new linq(worklogs).Sum(function (worklog) {
                return worklog.timeSpentSeconds;
            });
            worklogSummaryByUser.push(createSummaryWorklogUser(totalWorklogTime, author));
        }

        return worklogSummaryByUser;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

function getTimeAssignedInIssueByDeveloper(issues, userName) {
    var timeAssginedInIssues = new linq(issues).Where(function (issue) {
        return issue.fields.assignee && issue.fields.assignee.key == userName;
    }).Select(function (itemIssue) {
        return itemIssue.fields.timeoriginalestimate;
    }).Sum();

    return utils.convertSecondsToTime(timeAssginedInIssues);
}

function createSummaryWorklogUser(totalWorklogTime, author) {
    return {
        key: author.key,
        userName: author.displayName,
        userUrl: author ? author.avatarUrls["48x48"] : '',
        time: utils.convertSecondsToTime(totalWorklogTime),
        timeValue: (totalWorklogTime / 3600),
        timeEstimate: author.timeEstimate
    };
}

