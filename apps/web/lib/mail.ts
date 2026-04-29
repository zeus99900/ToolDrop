import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'ToolDrop <onboarding@resend.dev>'; 
const REPLY_TO = 'support@tooldrop.ca';

const isMailEnabled = !!resend && !!process.env.RESEND_API_KEY;

/**
 * Send a welcome email to a new user.
 */
export async function sendWelcomeEmail(to: string, firstName: string) {
  if (!isMailEnabled || !resend) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Welcome to ToolDrop! 🛠️',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
          <h1 style="color: #4f46e5;">Welcome to ToolDrop, ${firstName}!</h1>
          <p>We're thrilled to have you in our community of neighbors sharing tools.</p>
          <p>You can now start browsing thousands of tools in your area or list your own to start earning.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/tools" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Browse Tools</a>
          </div>
          <p>If you have any questions, just reply to this email.</p>
          <p>Happy building,<br>The ToolDrop Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

/**
 * Notify a lender about a new booking request.
 */
export async function sendBookingRequestEmail(to: string, lenderName: string, renterName: string, toolName: string) {
  if (!isMailEnabled || !resend) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `New booking request for your ${toolName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
          <h2 style="color: #4f46e5;">New Booking Request</h2>
          <p>Hi ${lenderName},</p>
          <p><strong>${renterName}</strong> wants to rent your <strong>${toolName}</strong>.</p>
          <p>Please head over to your dashboard to accept or decline the request.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/lender" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Request</a>
          </div>
          <p>The ToolDrop Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending booking request email:', error);
  }
}

/**
 * Notify a renter that their booking has been confirmed.
 */
export async function sendBookingConfirmationEmail(to: string, renterName: string, toolName: string) {
  if (!isMailEnabled || !resend) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Booking Confirmed: ${toolName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
          <h2 style="color: #10b981;">Your Booking is Confirmed!</h2>
          <p>Hi ${renterName},</p>
          <p>Good news! Your booking for the <strong>${toolName}</strong> has been confirmed by the lender.</p>
          <p>You can now message the lender to coordinate pickup or delivery.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Booking Details</a>
          </div>
          <p>Enjoy your project!<br>The ToolDrop Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
  }
}

/**
 * Notify a user about a new message.
 */
export async function sendNewMessageEmail(to: string, recipientName: string, senderName: string, messagePreview: string) {
  if (!isMailEnabled || !resend) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `New message from ${senderName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
          <h2 style="color: #4f46e5;">New Message</h2>
          <p>Hi ${recipientName},</p>
          <p><strong>${senderName}</strong> sent you a message:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-style: italic; margin: 20px 0;">
            "${messagePreview}"
          </div>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/messages" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reply Now</a>
          </div>
          <p>The ToolDrop Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending message email:', error);
  }
}
