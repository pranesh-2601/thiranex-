const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const nodemailer = require('nodemailer');

// Rate limiting helper (simple in-memory, use express-rate-limit in prod)
const submissions = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip;
  if (!submissions.has(key)) {
    submissions.set(key, []);
  }
  const times = submissions.get(key).filter(t => now - t < RATE_LIMIT_WINDOW);
  submissions.set(key, times);
  if (times.length >= RATE_LIMIT_MAX) return false;
  times.push(now);
  return true;
}

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    
    // Rate limit check
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ success: false, message: 'Too many messages. Try again later.' });
    }

    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    // Save to database
    const saved = await Message.create({ name, email, subject, message, ip });

    // Send email notification (optional - configure .env)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_TO || process.env.EMAIL_USER,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <h3>New message from your portfolio</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        });
      } catch (emailErr) {
        console.warn('Email notification failed (message still saved):', emailErr.message);
      }
    }

    res.status(201).json({ success: true, message: 'Message sent successfully!', id: saved._id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// GET /api/contact - Get all messages (admin)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
