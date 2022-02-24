const Joi = require("joi");

//validating req.body for signup
const signupValidator = (req) => {
  //defining schema
  const schema = Joi.object({
    id: Joi.number().min(6).required(),
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(8).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
    address: Joi.string().min(5).max(50).required(),
    phone: Joi.number().min(10).required(),
  });

  return schema.validate(req);
};

//validating req.body for login

const loginValidator = (req) => {
  //define schema
  const schema = Joi.object({
    email: Joi.string().min(8).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(req);
};

//validating req.body for kyc
const kycValidator = (req) => {
  //defining schema
  const schema = Joi.object({
    number: Joi.number().required(),
    address: Joi.string().min(5).max(255).required(),
    incidentDate: Joi.string().required(),
    province: Joi.number().required(),
    district: Joi.string().required(),
    gender: Joi.string().required(),
    occupation: Joi.string().required(),
    religion: Joi.string().min(5).max(50).required(),
    documentType: Joi.string().required(),
    documentId: Joi.string().required(),
  });

  return schema.validate(req);
};

//validating req.body for kyc
const postValidator = (req) => {
  //defining schema
  const schema = Joi.object({
    title: Joi.string().min(4).max(16).required(),
    description: Joi.string().max(255).required(),
    // imageUrl: Joi.string().required(),
  });

  return schema.validate(req);
};

//validating req.body for signup of user
const userSignupValidator = (req) => {
  //defining schema
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(8).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(req);
};

//validating req.body for crimeRecords of user
const crimerecordValidator = (req) => {
  //defining schema
  const schema = Joi.object({
    userId: Joi.string().min(6).required(),
    crimeNature: Joi.string().min(4).max(50).required(),
    crimeStatus: Joi.string().min(4).max(50).required(),
    imprisonment: Joi.string().min(2).max(50).required(),
    bailAmount: Joi.number().required(),
    RegisteredBy: Joi.string().required().min(6).max(50),
  });

  return schema.validate(req);
};

module.exports = {
  signupValidator,
  loginValidator,
  kycValidator,
  postValidator,
  userSignupValidator,
  crimerecordValidator,
};
