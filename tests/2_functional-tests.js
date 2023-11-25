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
    }).timedOut(10000);

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
    });


    test("Create an issue with missing required fields: POST request to /api/issues/{project}", function(done) {
        
    });

  })
});
