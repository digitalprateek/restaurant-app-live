const express = require('express');
const router = express.Router();
const catchAsync = require('../core/catchAsync');
const { BadRequestError } = require('../core/ApiError');
const nodemailer = require('nodemailer');

// Configure Nodemailer with Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com', 
  port: 587, // TLS (use 465 if SSL is required)
  secure: false, // false for TLS, true for SSL
  auth: {
    user: 'contact@restaurant.websetgram.com',
    pass: 'Contact@1234567890',
  },
});

// Contact Route
router.post('/', catchAsync(async (req, res) => {
    console.log('req received');
  const { name, email, message } = req.body;
  console.log(req.body);
  
  if (!name || !email || !message) {
    throw new BadRequestError("All fields are required.");
  }
console.log("received content. Sending now");
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'digitalprateek5@gmail.com', // Your receiving email
    subject: `New Contact Form Submission from ${name}`,
    text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };
console.log(mailOptions);
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({ message: "Your message has been sent successfully" });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error("Failed to send email. Please try again later.");
  }
}));

module.exports = router;
