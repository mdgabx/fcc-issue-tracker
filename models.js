const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueSchema = new Schema({
    projectId: { type: String, required: true },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true},
    assigned_to: String,
    status_text: String,
    open: Boolean,
    created_on: Date,
    updated_on: Date
})

const ProjectSchema = new Schema({
    name: { type: String, required: true}
})


const Issue = mongoose.model("Issue", IssueSchema)
const Project = mongoose.model("Project", ProjectSchema)

module.exports = {
    Issue,
    Project
}