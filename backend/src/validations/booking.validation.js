const { body } = require("express-validator");

const createBookingValidation = [
  body("car_id").notEmpty().isInt({ min: 1 }).withMessage("car_id is required"),
  body("pickup_location").notEmpty().isString().withMessage("pickup_location is required"),
  body("drop_location").notEmpty().isString().withMessage("drop_location is required"),

  body("booking_mode")
    .optional()
    .isIn(["RENTAL", "TRANSFER"])
    .withMessage("booking_mode must be RENTAL or TRANSFER"),

  body("start_date").notEmpty().isISO8601().withMessage("start_date must be YYYY-MM-DD"),

  // ✅ end_date required only when RENTAL
  body("end_date").custom((value, { req }) => {
    const mode = req.body.booking_mode || "RENTAL";
    if (mode === "TRANSFER") return true; // optional
    if (!value) throw new Error("end_date is required for RENTAL");
    return true;
  }),

  body("end_date")
    .optional()
    .isISO8601()
    .withMessage("end_date must be YYYY-MM-DD"),

  body("start_time").optional().isString(),
];

module.exports = { createBookingValidation };
