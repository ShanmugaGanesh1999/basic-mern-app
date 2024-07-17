const mongoose = require("mongoose");

const { calculateBMI } = require("../utilities/utils");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const user = {
  id: ObjectId,
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 3;
      },
      message: (props) => `name must be greater than or equal to 3 characters`,
    },
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  dob: { type: Date, max: new Date("2014") },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    default: "others",
  },
  height: {
    type: Number,
    required: true,
    min: [55, "height must be at least 55 (cm), but got {VALUE}"],
  },
  weight: {
    type: Number,
    required: true,
    min: [35, "weight must be at least 35 (kg), but got {VALUE}"],
  },
  status: {
    type: String,
    enum: ["under", "normal", "over", "obese"],
    default: "normal",
  },
};

const userSchema = new Schema(user, { versionKey: false });

const userModel = mongoose.model("user", userSchema);

function createUser(params) {
  params["status"] = calculateBMI(params);
  return new Promise((resolve, reject) => {
    userModel
      .create(params)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

function getUser(param) {
  return new Promise((resolve, reject) => {
    let find = {};
    if (param?.type && param?.value) {
      let key = param.type === "id" ? "_id" : "emailId";
      find[key] = param.value;
    }
    resolve(userModel.find(find).exec());
  });
}

function getUser(param) {
  return new Promise((resolve, reject) => {
    let find = {};
    if (param?.type && param?.value) {
      let key = param.type === "id" ? "_id" : "emailId";
      find[key] = param.value;
    }
    resolve(userModel.find(find).exec());
  });
}

function updateUser(id, requestBody) {
  return userModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    { $set: requestBody },
    { new: true, runValidators: true }
  );
}

function deleteUser({ id }) {
  return new Promise((resolve, reject) => {
    resolve(
      userModel
        .findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) })
        .exec()
    );
  });
}

module.exports = { createUser, getUser, updateUser, deleteUser };
