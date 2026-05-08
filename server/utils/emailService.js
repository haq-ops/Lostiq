const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Found item post பண்ணும்போது — matching lost item owners-க்கு email அனுப்பு
const sendMatchEmail = async (toEmail, toName, foundItem, lostItem) => {
  try {
    await transporter.sendMail({
      from: `"Lostiq" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `🎉 Someone found your ${lostItem.category} in ${foundItem.location?.city}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          
          <div style="background: #1E3A5F; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #FF6B35; margin: 0;">Lostiq</h1>
            <p style="color: white; margin: 5px 0;">Lost & Found Platform</p>
          </div>

          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1E3A5F;">Hi ${toName}! 👋</h2>
            <p style="color: #555;">Good news! Someone found an item that might be yours!</p>

            <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #FF6B35;">
              <h3 style="color: #FF6B35; margin: 0 0 10px 0;">🟢 Found Item</h3>
              <p><strong>Title:</strong> ${foundItem.title}</p>
              <p><strong>Category:</strong> ${foundItem.category}</p>
              <p><strong>Location:</strong> ${foundItem.location?.city}</p>
              <p><strong>Date Found:</strong> ${new Date(foundItem.date).toLocaleDateString()}</p>
            </div>

            <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #1E3A5F;">
              <h3 style="color: #1E3A5F; margin: 0 0 10px 0;">🔴 Your Lost Item</h3>
              <p><strong>Title:</strong> ${lostItem.title}</p>
              <p><strong>Category:</strong> ${lostItem.category}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/items/${foundItem._id}" 
                style="background: #FF6B35; color: white; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 16px;">
                View Found Item →
              </a>
            </div>

            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated message from Lostiq. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    });
    console.log(`✅ Email sent to ${toEmail}`);
  } catch (error) {
    console.error('Email error:', error);
  }
};

module.exports = { sendMatchEmail };