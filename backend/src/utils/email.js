const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ruturajvidhate5656@gmail.com",
        pass: "fwke zazb wtgw aiwa"
    }
});

const sendOTP = async (email, otp) => {
    await transporter.sendMail({
        from: "ruturajvidhate5656@gmail.com",
        to: email,
        subject: "Login OTP Verification - Car Rental Service",
        html: `<h2>Your OTP is ${otp}</h2><p>Valid for 5 minutes</p>`
    });
};

module.exports = sendOTP;

