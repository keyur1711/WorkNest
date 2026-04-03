const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendContactNotification } = require('../services/emailService');
const router = express.Router();
router.post(
  '/',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('subject').optional().trim(),
    body('company').optional().trim(),
    body('phone').optional().trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { fullName, email, message, subject, company, phone } = req.body;
      console.log('Contact form submission:', {
        fullName,
        email,
        subject: subject || 'General inquiry',
        company,
        phone,
        messageLength: message?.length
      });

      let emailSent = false;
      try {
        const result = await sendContactNotification({
          fullName,
          email,
          message,
          subject,
          company,
          phone
        });
        emailSent = Boolean(result?.success);
      } catch (mailErr) {
        console.error('Contact email failed:', mailErr.message);
      }

      return res.status(201).json({
        message: 'Thank you for contacting us! We will get back to you soon.',
        submitted: true,
        emailSent
      });
    } catch (error) {
      console.error('Contact form error:', error);
      return res.status(500).json({ message: 'Failed to submit contact form' });
    }
  }
);
module.exports = router;