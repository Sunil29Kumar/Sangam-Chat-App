export const sendOTPTemplate = ({ otp }) => {
  const brandColor = '#4f46e5'; // Sangam Indigo

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; padding: 40px; text-align: center; color: #1e293b;">
      <div style="max-width: 400px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        
        <div style="margin-bottom: 20px;">
          <div style="background-color: ${brandColor}; width: 48px; height: 48px; border-radius: 12px; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; line-height: 48px;">
            S
          </div>
        </div>

        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Verification Code</h2>
        <p style="font-size: 14px; color: #64748b; margin-bottom: 32px;">Enter this code in Sangam Chat to verify your account.</p>

        <div style="background-color: #f8fafc; border-radius: 16px; padding: 20px; margin-bottom: 32px;">
          <span style="font-size: 48px; font-weight: 800; letter-spacing: 12px; color: ${brandColor}; font-family: 'Courier New', Courier, monospace;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 12px; color: #94a3b8; line-height: 1.6;">
          This code expires in 5 minutes.<br />
          If you didn't request this, you can ignore this email.
        </p>

        <div style="margin-top: 32px; border-top: 1px solid #f1f5f9; pt: 20px;">
          <p style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 1px;">
            Sangam Chat Security
          </p>
        </div>
      </div>
    </div>
  `;
};