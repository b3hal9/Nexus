const User = require("../models/user.model");
const Kyc = require("../models/kyc.model");
const bcrypt = require("bcrypt");
const CrimeModel = require("../models/criminal.model");
const ReportModel = require("../models/report.model");

const {
  loginValidator,
  kycValidator,
  userSignupValidator,
  crimerecordValidator,
} = require("../utils/reqValidator");
const Notifier = require("../utils/helper/Notifier");

const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  //validating req field
  const { error } = userSignupValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check for existing users
  try {
    const result = await User.findOne({ email });
    if (result) {
      return res.status(400).json({
        error: "User already exists",
      });
    } else {
      //create new user
      const newemail = email.toLowerCase();
      const user = new User({
        name,
        email: newemail,
        password,
      });
      //hasing user password to store in db
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      //save user
      await user.save();
      return res.status(200).json({
        message: "success",
      });
    }
  } catch (error) {
    res.json(error.message);
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  //validation login input fields
  const { error } = loginValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    //check for user in database
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).send("Invalid email or password.");

    //compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");
    //generate token
    const token = user.generateAuthToken();
    //send token as response
    res.send(token);
  } catch (error) {
    res.json(error.message);
  }
};

const kycContoller = async (req, res) => {
  const data = req.body;
  const {
    number,
    incidentDate,
    address,
    district,
    province,
    gender,
    religion,
    documentType,
    documentId,
    occupation,
  } = data;

  // validating req field
  const { error } = kycValidator(data);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user_id = req.user._id;
    const kyc = new Kyc({
      user: user_id,
      number,
      dob: incidentDate,
      address,
      district,
      province,
      gender,
      religion,
      documentType,
      documentId,
      occupation,
    });
    const response = await kyc.save();
    if (response) {
      await User.findByIdAndUpdate(user_id, {
        $set: {
          status: "verified",
        },
      });
      res.json("Okay");
    }
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const response = await Kyc.find({ user: { _id: req.query.id } }).populate(
      "user",
      ["name", "email"]
    );
    res.send(response);
  } catch (error) {
    res.json(error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    let users = await User.find();
    res.send(users);
  } catch (error) {
    res.json(error.message);
  }
};

const addCrimeRecords = async (req, res) => {
  //validating req field
  const { error } = crimerecordValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const {
      userId,
      crimeNature,
      crimeStatus,
      imprisonment,
      bailAmount,
      RegisteredBy,
    } = req.body;
    await User.findByIdAndUpdate(userId, {
      $set: {
        isCriminal: true,
        crimes: {
          crimeNature,
          crimeStatus,
          imprisonment,
          bailAmount,
          RegisteredBy,
        },
      },
    });
    return res.status(200).json("success");
  } catch (error) {
    return error;
  }
};

const sendNotification = async (req, res) => {
  //save user locatin
  let userLocation = {
    lat: "1233434",
    lng: "123324234",
  };
  await Notifier(req, res);
  res.status(200).send(userLocation);
};

const getusercrimeRecord = async () => {
  const response = await User.find({ isCriminal: true }).select({
    name: 1,
    status: 1,
    crimes: {
      crimeNature: 1,
      crimeStatus: 1,
      imprisonment: 1,
      bailAmount: 1,
      RegisteredBy: 1,
    },
  });
  const result = [];
  response.map((crime) => {
    const { _id, name, status, crimes } = crime;
    const data = {
      _id,
      user: {
        name,
        status,
      },
      crimeNature: crimes.crimeNature,
      crimeStatus: crimes.crimeStatus,
      imprisonment: crimes.imprisonment,
      bailAmount: crimes.bailAmount,
      RegisteredBy: crimes.RegisteredBy,
    };
    result.push(data);
  });
  return result;
};

//getAll crime Records
const getAllCrimeRecords = async (req, res) => {
  try {
    const data1 = await getusercrimeRecord();
    let response = await CrimeModel.find().select({
      user: { name: 1 },
      status: 1,
      crimeNature: 1,
      crimeStatus: 1,
      imprisonment: 1,
      bailAmount: 1,
      RegisteredBy: 1,
    });
    if (response) {
      data1.map((data) => {
        response.unshift(data);
      });
      return res.status(200).json(response);
    }
  } catch (error) {
    return error;
  }
};

const saveAllCrimeRecords = async (req, res) => {
  const records = req.body;
  try {
    // await criminaldata.save();
    await CrimeModel.insertMany(records);
    res.status(200).send("success");
  } catch (error) {
    console.log(error);
    res.status(400).json({ "Cannot save data": error });
  }
};

const getCrimeUser = async (req, res) => {
  try {
    await CrimeModel.find({ _id: req.query.id }).then((response) => {
      if (!response) {
        res.status(404).send("User does not exists");
      }
      res.status(200).send(response);
    });
  } catch (error) {
    res.status(400).json({ "Cannot find user": error });
  }
};

const saveReport = async (req, res) => {
  const {
    incidentDate,
    incidentTime,
    incidentAddress,
    reportType,
    station,
    description,
  } = req.body;
  try {
    const report = new ReportModel({
      user: req.user._id,
      incidentDate,
      incidentTime,
      incidentAddress,
      reportType,
      station,
      description,
    });
    await report.save();
    const clientIO = req.app.get("socket");
    clientIO.emit("reportAlert", req.user);
    res.status(200).send("success");
  } catch (err) {
    res.status(400).json({ "cannot save data": err });
  }
};

const getReport = async (req, res) => {
  try {
    const police = req.user.name;
    await ReportModel.find({ station: police })
      .populate("user", ["name", "email"])
      .then((response) => {
        res.status(200).send(response);
      });
  } catch (error) {
    res.status(400).json({ "cannot get data": error });
  }
};

const getAllUserReports = async (req, res) => {
  try {
    const id = req.user._id;
    await ReportModel.find({ user: id }).then((response) => {
      res.status(200).send(response);
    });
  } catch (err) {
    res.status(400).json({ "cannot get data": error });
  }
};

const getEmergencyRequest = async (req, res) => {
  try {
    const response = await User.find({ request: true }).select({
      emergency_requests: 1,
      name: 1,
      email: 1,
      updatedAt: 1,
    });
    res.send(response);
  } catch (error) {
    res.status(400).json({ "cannot get data": error });
  }
};

module.exports = {
  getAllUserReports,
  userRegister,
  userLogin,
  kycContoller,
  getUser,
  getAllUsers,
  addCrimeRecords,
  getAllCrimeRecords,
  sendNotification,
  saveAllCrimeRecords,
  saveReport,
  getReport,
  getCrimeUser,
  getEmergencyRequest,
};
