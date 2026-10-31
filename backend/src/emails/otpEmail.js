export const otpEmailTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>Your Bullish Pixel Login Code</h2>

      <p>
        Use the following one-time password to continue logging into your account.
      </p>

      <div
        style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 24px 0;
        "
      >
        ${otp}
      </div>

      <p>
        This code will expire in 10 minutes.
      </p>

      <p>
        If you did not attempt to login, you can ignore this email.
      </p>
    </div>
  `;
};