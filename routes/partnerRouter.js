const express = require('express');
const partnerRouter = express.Router();

partnerRouter
  .route('/')
  .all((req, res, next) => {
    res.status(200);
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res) => {
    res.end('Will send all the partners to you');
  })
  .post((req, res) => {
    res.end(
      `Will add the partner: ${req.body.name}\n with description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.status(403).end(`${req.method} opteration not supported on /partners`);
  })
  .delete((req, res) => {
    res.end('Deleting all partners');
  });

partnerRouter
  .route('/:partnerId')
  .all((req, res, next) => {
    res.status(200);
    res.setHeader('Content-Type', 'text/plain');
    next();
  })
  .get((req, res) => {
    res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
  })
  .post((req, res) => {
    res.status(403).end(
      `${req.method} operation not supported on /partners/${req.params.partnerId}`
    );
  })
  .put((req, res) => {
    res.write(`Updating the partner: ${req.params.partnerId}\n`)
    res.end(`Will update the partner: ${req.body.name}\n with ${req.body.description}`);
  })
  .delete((req, res) => {
    res.end(`Deleting partner: ${req.params.partnerId}`);
  });

module.exports = partnerRouter;
