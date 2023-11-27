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
          return res.status(400).json({error: `project ${project} not found`})
        } else {
          const issuesUnderProject = await Issue.find({ projectId: projectFound._id,
            ...req.query,
          });
          
          if(!issuesUnderProject) {
            res.status(400).json({error: `No issues under this project as of this moment`})
          } else {
            res.status(200).json(issuesUnderProject);
          }
        }

      } catch (err) {
        res.status(500).json({ error: 'Server error' });
      }

    })
    
    .post(async (req, res) => {
      let project = req.params.project;
      
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
   
      if(!issue_title || !issue_text || !created_by) {
        return res.status(400).json({ error: 'required field(s) missing' })
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

        res.status(200).json(issue);

      } catch (err) {
        console.warn(err);
        res.status(500).json({ error: err })
      }
    })
    
    .put(async (req, res) => {
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      const project = req.params.project;
    
      if (!_id) {
        return res.status(400).json({ error: 'missing _id' });
      }
    
      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text) {
        return res.status(400).json({ error: 'no update field(s) sent', _id });
      }
    
      try {
        const updatedIssue = await Issue.findByIdAndUpdate(
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
    
        if (!updatedIssue) {
          return res.status(400).json({ error: 'could not update', _id });
        }
    
        res.status(200).json({ result: 'successfully updated', _id });
    
      } catch (err) {
        res.status(500).json({ error: `Server Error: ${err.message}` });
      }
    })
    
    .delete(async (req, res) => {
      let project = req.params.project;

      const { _id } = req.body

      if(!_id) {
       return res.status(400).json({ error: 'missing _id' })
      }

      try {

        const deletedIssue = await Issue.findByIdAndDelete(_id)

        if(!deletedIssue) {
         return res.status(400).json({ error: 'could not delete', '_id': _id })
        }

        res.status(200).json({ result: 'successfully deleted', '_id': _id })

      } catch (err) {
        res.status(500).json({ error: `Server error: ${err}` })
      }
    });
    
};
