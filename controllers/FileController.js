const File = require("../models/File"); // File model
const _ = require('lodash');
const fs = require("fs");

exports.get = (req, res) => {
  
  const sessUser = req.session.user;

  //get for admin
  if(sessUser.authority === 'admin') {
    File
      .find()
      .sort({ user_id: 1, folder_name: 1 })
      .then((folders) => {
        console.log(folders)
        res.json(folders);
      })
      .catch((err) => console.log(err));
  }
  //get credits for user
  else if(sessUser.authority === 'customer') {
    File
      .find({ user_id: sessUser.user_id })
      .then((folders) => {
        res.json(folders);
      })
      .catch((err) => console.log(err));
  }

  else res.status(400).json("You are not permitted");
}

exports.add = (req, res) => {

  const sessUser = req.session.user;

  if(!req.files && !req.files.document) return res.status(400).json("No upload file");

  const document = req.files.document;

  let folder_name, user_id;

  folder_name = req.body.folder_name;

  //set by admin
  if(sessUser.authority === 'admin') {
    user_id = req.body.user_id;
  }
  else {
    user_id = sessUser.user_id;
  }

  const path = 'public/document/' + user_id + '_' + folder_name + '/' + Date.now();

  try {
    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    document.mv(path);
  } catch (err) {
    return console.log(err);
  }

  document = {
    path: path,
    name: document.name,
    type: document.mimetype,
    size: document.size
  }

  File
    .findOne({ user_id: user_id, folder_name: folder_name })
    .then((file) => {
      //add to existing folder
      if(file) {
        const newFile = JSON.parse(JSON.stringify(file));
        let file_array = file.file_array;
        if(file_array && Array.isArray(file_array)) file_array.push(document);
        else file_array = [ newFile ];
        File.updateOne({ user_id: user_id, folder_name: folder_name }, { file_array: file_array })
          .then((each) => {
            res.json("Successfully added");
          })
          .catch((err) => {
            console.log(err);
          })
      }
      //add to new folder
      else {
        const newFile = new File({
          user_id: user_id,
          folder_path: user_id + '_' + folder_name,
          folder_name: folder_name,
          file_array: [ document ]
        })
        newFile
          .save()
          .then(() => {
            res.json("Successfully added");
          })
          .catch((err) => {
            console.log(err);
          })
      }
    })
}

exports.addFolder = (req, res) => {

  const sessUser = req.session.user;

  const { user_id } = sessUser;

  const { folder_name } = req.body;

  //create new folder
  const dir = "./public/" + user_id + "/" + folder_name;

  if(!fs.existsSync("./public/" + user_id)){
    fs.mkdirSync("./public/" + user_id);
  }
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  File.findOne({ folder_name }).then((file) => {

    //check if instance exists
    if(file) return res.status(400).json("Duplicate folder");

    //new instance created
    const newFile = new File({
      user_id,
      folder_name,
      file_array: []
    });

    //save new instance
    newFile
      .save()
      .then((each) => {
        console.log(each);
        res.json(each);
      })
      .catch((err) => {
        console.log(err);
      })
  })
}

exports.uploadDocument = (req, res) => {
  const sessUser = req.session.user;
  const { authority } = sessUser;
  let user_id
  if(authority === 'admin') user_id = req.body.user_id;
  else user_id = sessUser.user_id;
  let { file_name, folder_name } = req.body;

  console.log(req.file)
  const file_originalname = req.file.originalname ? req.file.originalname : req.file.name;

  if(!file_name) file_name = file_originalname.substring(0, file_originalname.lastIndexOf("."));
  
  //create new folder
  const dir = "./client/public/documents/" + user_id + '/' + folder_name;

  if(!fs.existsSync(dir)){
    if(!fs.existsSync("./client/public/documents")) fs.mkdirSync("./client/public/documents");
    if(!fs.existsSync("./client/public/documents/" + user_id)) fs.mkdirSync("./client/public/documents/" + user_id);
    fs.mkdirSync("./client/public/documents/" + user_id + '/' + folder_name);
  }
  
  File.findOne({ user_id, folder_name }).then((folder) => {

    if(folder) {
      //check file
      const state = folder.file_array.find(each=>each.name === file_name);
      if(state) return res.status(400).json("file name duplicated");

      let path='';

      if(req.file){
        const document = req.file;
        path = Date.now() + file_originalname.substring(file_originalname.lastIndexOf("."));
    
        try {
          fs.writeFileSync( dir + '/' + path, document.buffer );
        } catch (err) {
          return console.log(err);
        }
      }

      const newFile = {
        path: path,
        name: file_name, 
        type: file_originalname.substring(file_originalname.lastIndexOf(".") + 1),
        size: req.file.size
      }

      folder.file_array.push(newFile);
      folder
        .save()
        .then((each) => {
          res.json(each);
        })
        .catch((err) => {
          console.log(err);
        })
    }
    else {
      
      let path='';

      if(req.file){
        const document = req.file;
        path = Date.now() + file_originalname.substring(file_originalname.lastIndexOf("."));
    
        try {
          fs.writeFileSync( dir + '/' + path, document.buffer );
        } catch (err) {
          return console.log(err);
        }
      }

      const newFolder = new File({
        user_id,
        folder_name,
        file_array: [
          {
            path: path,
            name: file_name, 
            type: file_originalname.substring(file_originalname.lastIndexOf(".") + 1),
            size: req.file.size
          }
        ]
      });

      newFolder
        .save()
        .then((each) => {
          res.json(each);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  })
}