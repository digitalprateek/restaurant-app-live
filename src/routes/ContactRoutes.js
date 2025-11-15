// const express = require('express');
// const router = express.Router();
// const catchAsync = require('../core/catchAsync');
// const { BadRequestError } = require('../core/ApiError');
// const nodemailer = require('nodemailer');

// // Production-grade transporter configuration
// const transporter = nodemailer.createTransport({
//   host: 'smtp.hostinger.com',
//   port: process.env.NODE_ENV === 'production' ? 465 : 587, // 587 for non-SSL (TLS)
//   secure: process.env.NODE_ENV === 'production',           // true if port = 465 (SSL)
//   pool: true,
//   maxConnections: 10, // Increased for production load
//   maxMessages: 500,
//   connectionTimeout: 15000, // More generous timeout
//   auth: {
//     user: process.env.contactEmail,
//     pass: process.env.contactPass,
//   },
//   tls: {
//     minVersion: 'TLSv1.2', // Enforce modern security
//     rejectUnauthorized: true
//   },
// });

// // Critical security validation
// transporter.verify((error) => {
//   if (error) {
//     console.error('SMTP Permanent Failure:', error);
//     // Crash in production to force a restart (optional strategy):
//     if (process.env.NODE_ENV === 'production') process.exit(1);
//   }
// });

// // Global error handler for SMTP pool
// transporter.on('error', (error) => {
//   console.error('SMTP Connection Error:', error);
//   // Could implement retry logic or alerting here
// });

// router.post('/', catchAsync(async (req, res) => {
//   const { name, email, message, subject } = req.body;
  
//   // Enhanced validation
//   if (!name?.trim() || !email?.trim() || !message?.trim() || !subject?.trim()) {
//     throw new BadRequestError("All fields are required.");
//   }

//   // Email format validation
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     throw new BadRequestError("Invalid email format");
//   }

//   const mailOptions = {
//     from: `Website Contact <${process.env.contactEmail}>`,  // Professional "from"
//     replyTo: `"${name}" <${email}>`,                       // Allows direct replies to the sender
//     to: 'digitalprateek5@gmail.com',
//     subject: `Dine & dash contact: ${subject.substring(0, 50)}`,   // Prevent overly long subjects
//     text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
//     html: `<div>
//       <h3>New Contact Form Submission</h3>
//       <p><strong>Name:</strong> ${name}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Subject:</strong> ${subject}</p>
//       <p><strong>Message:</strong></p>
//       <pre>${message}</pre>
//     </div>`
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: "Your message has been sent successfully" });
//   } catch (error) {
//     console.error('Email Error:', error);
//     throw new Error(
//       process.env.NODE_ENV === 'production' 
//         ? "Failed to send message. Please try again later."
//         : `Email Error: ${error.message}`
//     );
//   }
// }));

// module.exports = router;

