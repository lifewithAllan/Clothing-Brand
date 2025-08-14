package com.feelhouette.clothingBrand.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final String from;
    private final String logoUrl;

    public EmailService(JavaMailSender mailSender,
                        @Value("${app.email.from}") String from,
                        @Value("${app.email.logo-url}") String logoUrl) {
        this.mailSender = mailSender;
        this.from = from;
        this.logoUrl = logoUrl;
    }

    public void sendConfirmationEmail(String to, String confirmationLink) {
        String subject = "Complete your account registration";
        String html = buildConfirmationHtml(confirmationLink);
        sendHtmlEmail(to, subject, html);
    }

    private void sendHtmlEmail(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom(from);
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to send email", ex);
        }
    }

    private String buildConfirmationHtml(String confirmationLink) {
        // Stylish HTML with logo at the top; inline styles for simplicity
        return """
            <html>
              <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
                <table width="100%%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding: 30px 0; background-color: #f7f7f7;">
                      <img src="%s" alt="Logo" width="160" style="display:block; margin-bottom: 20px;" />
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 40px 20px;">
                      <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
                        <tr>
                          <td style="padding: 30px;">
                            <h2 style="margin-top:0; color:#222;">Almost there — confirm your email</h2>
                            <p style="color:#555; line-height:1.5;">
                              Thanks for signing up. Click the button below to complete creating your account. This link will expire in 24 hours.
                            </p>
                            <p style="text-align:center; margin: 30px 0;">
                              <a href="%s" style="background: #007bff; color: #fff; padding: 12px 22px; border-radius: 6px; text-decoration: none; display:inline-block;">Create account</a>
                            </p>
                            <p style="color:#999; font-size: 13px;">
                              If the button doesn't work, copy & paste this URL into your browser:
                              <br/>
                              <small>%s</small>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 20px; color:#999; font-size:12px;">
                      © %d Your Company. All rights reserved.
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            """.formatted(logoUrl, confirmationLink, confirmationLink, java.time.Year.now().getValue());
    }
}

