const mongoose = require("mongoose");

const EachFileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at' 
  }
});

const FileSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  folder_name: {
    type: String,
    required: true
  },
  file_array: [
    EachFileSchema
  ]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at' 
  }
});

const File = mongoose.model("File", FileSchema);

module.exports = File;
