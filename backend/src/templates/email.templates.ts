export const getWelcomeEmailTemplate = (name: string, clientUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #0d0d12; color: #ffffff; padding: 40px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #16161e, #1a1a24); border-radius: 12px; padding: 40px; border: 1px solid #2d2d3a; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #8b5cf6; font-size: 28px; margin: 0; font-weight: 700; }
    .content { font-size: 16px; line-height: 1.6; color: #cbd5e1; }
    .button-container { text-align: center; margin: 40px 0; }
    .button { background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; }
    .footer { text-align: center; font-size: 13px; color: #64748b; margin-top: 40px; padding-top: 20px; border-top: 1px solid #2d2d3a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Evolvix AI</h1>
    </div>
    <div class="content">
      <p>Hello ${name},</p>
      <p>Welcome to <strong>Evolvix AI</strong>! We are thrilled to have you on board. Your account has been successfully created, and you are now ready to unleash the power of autonomous AI social media management.</p>
      
      <div class="button-container">
        <a href="${clientUrl}/login" class="button">Log In to Your Dashboard</a>
      </div>
      
      <p>If you have any questions, simply reply to this email. We're here to help you scale.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Evolvix AI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const getPaymentPendingTemplate = (clientUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #0d0d12; color: #ffffff; padding: 40px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #16161e, #1a1a24); border-radius: 12px; padding: 40px; border: 1px solid #2d2d3a; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #f59e0b; font-size: 28px; margin: 0; font-weight: 700; }
    .content { font-size: 16px; line-height: 1.6; color: #cbd5e1; }
    .footer { text-align: center; font-size: 13px; color: #64748b; margin-top: 40px; padding-top: 20px; border-top: 1px solid #2d2d3a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Received</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We have successfully received your manual payment screenshot. Our administrative team is currently reviewing your transaction.</p>
      <p>This process usually takes less than 24 hours. We will notify you the moment your PRO subscription is activated!</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Evolvix AI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const getPaymentApprovedTemplate = (clientUrl: string, plan: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #0d0d12; color: #ffffff; padding: 40px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #16161e, #1a1a24); border-radius: 12px; padding: 40px; border: 1px solid #2d2d3a; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #10b981; font-size: 28px; margin: 0; font-weight: 700; }
    .content { font-size: 16px; line-height: 1.6; color: #cbd5e1; }
    .button-container { text-align: center; margin: 40px 0; }
    .button { background: linear-gradient(135deg, #10b981, #059669); color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; }
    .footer { text-align: center; font-size: 13px; color: #64748b; margin-top: 40px; padding-top: 20px; border-top: 1px solid #2d2d3a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Approved!</h1>
    </div>
    <div class="content">
      <p>Great news!</p>
      <p>Your manual payment has been verified and your <strong>${plan}</strong> subscription is now active.</p>
      
      <div class="button-container">
        <a href="${clientUrl}/dashboard" class="button">Access Your Pro Dashboard</a>
      </div>
      
      <p>Thank you for choosing Evolvix AI.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Evolvix AI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const getPostPublishedTemplate = (platform: string, postUrl?: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #0d0d12; color: #ffffff; padding: 40px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #16161e, #1a1a24); border-radius: 12px; padding: 40px; border: 1px solid #2d2d3a; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #3b82f6; font-size: 28px; margin: 0; font-weight: 700; }
    .content { font-size: 16px; line-height: 1.6; color: #cbd5e1; }
    .button-container { text-align: center; margin: 40px 0; }
    .button { background: linear-gradient(135deg, #3b82f6, #2563eb); color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; }
    .footer { text-align: center; font-size: 13px; color: #64748b; margin-top: 40px; padding-top: 20px; border-top: 1px solid #2d2d3a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Post is Live! 🚀</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your scheduled AI content has been successfully published to <strong>${platform}</strong>!</p>
      
      ${postUrl ? `
      <div class="button-container">
        <a href="${postUrl}" class="button">View Post on ${platform}</a>
      </div>
      ` : ''}
      
      <p>The analytics engine will start tracking engagement metrics automatically.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Evolvix AI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
