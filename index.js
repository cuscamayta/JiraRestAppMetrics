var express = require('express'),
    jiraApi = require('jira').JiraApi,
    session = require('express-session'),
    bodyParser = require('body-parser'),
    project = require('./server/project/projectService'),
    metrics = require('./server/metric/metricService'),
    worklog = require('./server/worklog/worklogService'),
    utils = require('./server/common/common'),
    app = express(),
    jira = null;



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.all('*', function (req, res, next) {
    if (jira || req.originalUrl == "/login") {
        next();
    } else {
        next(new Error(401));
    }
});

app.use(function (err, request, response, next) {
    if (err instanceof Error) {
        if (err.message === '401') {
            response.status(401);
            response.send({ code: 401, message: 'Not authorized', error: err });
        }
    }
});



app.get('/', function (request, response) {
    response.sendfile('./index.html');
});


app.post('/login', function (req, resp) {
    try {
        var config = {
            "username": req.body.userName,
            "password": req.body.password,
            "port": 443,
            "host": "innovision.atlassian.net"
        };

        jira = new jiraApi('https', config.host, config.port, config.username, config.password, '2');

        session.jiraInstance = jira;

        jira.getCurrentUser(function (error, response, body) {
            resp.send({ status: true, hasBeenLogged: response != null ? true : false, data: response });
        });
    } catch (ex) {
        resp.send({ error: ex });
    }
});


app.post('/saveLogWork', function (request, response) {
    var workLogForRegister = {
        "timeSpent": request.body.worklog,
        "comment": "logging jira Rest App Mobile"
    }

    jira.addWorklog(request.body.issue, workLogForRegister, '', function (error, body) {
        response.send(worklog.addWorklog(body));
    });
});


app.post('/getWorkLogs', function (request, response) {
    var jql = 'worklogDate >="' + request.body.startDate + '" and worklogDate <="' + request.body.endDate + '" and project=' + request.body.projectName + ' and worklogAuthor=' + request.body.userName;

    jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
        response.send(body);
    });
})

app.get('/getSprintsByProject', function (request, response) {
    var projectKey = request.query.project;
    jira.findUsingGreenhopper('greenhopper/1.0/integration/teamcalendars/sprint/list?jql=project=' + projectKey, function (err, body) {
        response.send(project.getSprints(body));
    })
})

app.get('/getProjects', function (request, response) {
    jira.findByURL('/issue/createmeta', function (err, body) {
        response.send(project.getProjects(body));
    })
})

app.get('/getprojectVersions', function (request, response) {
    var projectKey = request.query.project;
    jira.getVersions(projectKey, function (err, body) {
        response.send(project.getProjectVersions(body));
    })
})

app.get('/getMetricsByTypeIssue', function (request, response) {

    var project = request.query.project,
        issuetype = request.query.issueType,
        fixVersions = request.query.fixVersions,
        sprint = request.query.sprint;

    var jql = 'project='.concat(project, ' AND issuetype =', issuetype, ' AND fixVersion IN (', fixVersions, ')', ' AND Sprint =', sprint);
    jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
        response.send(metrics.getMetricsByTypeIssue(body));
    });
})


app.get('/getMetricsByTypeIssueInPeriod', function (request, response) {
    var project = request.query.project,
        issuetype = request.query.issuetype,
        fixVersions = request.query.fixversions,
        startDate = request.query.sprint,
        endDate = request.query.sprint;

    // var jql = 'project='.concat(project, ' AND issuetype =', issuetype, ' AND fixVersion IN (', fixVersions, ')', ' AND worklogDate >=', startDate, ' and worklogDate <=', endDate);
    var jql = 'project = "Manteniento RMtools" AND issuetype = BUG AND fixVersion IN (3.10.10,3.10.7.0,3.12.5) AND worklogDate >= "2016-01-01" and worklogDate <= now()';
    jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
        response.send(metrics.getMetricsByTypeIssue(body));
    });
})

app.get('/getMetricsOfTimeForIssue', function (request, response) {
    var sprint = request.query.sprint,
        project = request.query.project;

    var jql = 'project ='.concat(project, ' AND sprint =', sprint, ' AND issuetype IN (story,Improvement,Overhead,"QA Manual",Task,"Technical task",bug)');

    jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
        response.send(metrics.getMetricsOfTimeForIssue(body));
    });
})

app.get('/getTimebyDeveloper', function (request, response) {
    var jql = 'sprint =' + request.query.idSprint;

    jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
        response.send(project.getTimebyDeveloper(body.issues));
    });
})

app.get('/getIssuesByDeveloper', function (request, response) {
    var jql = 'assignee ='.concat(request.query.developer, ' and Sprint in openSprints()');

    jira.searchJira(jql, { fields: ['*all'] }, function (err, body) {
        response.send(worklog.getUserIssuesInSprint(body));
    })
})


app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'));
});
