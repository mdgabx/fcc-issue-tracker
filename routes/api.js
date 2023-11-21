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
    
      const projectExist = await Project.findOne({ name: project });
    
      console.log('project exist', projectExist); // Corrected syntax
    
      console.log('project', project); // Moved this console.log before the conditional check
    
      if (!projectExist) {
        const createProject = await Project.create({ name: project });
        console.log('Created project:', createProject); // Log the created project
        res.status(200).json(createProject);
        return
      }
    
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
