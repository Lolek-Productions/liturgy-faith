#!/usr/bin/env node

/**
 * Test script for AWS SES email functionality
 * Usage: node scripts/test-email.js [recipient-email]
 */

require('dotenv').config({ path: '.env.local' })
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')

// Configuration
const TEST_EMAIL = process.argv[2] || process.env.TEST_EMAIL || 'test@example.com'
const FROM_EMAIL = process.env.AWS_SES_FROM_EMAIL || 'noreply@liturgy.faith'

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function sendTestEmail() {
  console.log('🧪 AWS SES Email Test')
  console.log('===================')
  console.log(`From: ${FROM_EMAIL}`)
  console.log(`To: ${TEST_EMAIL}`)
  console.log(`Region: ${process.env.AWS_REGION || 'us-east-1'}`)
  console.log('')

  // Validate environment variables
  const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_SES_FROM_EMAIL'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:')
    missingVars.forEach(varName => console.error(`   - ${varName}`))
    console.error('\nPlease check your .env.local file')
    process.exit(1)
  }

  const subject = 'AWS SES Test Email - Liturgy.faith'
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 30px 0;
            border-bottom: 1px solid #eee;
          }
          .content {
            padding: 30px 0;
          }
          .success {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            padding-top: 30px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Liturgy.faith</h1>
          <p>AWS SES Email Test</p>
        </div>
        <div class="content">
          <div class="success">
            <h2>✅ Email Test Successful!</h2>
            <p>Your AWS SES configuration is working correctly.</p>
          </div>
          <h3>Configuration Details:</h3>
          <ul>
            <li><strong>Region:</strong> ${process.env.AWS_REGION || 'us-east-1'}</li>
            <li><strong>From Email:</strong> ${FROM_EMAIL}</li>
            <li><strong>Test Time:</strong> ${new Date().toISOString()}</li>
          </ul>
          <p>This test email confirms that:</p>
          <ul>
            <li>AWS credentials are valid</li>
            <li>SES service is accessible</li>
            <li>Email sending functionality is operational</li>
            <li>HTML email formatting works correctly</li>
          </ul>
          <p>Your parish invitation system is ready to send emails!</p>
        </div>
        <div class="footer">
          <p>This is an automated test email from Liturgy.faith</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `
  
  const textBody = `
AWS SES Email Test - Liturgy.faith
=================================

✅ Email Test Successful!

Your AWS SES configuration is working correctly.

Configuration Details:
- Region: ${process.env.AWS_REGION || 'us-east-1'}
- From Email: ${FROM_EMAIL}
- Test Time: ${new Date().toISOString()}

This test email confirms that:
- AWS credentials are valid
- SES service is accessible
- Email sending functionality is operational

Your parish invitation system is ready to send emails!

---
This is an automated test email from Liturgy.faith
Generated on ${new Date().toLocaleString()}
  `

  try {
    console.log('📧 Sending test email...')
    
    const params = {
      Destination: {
        ToAddresses: [TEST_EMAIL],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: htmlBody,
          },
          Text: {
            Charset: 'UTF-8',
            Data: textBody,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: FROM_EMAIL,
    }

    const command = new SendEmailCommand(params)
    const response = await sesClient.send(command)
    
    console.log('✅ Test email sent successfully!')
    console.log(`📬 Message ID: ${response.MessageId}`)
    console.log(`📧 Check ${TEST_EMAIL} for the test email`)
    console.log('')
    console.log('🎉 Your AWS SES integration is working correctly!')
    
  } catch (error) {
    console.error('❌ Failed to send test email:')
    console.error('')
    
    if (error.name === 'MessageRejected') {
      console.error('🚫 Email was rejected by SES:')
      console.error(`   Reason: ${error.message}`)
      console.error('')
      console.error('💡 Common causes:')
      console.error('   - Sender email not verified in SES')
      console.error('   - Account in SES sandbox mode (recipient not verified)')
      console.error('   - Invalid email format')
    } else if (error.name === 'InvalidParameterValue') {
      console.error('📧 Invalid email address or parameter:')
      console.error(`   ${error.message}`)
    } else if (error.name === 'CredentialsError' || error.name === 'UnrecognizedClientException') {
      console.error('🔐 AWS credentials issue:')
      console.error(`   ${error.message}`)
      console.error('')
      console.error('💡 Check your AWS credentials:')
      console.error('   - AWS_ACCESS_KEY_ID')
      console.error('   - AWS_SECRET_ACCESS_KEY')
      console.error('   - AWS_REGION')
    } else {
      console.error(`${error.name}: ${error.message}`)
    }
    
    console.error('')
    console.error('🔧 Troubleshooting tips:')
    console.error('   1. Verify your email address in AWS SES console')
    console.error('   2. Check if your AWS account is in SES sandbox mode')
    console.error('   3. Ensure AWS credentials have SES permissions')
    console.error('   4. Verify the recipient email if in sandbox mode')
    
    process.exit(1)
  }
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Main execution
if (!isValidEmail(TEST_EMAIL)) {
  console.error('❌ Invalid email address format:', TEST_EMAIL)
  console.error('Usage: node scripts/test-email.js recipient@example.com')
  process.exit(1)
}

console.log('Starting AWS SES email test...\n')
sendTestEmail().catch(console.error)