const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  // Joi Validation
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin', 'premium') // Optional role for testing
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    return next(new Error(error.details[0].message));
  }

  const { username, email, password, role } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user'
    });

    if (user) {
        // Send Welcome Email (Requirement 7.2)
        let transporter;
        
        if (process.env.EMAIL_SERVICE === 'Mailgun') {
            const auth = {
                auth: {
                    api_key: process.env.MAILGUN_API_KEY,
                    domain: process.env.MAILGUN_DOMAIN
                }
            };
            transporter = nodemailer.createTransport(mg(auth));
            console.log("Mailgun API Transport Configured");
            
        } else if (process.env.EMAIL_SERVICE === 'ethereal') {
             let testAccount = await nodemailer.createTestAccount();
             transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, 
                auth: {
                    user: testAccount.user, 
                    pass: testAccount.pass, 
                },
            });
            console.log("Ethereal Email Setup Complete");
        } else if (process.env.EMAIL_SERVICE === 'smtp') {
             transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            console.log("SMTP Transport Configured");
        } else {
             // Fallback
             transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE, 
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM || `"Expense Tracker App" <postmaster@${process.env.MAILGUN_DOMAIN}>`,
            to: email,
            subject: 'Welcome to Expense Tracker!',
            text: `Hi ${username}, welcome to your new expense manager. Start tracking today!`,
            html: `<b>Hi ${username}</b>,<br>Welcome to your new expense manager. Start tracking today!`
        };

        // We wrap sendMail in a try-catch so it doesn't fail the registration if email fails
        try {
            let info = await transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            if(process.env.EMAIL_SERVICE === 'ethereal') {
                 console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }
        } catch (emailError) {
            console.error("Email sending failed:", emailError.message);
        }

      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
   // Joi Validation
   const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    return next(new Error(error.details[0].message));
  }

  const { email, password } = req.body;

  try {
    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};
