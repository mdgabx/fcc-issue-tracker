'use strict';

const { Issue, Project} = require('../models')

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(async (req, res) => {
      let project = req.params.project;
      
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
   
      if(!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' })
      } 

      try {
        const projectExist = await Project.findOne({ name: project });
    
        if (!projectExist) {
          const createProject = await Project.create({ name: project });
          // console.log('Created project:', createProject); 
          res.status(200).json(createProject);
        }

        const issue  = await Issue.create({
          issue_text,
          issue_title,
          created_by,
          projectId: projectExist._id,
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
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
