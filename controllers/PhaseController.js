const Phase = require("../models/Phase"); // Phase model

// get phase
exports.get = (req, res) => {
  Phase.find().sort({stage: 1}).then((phases) => {
    if (!phases) return res.status(400).json("No phase data");
    if(phases) res.json(phases);
  });
};

//set phase
exports.set = (req, res) => {
  const { stage, name } = req.body;

  //check for existing phase stage
  Phase
    .findOne({ phase: phase })
    .then((phase) => {
      if (phase) {
        phase.name = name;
        phase.stages = stages;
        phase.save()
        .then(res.json("Existing phase successfully updated"))
        .catch((err)=> console.log(err));
      }
      
      //new phase created
      const newPhase = new Phase({
        phase: phase,
        name: name,
        stages: stages
      });

      //save new phase
      newPhase
        .save()
        .then(res.json("New phase successfully added"))
        .catch((err) => console.log(err));
  });
}
