const {
  userLogin,
  userRegister,
  kycContoller,
  getUser,
  getAllUsers,
  addCrimeRecords,
  getAllCrimeRecords,
  saveAllCrimeRecords,
  saveReport,
  getReport,
  getCrimeUser,
  getAllUserReports,
  getEmergencyRequest,
} = require("../controllers/user.controller");
const { auth, userAuth } = require("../utils/middlewares/auth");
const router = require("express").Router();

const User = require("../models/user.model");
const {
  resetPassword,
  sendEmail,
} = require("../controllers/police.controller");
//login route
router.post("/login", userLogin);
//singup route
router.post("/signup", userRegister);
//kyc verification route
router.post("/verifyKyc", userAuth, kycContoller);

//private route for getting user
router.get("/user", getUser);
router.get("/users", auth, getAllUsers);
router.get("/crimeUser", getCrimeUser);
//add crime record
router.put("/user/addcrimeRecords", auth, addCrimeRecords);
router.get("/user/crimeRecords", getAllCrimeRecords);
router.post("/user/uploadcsv", auth, saveAllCrimeRecords);

//report route
router.post("/user/addReport", userAuth, saveReport);
router.get("/user/reports", auth, getReport);
router.get("/user/allreports", userAuth, getAllUserReports);
router.get("/allrequests", getEmergencyRequest);

router.post("/user-location", userAuth, async (req, res) => {
  const data = req.body;
  const newObj = {
    coordinates: data,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  };
  const clientIO = req.app.get("socket");
  clientIO.emit("locationSignal", newObj);
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      request: true,
      emergency_requests: newObj.coordinates,
    },
  });
  res.send("Okay");
});

router.post("/resetpw", sendEmail);

router.post("/confirmpw", resetPassword);
module.exports = router;
