import { NextResponse } from 'next/server';
import twilio from 'twilio';
import connectToDatabase from '../../../lib/mongodb';
import Todo from '../../../lib/models/Todo';

// Optional: Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

// Ensure this route runs dynamically
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    // Find todos that need reminders right now (e.g. reminderTime is within the next 15 mins)
    const now = new Date();
    const fifteenMinsFromNow = new Date(now.getTime() + 15 * 60000);

    const pendingReminders = await Todo.find({
      reminderTime: { $lte: fifteenMinsFromNow, $gt: now },
      whatsappNumber: { $ne: '' },
    });

    for (const todo of pendingReminders) {
      const msg = `TaskFlow Reminder: "${todo.title}" is due soon!\nNotes: ${todo.notes}`;

      console.log(
        `[Twilio Mock] Sending WhatsApp to ${todo.whatsappNumber}: ${msg}`,
      );

      if (client) {
        // Send a real WhatsApp if Twilio is configured
        // Requires format 'whatsapp:+1234567890'
        await client.messages.create({
          body: msg,
          from: 'whatsapp:+14155238886', // Twilio sandbox number
          to: `whatsapp:${todo.whatsappNumber}`,
        });
      }

      // Clear the reminder so we don't spam them repeatedly
      todo.reminderTime = null;
      await todo.save();
    }

    return NextResponse.json({ success: true, count: pendingReminders.length });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
