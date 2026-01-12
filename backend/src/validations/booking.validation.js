const { body } = require("express-validator");

const createBookingValidation = [
  body("car_id").notEmpty().isInt({ min: 1 }).withMessage("car_id is required"),
  body("pickup_location").notEmpty().isString().withMessage("pickup_location is required"),
  body("drop_location").notEmpty().isString().withMessage("drop_location is required"),
  body("start_date").notEmpty().isISO8601().withMessage("start_date must be YYYY-MM-DD"),
  body("end_date").notEmpty().isISO8601().withMessage("end_date must be YYYY-MM-DD"),
];

module.exports = { createBookingValidation };
