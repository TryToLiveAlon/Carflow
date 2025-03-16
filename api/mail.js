import nodemailer from "nodemailer";
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";

const sendEmail = async (req, res) => {
    try {
        const { from, password, to, subject, isHtml, useTemplate, xmlUrl, attachmentUrl, content, ...params } = req.body;

        if (!from || !password || !to || !subject) {
            return res.status(400).json({
                error: "Missing required fields: from, password, to, subject",
                IMPORTANT: {
                    provider: "https://t.me/TryToLiveAlone",
                    documentation: "https://death-docs.vercel.app/API/Quick%20Start"
                }
            });
        }

        let emailContent = content || "";

        // Fetch and parse XML template if provided
        if (useTemplate && xmlUrl) {
            try {
                const response = await fetch(xmlUrl);
                const xmlText = await response.text();
                const parsedXml = await parseStringPromise(xmlText);

                if (parsedXml.email && parsedXml.email.template) {
                    emailContent = parsedXml.email.template[0];

                    // Replace placeholders {key} with values from params
                    emailContent = emailContent.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
                } else {
                    return res.status(400).json({
                        error: "Invalid XML structure. 'template' not found.",
                        IMPORTANT: {
                            provider: "https://t.me/TryToLiveAlone",
                            documentation: "https://death-docs.vercel.app/API/Quick%20Start"
                        }
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    error: "Failed to fetch or parse XML template",
                    details: error.message,
                    IMPORTANT: {
                        provider: "https://t.me/TryToLiveAlone",
                        documentation: "https://death-docs.vercel.app/API/Quick%20Start"
                    }
                });
            }
        }

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: from, pass: password },
        });

        // Email options
        let mailOptions = {
            from,
            to,
            subject,
            text: isHtml ? undefined : emailContent,
            html: isHtml ? emailContent : undefined,
            attachments: [],
        };

        // Handle attachments
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
                        documentation: "https://death-docs.vercel.app/API/Quick%20Start"
                    }
                });
            }
        }

        // Send email
        const info = await transporter.sendMail(mailOptions);
        res.json({
            success: true,
            messageId: info.messageId,
            IMPORTANT: {
                provider: "https://t.me/TryToLiveAlone",
                documentation: "https://death-docs.vercel.app/API/Quick%20Start"
            }
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to send email",
            details: error.message,
            IMPORTANT: {
                provider: "https://t.me/TryToLiveAlone",
                documentation: "https://death-docs.vercel.app/API/Quick%20Start"
            }
        });
    }
};

// ✅ Default export
export default sendEmail;
                
