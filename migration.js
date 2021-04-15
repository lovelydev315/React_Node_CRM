const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Customer = require('./models/Customer');
const Admin = require('./models/Admin');
const File = require('./models/File');
const Phase = require('./models/Phase');

mongoose
  .connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const createTestInformations = async () => {
  for(let j = 0; j < 10; j++) {
    const stages = [];
    for(let k = 0; k < 10; k++) {
      stages.push({stage: k, name: "stage" + k});
    }
    const newPhase = new Phase({
      phase: j,
      name: 'phase' + j,
      stages: stages
    })
    try {
      await newPhase.save();
    } catch(error) {
      console.log(error);
    }
  }
  Phase.find().sort({phase: 1})
    .then((phases) => {
      for(let i = 0; i < 10; i++) {
        const newCustomer = new Customer({
          name: 'customer' + i,
          email: 'customer' + i + '@gmail.com',
          password: 'customer' + i,
          mobile_phone: '123456789' + i,
          office_phone: '123456789' + i,
          address: 'street' + i,
          postal_code: '1234' + i,
          country: 'Unknown' + i,
          state: 'blaa' + i,
          avatar: '',
          phases: phases,
          user_state: {
            phase: i,
            stage: i
          },
          user_check: false
        })
        bcrypt.genSalt(12, (err, salt) =>
          bcrypt.hash(newCustomer.password, salt, (err, hash) => {
            if (err) throw err;
    
            newCustomer.password = hash;
            // Save user
            newCustomer
              .save()
              .then((res) => {
                // for(let j = 0; j < 5; j++) {
                //   const newFile = new File({
                //     user_id: res._id,
                //     folder_path: res._id + '_' + 'folder' + j,
                //     folder_name: 'folder' + j,
                //     file_array: []
                //   })
                //   newFile
                //     .save()
                //     .then()
                //     .catch((err) => {
                //       console.log(err);
                //     })
                // }
              })
              .catch((err) => console.log(err));
          })
        );
        
      }
    })
    const newAdmin = new Admin({
      name: 'admin',
      email: 'admin@gmail.com',
      password: 'admin'
    })
    bcrypt.genSalt(12, (err, salt) =>
      bcrypt.hash(newAdmin.password, salt, (err, hash) => {
        if (err) throw err;

        newAdmin.password = hash;
        // Save user
        newAdmin
          .save()
          .then((res) => {
            
          })
          .catch((err) => console.log(err));
      })
    );
}

createTestInformations();

