import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, phone, message } = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    // Use a verified sender email from Resend
    const fromEmail = "noreply@yourdomain.com"; // <-- Replace with verified email in Resend

    // Send the email
    const response = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO_EMAIL], 
      subject: `New message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    console.log("Resend response:", response);

    return new Response(JSON.stringify({ message: "Email sent successfully" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error sending email:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to send email" }), {
      status: 500,
    });
  }
}
