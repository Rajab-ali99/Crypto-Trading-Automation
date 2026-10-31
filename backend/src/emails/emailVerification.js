export const emailVerificationTemplate = (verificationUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>Verify your email</h2>

      <p>
        Thank you for creating your Bullish Pixel account.
      </p>

      <p>
        Please verify your email address by clicking the button below.
      </p>

      <a
        href="${verificationUrl}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background: #111;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
        "
      >
        Verify Email
      </a>

      <p style="margin-top: 20px;">
        This verification link will expire in 1 hour.
      </p>
    </div>
  `;
};