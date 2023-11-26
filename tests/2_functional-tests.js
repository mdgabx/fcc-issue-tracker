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
                })
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

                    done();
                })
        }).timeout(5000)


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
                })
        }).timeout(5000)

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
        }).timeout(5000)

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
        }).timeout(5000)

        test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function(done) {
            chai.request(server)
                .get('/api/issues/testingEnv')
                .query({ open: true, assigned_to: "Yoko" })
                .end(function (err, res) {
                    assert.equal(res.status, 200)
                    assert.isArray(res.body, 'response should be an array')

                if(res.body.length > 0) {
                        assert.property(res.body[0], "open", "Issue open method should exist")
                        assert.property(res.body[0], "assigned_to", "Issue assigned_to should exist")
                    }
                
                    done();
                })
        }).timeout(5000)

        test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
            const sampleIssue = {
                _id: "655dde403c77ed29e0c96ea6",
                status_text: "update test"
            }

            chai.request(server)
                .put('/api/issues/testingEnv')
                .send(sampleIssue)
                .end(function (err, res) {
                    assert.equal(res.status, 200)
                    assert.equal(res.body._id, sampleIssue._id, "Two id didn't match")

                    done();
                })
        }).timeout(10000)

        test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
            const sampleIssue = {
                _id: "655dde403c77ed29e0c96ea6",
                issue_title: "multiple update fields",
                issue_text: "test multiple updates api",
                created_by: "Do'Urden",
                assigned_to: "Mark",
                open: true,
                status_text: "on-going"
            }

            chai.request(server)
                .put('/api/issues/testingEnv')
                .send(sampleIssue)
                .end(function (err, res) {
                    assert.equal(res.status, 200)   
                    assert.equal(res.body._id, sampleIssue._id)

                    done()
                })

        }).timeout(5000)

        test("Update an issue with missing _id: PUT request to /api/issues/{project}", function(done) {
            const sampleIssue = {
                issue_title: "multiple update fields",
                issue_text: "test multiple updates api",
                created_by: "Do'Urden",
                assigned_to: "Mark",
                open: true,
                status_text: "on-going"
            }

            chai.request(server)
                .put('/api/issues/testingEnv')
                .send(sampleIssue)
                .end(function (err, res) {
                    assert.equal(res.body._id, undefined) 
                    assert.equal(res.body.error, "missing _id") 

                    done()
                })


        }).timeout(10000)

        test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function(done) {
            const sampleIssue = {
                _id: "655dde403c77ed29e0c96ea6",
                issue_title: "multiple update fields",
                issue_text: "test multiple updates api",
                created_by: "Do'Urden",
                assigned_to: "Mark",
                open: true,
                status_text: "on-going"
            }

            chai.request(server)
                .put('/api/issues/testingEnv')
                .send(sampleIssue)
                .end(function (err, res) {
                    assert.equal(res.body.error, "could not update")
                    assert.equal(res.body._id, sampleIssue._id)

                    done()
                })
        }).timeout(5000)

        test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
            const sampleIssue = {
                _id: "655dde403testId",
                issue_title: "multiple update fields",
                issue_text: "test multiple updates api",
                created_by: "Do'Urden",
                assigned_to: "Mark",
                open: true,
                status_text: "on-going"
            }

            chai.request(server)
                .put('/api/issues/testingEnv')
                .send(sampleIssue)
                .end(function(err, res) {
                    assert.equal(res.status, 500)
                    assert.equal(res.body._id, undefined)

                    done();
                })
        }).timeout(5000)
    })
});
