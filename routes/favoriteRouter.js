const express = require('express');
const Favorite = require('../models/favorites');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

// const bodyParser = require('body-parser'); <-- no longer used
// favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate('user')
      .populate('campsites')
      .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.forEach((e) => {
            // <-- Array.prototype.forEach((element) => { /* ... */ })
            if (!favorite.campsites.includes(e._id)) {
              // <-- Array.prototype.includes(searchElement)
              favorite.campsites.push(e._id);
            }
          });
          favorite
            .save()
            .then((favorite) => {
              console.log('Favorite Created ', favorite);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          Favorite.create({ user: req.user._id, campsites: req.body })
            // favorite.save() <-- do not need
            .then((favorite) => {
              console.log(res.body);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.status(403).end(`${req.method} operation not supported on /favorites`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          favorite
            .remove()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          res.setHeader('Content-Type', 'text/plain');
          res.status(200).end('You do not have any favorites to delete.');
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res
      .status(403)
      .end(
        `${req.method} operation not supported on /favorites/${req.params.campsiteId}`
      );
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          if (!favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites.push(req.params.campsiteId);
            favorite
              .save()
              .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              })
              .catch((err) => next(err));
          } else {
            res.setHeader('Content-Type', 'plain/text');
            res
              .status(200)
              .end('That campsite is already in the list of favorites!');
          }
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: [req.params.campsiteId], // <-- req.params.campsiteId needs to be an array
          })
            // favorite.save() <-- do not need
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res
      .status(403)
      .end(
        `${req.method} operation not supported on /favorites/${req.params.campsiteId}`
      );
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          const i = favorite.campsites.indexOf(req.params.campsiteId); // <-- Array.prototype.indexOf(searchElement)
          if (i > -1) {
            favorite.campsites.splice(i, 1); // <-- Array.prototype.splice(start, deleteCount)
          }
          favorite
            .save()
            .then((favorite) => {
              console.log('Favorite Deleted ', favorite);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          res.setHeader('Content-Type', 'text/plain');
          res.status(200).end('You do not have any favorites to delete.');
        }
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
