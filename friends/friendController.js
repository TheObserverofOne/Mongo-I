const router = require('express').Router();

const Friend = require('./friendModel.js');

router
  .route("/")
  .get((req, res) => {
    Friend.find({})
      .then(friends => {
        res.status(200).json(friends);
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "The friends information could not be retrieved." });
      });
  })

  .post((req, res) => {
    const stats = req.body;
    const { firstName, lastName, age, contactInfo } = stats;

    if (!stats || !firstName || !lastName || !age) {
      res.status(400).json({ errorMessage: "Please provide firstName, lastName and age for the friend." });
      return
    }
    if (isNaN(age) || age < 1 || age > 120) {
      res.status(400).json({ errorMessage: "Age must be a number between 1 and 120" });
      return;
    }

    const friend = new Friend(stats);

    friend
      .save()
      .then(savedFriend => {
        res.status(201).json(savedFriend);
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "There was an error while saving the friend to the database." });
      });
  });


router
  .route("/:id")
  .get((req, res) => {
    const id = req.params.id;

    Friend
    .findById(id)
      .then(friend => {
        if (!friend) {
        res.status(404).json({ message: 'The friend with the specified ID does not exist' });
      }
      res.status(201).json(friend);
      })
      .catch(err => {
        res.status(500).send({ errorMessage: "The friend information could not be retrieved." });
      });
  })

  .delete((req, res) => {
    const id = req.params.id;

    Friend
    .findByIdAndRemove(id)
      .then(friend => {
        if (!friend) {
        res.status(404).json({ message: "The friend with the specified ID does not exist." });
      }
      res.status(201).json(friend);
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "The friend could not be removed" });
      });
  })

  .put((req, res) => {
    const stats = req.body;
    const { firstName, lastName, age, contactInfo } = stats;
    const id = req.params.id;

    if (!stats || !firstName || !lastName || !age) {
        return res.status(400).json({ errorMessage: "Please provide firstName, lastName and age for the friend." });
    }
    if (isNaN(age) || age < 1 || age > 120) {
        return res.status(400).json({ errorMessage: "Age must be a number between 1 and 120" });
    }

    Friend.findByIdAndUpdate(id, stats)
      .then(friend => {
        if (!friend) {
        res.status(404).json({ message: "The friend with the specified ID does not exist." });
      }
        res.status(200).json(friend);
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "The friend information could not be modified." });
      });
  });

module.exports = router;
