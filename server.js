// Load env first
require("dotenv").config();
console.log("Loaded EMAIL_USER:", process.env.EMAIL_USER);
console.log("Loaded EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Exists" : "❌ Missing");
console.log("Loaded EMAIL_TO:", process.env.EMAIL_TO ? "✅ Exists" : "❌ Missing");

const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors({
  origin: "*", 
}));

// Parsers & static
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// --- Nodemailer transporter (one instance) ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- Helper to build mail options for each form ---
const getMailOptions = (formType, formData) => {
  if (formType === "contact") {
    return {
      from: `"BLSF Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER, // allow custom recipient
      replyTo: formData.email, // replies go to the sender
      subject: `New Contact Form: ${formData.name}`,
      text:
`You have a new contact form submission:

Name: ${formData.name}
Email: ${formData.email}
Message:
${formData.message}`,
    };
  }

  if (formType === "volunteer") {
    return {
      from: `"BLSF Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: formData.email,
      subject: `New Volunteer Signup: ${formData.name}`,
      text:
`A new volunteer signed up:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "-"}
Availability: ${formData.availability || "-"}
Skills: ${formData.skills || "-"}
Motivation: ${formData.motivation || "-"}
Other Notes: ${formData.notes || "-"}
`,
    };
  }

  // Fallback (shouldn't happen if used correctly)
  return {
    from: `"BLSF Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: "New Form Submission",
    text: JSON.stringify(formData, null, 2),
  };
};

// --- Routes ---
// Contact form endpoint
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, msg: "Missing fields." });
    }

    const mailOptions = getMailOptions("contact", { name, email, message });
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent (contact):", info.response);
    res.json({ success: true, msg: "Message sent successfully!" });
  } catch (err) {
    console.error("Contact send error:", err);
    res.status(500).json({ success: false, msg: "Error sending message." });
  }
});

// Volunteer form endpoint
app.post("/volunteer", async (req, res) => {
  try {
    const { name, email, phone, availability, skills, motivation, notes } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, msg: "Name and email are required." });
    }

    const mailOptions = getMailOptions("volunteer", {
      name, email, phone, availability, skills, motivation, notes
    });
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent (volunteer):", info.response);
    res.json({ success: true, msg: "Volunteer signup received!" });
  } catch (err) {
    console.error("Volunteer send error:", err);
    res.status(500).json({ success: false, msg: "Error sending signup." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
