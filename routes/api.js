'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(function (req, res){
      let project = req.params.project;

      console.log('project', project);
      
      const { issue_title, issue_text, created_by } = req.body;

      console.log('issue_title', issue_title)
      console.log('issue_text', issue_text)
      console.log('created_by', created_by)

      if(!issue_title) {
        res.status(400).json({ error: "title is required" })
      } else if (!issue_text) {
        res.status(400).json({ error: "text is required" })
      } else if (!created_by) {
        res.status(400).json({ error: "created by is required" })
      } else {
        res.json({  })
      }

    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
