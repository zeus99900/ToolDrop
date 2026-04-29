import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

/**
 * Send an SMS message using Twilio.
 */
export async function sendSMS(to: string, body: string) {
  try {
    // Basic phone number normalization (needs + sign)
    const formattedTo = to.startsWith('+') ? to : `+1${to.replace(/\D/g, '')}`;
    
    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedTo,
    });

    console.log(`SMS sent: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error };
  }
}

/**
 * Specific templates for common actions
 */
export async function notifyLenderOfBooking(lenderPhone: string, renterName: string, toolName: string) {
  if (!lenderPhone) return;
  
  const body = `[ToolDrop] New Request! ${renterName} wants to rent your ${toolName}. View details: ${process.env.NEXTAUTH_URL}/lender`;
  return sendSMS(lenderPhone, body);
}

export async function notifyUserOfMessage(userPhone: string, senderName: string, messagePreview: string) {
  if (!userPhone) return;
  
  const body = `[ToolDrop] New Message from ${senderName}: "${messagePreview.substring(0, 50)}..."`;
  return sendSMS(userPhone, body);
}
