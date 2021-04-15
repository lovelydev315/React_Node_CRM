const Credit = require("../models/Credit"); // Credit model
const Phase = require("../models/Phase");

//get credits
exports.get = (req, res) => {

  const sessUser = req.session.user;

  //get all credits for admin
  if(sessUser.authority === 'admin') {
    Credit
      .find()
      .then((credit) => {
        res.json(credit);
      })
      .catch((err) => res.json(err));
  }
  //get credits for user
  else if(sessUser.authority === 'customer') {
    Credit
      .findOne({ user_id: sessUser.user_id })
      .then((credit) => {
        res.json(credit);
      })
      .catch((err) => res.json(err));
  }

  else res.status(400).json("You are not permitted");
}

//create credits
exports.create = (req, res) => {

  const sessUser = req.session.user;

  //set by admin
  if(sessUser.authority === 'admin') {

    const { user_id } = req.body;

    //check duplicate
    Credit
      .findOne({ user_id })
      .then((credit) => {
        if(credit) res.status(400).json("Credit already exists");

        Phase.find()
        .sort({phase: 1})
        .toArray()
        .then((phases) => {
          const newCredit = new Credit({
            user_id: user_id,
            phases: phases,
            user_state: {
              phase: 0,
              stage: 0
            },
            user_check: false
          });

          //save new Credit
          newCredit
            .save()
            .then(res.json("Successfully saved"))
            .catch((err) => console.log(err));
        })
      });
  }
  //set by customer
  else if(sessUser.authority === 'customer') {

    //check duplicate
    Credit
      .findOne({ user_id: sessUser.user_id })
      .then((credit) => {
        if(credit) res.status(400).json("Credit already exists");

        Phase.find()
        .sort({phase: 1})
        .toArray()
        .then((phases) => {
          const newCredit = new Credit({
            user_id: user_id,
            phases: phases,
            user_state: {
              phase: 0,
              stage: 0
            },
            user_check: false
          });

          //save new Credit
          newCredit
            .save()
            .then(res.json("Successfully saved"))
            .catch((err) => console.log(err));
        })
      });
  }
  else res.status(400).json("You are not permitted");
}

//update credits
exports.update = (req, res) => {
  
  const sessUser = req.session.user;
  //only for admin
  if(sessUser.authority !== 'admin') res.status(400).json("You are not permitted");

  const { user_id, phase, stage } = req.body;

  //update credit
  Credit
    .findOneAndUpdate({ user_id: user_id }, { user_state: {phase: phase, stage: stage}, user_check: false }, { new: true })
    .then((credit) => {
      if(!credit) return res.status(400).json("Unknown credit");
      res.json("Successfully updated");
    })
}