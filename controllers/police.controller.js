const Police = require("../models/police");
const Contact = require("../models/contact.model");
const bcrypt = require("bcrypt");
const { signupValidator, loginValidator } = require("../utils/reqValidator");
const RandomNumber = require("../utils/helper/test");
const Mailer = require("../utils/helper/Mailer");

//register police
const registerPolice = async (req, res) => {
  const { id, name, email, password, address, phone } = req.body;
  //validating req field
  const { error } = signupValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check for existing users
  try {
    const result = await Police.findOne({ email });
    if (result) {
      return res.status(400).send("User already exists");
    } else {
      //create new user
      const newEmail = email.toLowerCase();
      const police = new Police({
        id,
        name,
        email: newEmail,
        password,
        address,
        phone,
      });
      //hasing user password to store in db
      const salt = await bcrypt.genSalt(10);
      police.password = await bcrypt.hash(police.password, salt);
      //save user
      await police.save();
      return res.status(200).json({
        message: "success",
      });
    }
  } catch (error) {
    res.json(error.message);
  }
};

//login police
const loginPolice = async (req, res) => {
  const { email, password } = req.body;
  //validation login input fields
  const { error } = loginValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    //check for user in database
    // const newEmail = email.toLowerCase()
    let police = await Police.findOne({ email: email.toLowerCase() });
    if (!police) return res.status(400).send("Invalid email or password.");

    //compare password
    const validPassword = await bcrypt.compare(password, police.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");
    //generate token
    const token = police.generateAuthToken();
    //send token as response
    res.send(token);
  } catch (error) {
    res.json(error.message);
  }
};

//save user locatin

const save_userLocation = async (req, res) => {
  const { lat, lng } = req.body;
  const user = req.user._id;
  const userLocation = await Police.findByIdAndUpdate(user, {
    $set: {
      location: {
        lat,
        lng,
      },
    },
  });
  return res.json(userLocation);
};

//get all police location
const get_policeLocation = async (req, res) => {
  const response = await Police.find();
  const locationArray = [];
  if (response) {
    response.map((user) => locationArray.push(user.location));
    return res.json(locationArray);
  }
};
const sendEmail = async (req, res) => {
  const number = await RandomNumber(119000, 999898);
  const email = req.body.email;
  await Mailer(email, number);
  try {
    //hasing new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashotp = await bcrypt.hash(number, salt);
    await Police.findOneAndUpdate(email, {
      $set: {
        otp: hashotp,
      },
    });
    res.json("okay");
  } catch (error) {
    res.json(error.message);
  }
};

const resetPassword = async (req, res) => {
  const { email, password, number } = req.body;
  console.log(req.body, "reset");
  //check for user in database
  let police = await Police.findOne({ email });
  if (!police) return res.status(400).send("User doesnot exist.");
  //compare otp
  const validOtp = await bcrypt.compare(number, police.otp);
  if (!validOtp) return res.status(400).send("Invalid OTP code.");

  //finally update the password
  try {
    //hasing new password before saving
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    await Police.findOneAndUpdate(email, {
      $set: {
        password: newPassword,
      },
    });
    res.json("okay");
  } catch (error) {
    res.json(error.message);
  }
};

const save_Contact = async (req, res) => {
  console.log(req.body);
  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  try {
    await contact.save();
    res.redirect("/");
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  registerPolice,
  loginPolice,
  save_userLocation,
  get_policeLocation,
  resetPassword,
  sendEmail,
  save_Contact,
};
