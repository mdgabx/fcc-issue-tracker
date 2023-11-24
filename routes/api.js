'use strict';

const { Issue, Project} = require('../models')

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      let project = req.params.project;
      
      try {
        // Check if the project exists
        let projectFound = await Project.findOne({ name: project });
      
        if (!projectFound) {
          return res.json({error: `project ${project} not found`})
        } else {
          const issuesUnderProject = await Issue.find({ projectId: projectFound._id,
            ...req.query,
          });
          
          if(!issuesUnderProject) {
            res.json({error: `No issues under this project as of this moment`})
          } else {
            res.json(issuesUnderProject);
          }
        }

      } catch (err) {
        console.error(err);
        res.json({ error: 'Server error' });
      }

    })
    
    .post(async (req, res) => {
      let project = req.params.project;
      
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
   
      if(!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' })
      } 

      try {
        let projectExist = await Project.findOne({ name: project });
    
        if (!projectExist) {
          projectExist = new Project({ name: project })
          projectExist = await projectExist.save();
        }

        const issue  = await Issue.create({
          projectId: projectExist._id,
          issue_text,
          issue_title,
          created_by,
          assigned_to: assigned_to || "",
          status_text: status_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          open: true
        })

        res.json(issue);

      } catch (err) {
        console.warn(err);
        res.json({ error: err })
      }
    })
    
    .put(async (req, res) => {
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body
      let project = req.params.project;

      try {

        const updateIssue = await Issue.findByIdAndUpdate(
          _id, 
        {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open,
          updated_on: new Date()
        },
        { new: true }
      );

      res.json({  result: 'successfully updated', '_id': _id });

      } catch (err) {
        res.json({ error: `Server Error: ${err}` })
      }     
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
