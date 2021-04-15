const bcrypt = require("bcryptjs");
const fs = require('fs');
const Customer = require("../models/Customer"); // User model
const Admin = require("../models/Admin");
const Phase = require("../models/Phase");
// const Joi = require('@hapi/joi');
const { registerSchema, loginSchema } = require('../utils/userValidations');

exports.isAuth = (req,res,next) => {
  console.log(req);
  const sessUser = req.session.user;
  if(sessUser) {
      next();
  }
  else {
      err = res.status(401).json("You Need to Be Logged in to do this. Access Denied ")
      return err;
  }
};

exports.registerCustomer = (req, res) => {

  let path = '';
  const { name, email, password, mobile_phone, office_phone, address, postal_code, country, state } = req.body;

  if(req.file){
    const avatar = req.file;
    path = 'client/public/avatar/' + name + '_' + Date.now() + avatar.originalname.replace(/(.*)([.][^.]*)/, function(a,b,c){return c});

    try {
      fs.writeFileSync(path, avatar.buffer);
    } catch (err) {
      return console.log(err);
    }
  }

      Customer.findOne({ email }).then((customer) => {
        if (customer) return res.send("already_exist");
        Phase.find()
        .sort({phase: 1})
        .then((phases) => {
          
          const newCustomer = new Customer({
            name,
            email,
            password,
            mobile_phone,
            office_phone,
            address,
            postal_code,
            country,
            state,
            avatar: path.substring(14,path.length),
            phases: phases,
            user_state: {
              phase: 0,
              stage: 0
            },
            user_check: false
          });

          bcrypt.genSalt(12, (err, salt) =>
            bcrypt.hash(newCustomer.password, salt, (err, hash) => {
              if (err) throw err;
  
              newCustomer.password = hash;
              // Save user
              newCustomer
                .save()
                .then(
                  res.json("Successfully Registered")
                )
                .catch((err) => console.log(err));
            })
          );
        })
      });
  // } else {
  //   res.status(422).json(result.error.details[0].message);
  // }

};

exports.loginCustomer = (req, res) => {
  const { email, password } = req.body;

  // basic validation
  // const result = loginSchema.validate({ email, password});
  // if(!result.error) {
    //check for existing user
    Customer.findOne({ email }).then((customer) => {
      if (!customer) return res.status(400).json("Incorrect Email or Password");

      // Validate password
      bcrypt.compare(password, customer.password).then((isMatch) => {
        if (!isMatch) return res.status(400).json("Incorrect Email or Password");

        const sessCustomer = { user_id: customer.id, name: customer.name, authority: 'customer', email: customer.email };
        req.session.user = sessCustomer; // Auto saves session data in mongo store

        res.json(sessCustomer); // sends cookie with sessionID automatically in response
      });
    });
  // } else {
  //   console.log(result.error)
  //   res.status(422).json(result.error.details[0].message);
  // }
};

exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;
  console.log('login')

  // // basic validation
  // const result = loginSchema.validate({ email, password});
  // if(!result.error) {
    //check for existing user
    Admin.findOne({ email: email }).then((admin) => {
      if (!admin) return res.status(400).json("Incorrect Email or Password");

      // Validate password
      bcrypt.compare(password, admin.password).then((isMatch) => {
        if (!isMatch) return res.status(400).json("Incorrect Email or Password");

        const sessAdmin = { user_id: admin.id, authority: 'admin', email: admin.email };
        req.session.user = sessAdmin; // Auto saves session data in mongo store

        res.json(sessAdmin); // sends cookie with sessionID automatically in response
      });
    });
  // } else {
  //   console.log(result.error)
  //   res.status(422).json(result.error.details[0].message);
  // }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    // delete session data from store, using sessionID in cookie
    if (err) throw err;
    res.clearCookie("session-id"); // clears cookie containing expired sessionID
    res.send("Logged out successfully");
  });
}

exports.getCustomer = (req, res) => {
  const sessUser = req.session.user;
  const { user_id } = sessUser;
  Customer.findOne({user_id}).then((customer) => {
    return res.json(customer);
  });
}

exports.changeCustomer = (req, res) => {
  const sessUser = req.session.user;
  const { user_id } = sessUser;

  let path = '';
  const { name, email, password, mobile_phone, office_phone, address, postal_code, country, state } = req.body;

  if (req.file){
    const avatar = req.file;
    path = 'public/avatar/' + name + '_' + Date.now() + avatar.originalname.replace(/(.*)([.][^.]*)/, function(a,b,c){return c});
    //upload avatar image
    try {
      fs.writeFileSync(path, avatar.buffer);
    } catch (err) {
      return console.log(err);
    }
  }

  Customer.findOne({user_id}).then((customer) => {
    if (!customer) return res.status(400).json("Incorrect session");
    if (path && fs.existsSync(customer.avatar)) fs.unlink(customer.avatar);
    customer = {name, email, password, mobile_phone, office_phone, address, postal_code, country, state, ...customer};
    customer
      .save()
      .then(
        res.json("Successfully changed")
      )
      .catch((err) => {console.log(err)});
  })
}

exports.authChecker = (req, res) => {
  const sessUser = req.session.user;
  console.log(sessUser);
  if (sessUser) {
    let authority = sessUser.authority;
  Customer.findOne({_id:sessUser.user_id}).then((customer)=>{
    return res.json({customer, authority});
  });
 
    
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};

exports.createAdmin = () => {
  Admin.find({}).then((result) => {
    if(result.length) return;
    const newAdmin = new Admin({
      name: "admin",
      email: "admin@gmail.com",
      password: "admin"
    });
    
    //Password hashing
    bcrypt.genSalt(12, (err, salt) =>
      bcrypt.hash(newAdmin.password, salt, (err, hash) => {
        if (err) throw err;

        newAdmin.password = hash;
        // Save user
        newAdmin
          .save()
          .then(
            console.log("admin created")
          )
          .catch((err) => console.log(err));
      })
    );
  })
}

//update credits
exports.updateCredit = (req, res) => {
  const sessUser = req.session.user;
  console.log(req.body);
  //only for admin
  if(sessUser.authority !== 'admin') res.status(400).json("You are not permitted");

  const { user_id, user_state } = req.body;
  //update credit
  Customer
    .findOneAndUpdate({ _id: user_id }, { user_state: user_state, user_check: false })
    .then((credit) => {
      if(!credit) return res.status(400).json("Unknown credit");
      res.json("Successfully updated");
    })
}

exports.getUsers = (req,res) => {
  const sessUser = req.session.user;
  console.log(sessUser);
  if (sessUser.authority==="admin") {
    Customer.find().then((customer)=>{
      return res.json(customer);
    });
  } else {
    return res.status(401).json({ msg: "Need admin permission to do this action." });
  }
}

exports.getInfo = (req, res) => {
  const sessUser = req.session.user;
  console.log(sessUser);
  if(sessUser.authority === "customer") {
    Customer.findOne({_id: sessUser.user_id})
    .then((customer) => {
      return res.json(customer);
    });
  } else {
    return res.status(401).json({ msg: "Need customer permission to do this action." });
  }
}