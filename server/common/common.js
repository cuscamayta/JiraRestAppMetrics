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