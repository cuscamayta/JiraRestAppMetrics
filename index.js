var express = require('express'),
    jiraApi = require('jira').JiraApi,
    session = require('express-session'),
    bodyParser = require('body-parser'),
    project = require('./server/project/projectService'),
    metrics = require('./server/metric/metricService'),
    worklog = require('./server/worklog/worklogService'),
    timesheet = require('./server/timesheet/timesheetService'),
    utils = require('./server/common/common'),
    cookieParser = require('cookie-parser'),
    cookieEncrypter = require('cookie-encrypter'),
    app = express(),
    secretKey = '*jiraMobile*',
    jira = null;

app.use(cookieParser(secretKey));
app.use(cookieEncrypter(secretKey));
app.use(session({
    secret: 'jiramobile',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
global.__base = __dirname + '/server';
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.all('*', function (req, res, next) {
    // console.log('in all *');
    try {
        if (req.session.user || req.originalUrl == "/login") {
            next();
        } else
            if (!req.session.user && req.signedCookies['user']) {
                var config = req.signedCookies['user'];
                req.session.user = config;
                jira = new jiraApi('https', config.host, config.port, config.username, config.password, '2');

                res.cookie('user', config, { signed: true, expires: new Date(Date.now() + 900000), httpOnly: true });
                next();
            } else {
                next(new Error(401));
            }
    } catch (ex) {
        resp.send({ error: ex });
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
        jira.getCurrentUser(function (error, response, body) {
            resp.send({ status: true, hasBeenLogged: response != null ? true : false, data: response });
        });
        req.session.user = config;
        resp.cookie('user', config, { signed: true, expires: new Date(Date.now() + 900000), httpOnly: true });
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


// app.post('/getWorkLogs', function (request, response) {
//     var jql = 'worklogDate >="' + request.body.startDate + '" and worklogDate <="' + request.body.endDate + '" and project=' + request.body.projectName + ' and worklogAuthor=' + request.body.userName;

//     jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
//         response.send(body);
//     });
// })

// app.post('/getWorkLogsBySprint', function (request, response) {
//     var jql = 'worklogDate >="' + request.body.startDate + '" and worklogDate <="' + request.body.endDate + '" and project=' + request.body.projectName + ' and worklogAuthor=' + request.body.userName;

//     jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
//         response.send(body);
//     });
// })

function loginUser() {
    var config = {
        "username": "cuscamayta",
        "password": "Innsa1234",
        "port": 443,
        "host": "innovision.atlassian.net"
    }

    jira = new jiraApi('https', config.host, config.port, config.username, config.password, '2');
}

app.get('/getTimeSheetInSprint', function (request, response) {
    loginUser();
    var jql = 'sprint = ' + request.query.sprint;
    jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
        response.send(timesheet.getTimeSheetInSprint(body, request.query.user));
    });
})

app.post('/getTimeSheetInDates', function (request, response) {
    var jql = 'worklogDate >="' + request.body.startDate + '" and worklogDate <="' + request.body.endDate + '" and project=' + request.body.project.key + ' and worklogAuthor=' + request.body.user.data.name;

    jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
        response.send(timesheet.getTimeSheetInDates(body, request.body.user.data.name, request.body.startDate, request.body.endDate));
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

app.get('/getProjectsWithSprints', function (request, response) {
    jira.findByURL('/issue/createmeta', function (err, projects) {
        for (var i = 0; i <= projects.length; i++) {
            var currentProject = projects[i];
            session.jira.findUsingGreenhopper('greenhopper/1.0/integration/teamcalendars/sprint/list?jql=project=' + currentProject.key, function (err, sprints) {
                currentProject.sprints = sprints;
            })
        }
        response.send(project.getProjects(projects));
    })
});

function getParametersEnglish(data) {
    switch (data) {
        case 'Error':
            return 'Bug';
        case 'Historia':
            return 'Story';
        case 'Tarea':
            return 'Task';
        case 'Mejora':
            return 'Improvement';
        case 'Épica':
            return 'Epic';
        default:
            return data;
    }
}

app.get('/getMetricsByTypeIssue', function (request, response) {

    var project = request.query.project,
        //issuetype = getParametersEnglish(request.query.issuetype),
        fixVersions = request.query.fixVersions,
        sprint = request.query.sprint;
    var jql = 'project = '.concat(project, ' AND issuetype = BUG AND fixVersion IN (', fixVersions, ')', ' AND sprint = ', sprint);
    jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
        response.send(metrics.getMetricsByTypeIssue(body));
    });
})

app.get('/getMetricsByTypeIssueWithOutVersion', function (request, response) {

    var project = request.query.project,
        //issuetype = getParametersEnglish(request.query.issuetype),
        fixVersions = request.query.fixVersions,
        sprint = request.query.sprint;
    var jql = 'project = '.concat(project, ' AND issuetype = BUG ', ' AND sprint = ', sprint);
    jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
        response.send(metrics.getMetricsByTypeIssue(body));
    });
})

app.get('/getMetricsByBugInPeriod', function (request, response) {
    var project = request.query.project,
        fixVersions = request.query.fixVersions,
        startDate = request.query.startDate,
        endDate = request.query.endDate;

    var jql = 'project='.concat(project, ' AND issuetype = BUG AND fixVersion IN (', fixVersions, ')', ' AND worklogDate >=', startDate, ' and worklogDate <=', endDate);
    jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
        response.send(metrics.getMetricsByBugInPeriod(body));
    });
})

app.get('/getMetricsByBugInPeriodWithOutVersion', function (request, response) {
    var project = request.query.project,
        fixVersions = request.query.fixVersions,
        startDate = request.query.startDate,
        endDate = request.query.endDate;

    var jql = 'project='.concat(project, ' AND issuetype = BUG ', ' AND worklogDate >=', startDate, ' and worklogDate <=', endDate);
    jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
        response.send(metrics.getMetricsByBugInPeriod(body));
    });
})

app.get('/getMetricsOfTimeForIssue', function (request, response) {
    var sprint = request.query.sprint,
        project = request.query.project;

    var jql = 'project ='.concat(project, ' AND sprint =', sprint, ' AND issuetype IN (story,Improvement,Overhead,"QA Manual",Task,"Technical task",bug)');
    //var jql = 'project ='.concat('JM', ' AND sprint =', 189, ' AND issuetype IN (story,Improvement,Overhead,"QA Manual",Task,"Technical task",bug)');

    jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
        response.send(metrics.getMetricsOfTimeForIssue(body));
    });
})

app.get('/getTimebyDeveloper', function (request, response) {

    try {
        var jql = 'sprint =' + request.query.idSprint;
        jira.searchJira(jql, { fields: ['*all'] }, function (error, body) {
            response.send(project.getTimeAssignedForDeveloper(body));
        });
    }
    catch (error) {
        response.send("error");;
    }
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


app.post('/logout', function (req, resp) {
    try {
        req.session.destroy();
        resp.clearCookie('user');
        resp.send({ isSuccess: true });

        req.session = null;
    } catch (ex) {
        resp.send({ Message: "An e rroccurred when closing user session" });
    }
});


app.post('/testSession', function (req, res) {
    //var jiraMobileCookie = cookiee('jmcookies');
    res.send(req.signedCookies['user']);
});