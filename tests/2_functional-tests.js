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
                    assert.equal(res.body.error, undefined)

                    done();
                })
        }).timeout(5000)

        test("View issues on a project: GET request to /api/issues/{project}", function (done) {
            chai.request(server)
                .get('/api/issues/testingEnv')
                .end(function (err, res) {
                    assert.isArray(res.body)

                    done();
                })
        }).timeout(5000)

        test("View issues on a project with one filter: GET request to /api/issues/{project}", function(done) {
            chai.request(server)
                .get('/api/issues/testingEnv')
                .query({ open: true })
                .end(function (err, res) {
                    assert.isArray(res.body)
                    done();
                })
        }).timeout(5000)

        test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function(done) {
            chai.request(server)
                .get('/api/issues/testingEnv')
                .query({ open: true, assigned_to: "Yoko" })
                .end(function (err, res) {
                    assert.isArray(res.body)
                    
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
                    assert.equal(res.body._id, sampleIssue._id, "Two id didn't match")

                    done();
                })
        }).timeout(10000)

        test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
            const sampleIssue = {
                _id: "655ddf7e4656d163d5d3a321",
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
                    assert.equal(res.body._id, undefined)

                    done();
                })
        }).timeout(5000)

        test("Delete an issue: DELETE request to /api/issues/{project}", function(done) {

            const sampleIssue = {
                _id: "655ddffa1f5e972116f35315"
            }

            chai.request(server)
                .delete('/api/issues/testingEnv')
                .send(sampleIssue)
                .end(function (err, res) {
                    assert.equal(res.body._id, sampleIssue._id)

                    done()
                })
        }).timeout(5000)

        test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
            const sampleIssue = {
                _id: "1122"
            }

            chai.request(server)
                .delete('/api/issues/testingEnv')
                .send(sampleIssue)
                .end(function(err, res) {
                    assert.property(res.body, "error")
            
                    done()
                })
        }).timeout(10000)

        test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function(done) {
            const sampleIssue = {
                _id: ""
            }

            chai.request(server)
                .delete('/api/issues/testingEnv')
                .send(sampleIssue)
                .end(function (err, res) {
                    assert.equal(res.body.error, "missing _id")

                    done();
                })
        }).timeout(5000)
    })
});
