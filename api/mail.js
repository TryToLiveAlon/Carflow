import nodemailer from "nodemailer";
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";

const TOKENS_URL = "https://raw.githubusercontent.com/TryToLiveAlon/Resource/refs/heads/main/tokens.txt";

const fetchTokens = async () => {
  try {
    const response = await fetch(TOKENS_URL);
    const text = await response.text();
    return text.split(/\r?\n/).filter(line => line.trim() !== "");
  } catch (err) {
    console.error("Failed to fetch token list:", err.message);
    return [];
  }
};

const sendEmail = async (req, res) => {
  try {
    const {
      from,
      password,
      to,
      subject,
      userToken, // ✅ Add this to your request body
      isHtml,
      useTemplate,
      xmlUrl,
      attachmentUrl,
      content,
      ...params
    } = req.body;

    // 🔒 Require token
    if (!userToken) {
      return res.status(403).json({
        error: "Missing 'userToken' parameter",
        hint: "You are not allowed to use this API",
        provider: "https://t.me/TryToLiveAlone"
      });
    }

    const validTokens = await fetchTokens();
    if (!validTokens.includes(userToken)) {
      return res.status(403).json({
        error: "Invalid token: Access denied",
        hint: "This service is not for you",
        provider: "https://t.me/TryToLiveAlone"
      });
    }

    // 🛂 Validate required fields
    if (!from || !password || !to || !subject) {
      return res.status(400).json({
        error: "Missing required fields: from, password, to, subject",
        IMPORTANT: {
          provider: "https://t.me/TryToLiveAlone",
          documentation: "https://teleapi-two.vercel.app/docs/getting-started/mailer/introduction"
        }
      });
    }

    let emailContent = content || "";

    // 📄 XML template parsing
    if (useTemplate && xmlUrl) {
      try {
        const response = await fetch(xmlUrl);
        const xmlText = await response.text();
        const parsedXml = await parseStringPromise(xmlText);

        if (parsedXml.email && parsedXml.email.template) {
          emailContent = parsedXml.email.template[0];
          emailContent = emailContent.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
        } else {
          return res.status(400).json({
            error: "Invalid XML structure. 'template' not found.",
            IMPORTANT: {
              provider: "https://t.me/TryToLiveAlone",
              documentation: "https://teleapi-two.vercel.app/docs/getting-started/mailer/introduction"
            }
          });
        }
      } catch (error) {
        return res.status(500).json({
          error: "Failed to fetch or parse XML template",
          details: error.message,
          IMPORTANT: {
            provider: "https://t.me/TryToLiveAlone",
            documentation: "https://teleapi-two.vercel.app/docs/getting-started/mailer/introduction"
          }
        });
      }
    }

    // 📧 Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: from, pass: password },
    });

    let mailOptions = {
      from,
      to,
      subject,
      text: isHtml ? undefined : emailContent,
      html: isHtml ? emailContent : undefined,
      attachments: [],
    };

    // 📎 Attachment support
    if (attachmentUrl) {
      try {
        const fileResponse = await fetch(attachmentUrl);
        const fileBuffer = await fileResponse.buffer();
        const fileName = attachmentUrl.split("/").pop();

        mailOptions.attachments.push({
          filename: fileName,
          content: fileBuffer,
        });
      } catch (error) {
        return res.status(500).json({
          error: "Failed to fetch attachment",
          details: error.message,
          IMPORTANT: {
            provider: "https://t.me/TryToLiveAlone",
            documentation: "https://teleapi-two.vercel.app/docs/getting-started/mailer/introduction"
          }
        });
      }
    }

    // ✉️ Send the email
    const info = await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      messageId: info.messageId,
      IMPORTANT: {
        provider: "https://t.me/TryToLiveAlone",
        documentation: "https://teleapi-two.vercel.app/docs/getting-started/mailer/introduction"
      }
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to send email",
      details: error.message,
      IMPORTANT: {
        provider: "https://t.me/TryToLiveAlone",
        documentation: "https://teleapi-two.vercel.app/docs/getting-started/mailer/introduction"
      }
    });
  }
};

export default sendEmail;
