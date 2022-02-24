const router = require("express").Router();

const {
  loginPolice,
  registerPolice,
  save_userLocation,
  get_policeLocation,
  save_Contact,
} = require("../controllers/police.controller");

const { auth } = require("../utils/middlewares/auth");

//login route for police
router.post("/police/login", loginPolice);
//singup route
router.post("/police/signup", registerPolice);

//save location
router.put("/save_userLocation", auth, save_userLocation);

//get location
router.get("/police_locations", get_policeLocation);

router.post("/send/message", save_Contact);

module.exports = router;
