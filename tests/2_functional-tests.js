const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('Functional test done', function () {

    test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
        const sampleIssue = {
            issue_title: "test title",
            issue_text: "hello world issue",
            created_by: "Mark",
            open: true,
            assigned_to: "Yoko",
            status_text: "not yet completed"
        }

        chai.request(server)
            .post('/api/issues/testingEnv')
            .send(sampleIssue)
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, "issue_title")
                assert.property(res.body, "issue_text")
                assert.property(res.body, "created_by")
                assert.property(res.body, "open")
                assert.property(res.body, "assigned_to")
                assert.property(res.body, "status_text")

                done();
            });
    }).timeout(10000)

    test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
        const sampleIssue = {
            issue_title: "test title",
            issue_text: "hello world issue",
            created_by: "Mark",
        }

        chai.request(server)
            .post('/api/issues/testingEnv')
            .send(sampleIssue)
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, "issue_title")
                assert.property(res.body, "issue_text")
                assert.property(res.body, "created_by")

                done()
            });
    }).timeout(10000)


    test("Create an issue with missing required fields: POST request to /api/issues/{project}", function(done) {
        
        const sampleIssue = {
            issue_title: "",
            issue_text: "",
            created_by: "",
            open: true,
            assigned_to: "Yoko",
            status_text: "not yet completed"
        }

        chai.request(server)
            .post('/api/issue/testingEnv')
            .send(sampleIssue)
            .end(function (err, res) {
                assert.equal(res.status, 404)
                assert.equal(res.body.error, undefined)

                done();
            });
    }).timeout(10000)

    test("View issues on a project: GET request to /api/issues/{project}", function (done) {
        chai.request(server)
            .get('/api/issues/testingEnv')
            .end(function (err, res) {
                assert.equal(res.status, 200)

                assert.isArray(res.body, 'response should be an array')
                if (res.body.length > 0) {
                    assert.property(res.body[0], 'issue_title', 'Issue should have title');
                    assert.property(res.body[0], 'issue_text', 'Issue should have text');
                    assert.property(res.body[0], 'created_by', 'Issue should have creator');
                    assert.property(res.body[0], 'open', 'Issue should have an open field');
                  }

                done();
            })
    }).timeout(10000)

    test("View issues on a project with one filter: GET request to /api/issues/{project}", function(done) {
        chai.request(server)
            .get('/api/issues/testingEnv')
            .query({ open: true })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.isArray(res.body, 'response should be an array')
                
                if(res.body.length > 0) {
                    assert.equal(res.body[0].open, true)
                }

                done();
            })
    })
  }).timeout(5000)
});
