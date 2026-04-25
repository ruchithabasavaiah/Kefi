import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Kefi <no-reply@kefi-six.vercel.app>";

export async function sendRestockAlert({
  to,
  productName,
  size,
  color,
  productSlug,
}: {
  to: string;
  productName: string;
  size: string;
  color: string;
  productSlug: string;
}) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Back in stock: ${productName} (${size} / ${color})`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #3a2a25;">
        <h2 style="letter-spacing: 0.15em; font-size: 22px;">K E F I</h2>
        <p>Good news — the item on your wishlist is back in stock.</p>
        <table style="border-collapse: collapse; margin: 24px 0;">
          <tr><td style="padding: 4px 12px 4px 0; color: #888;">Product</td><td><strong>${productName}</strong></td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #888;">Size</td><td>${size}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0; color: #888;">Color</td><td>${color}</td></tr>
        </table>
        <a href="${process.env.FRONTEND_URL}/shop/${productSlug}"
           style="display: inline-block; background: #5a3d38; color: #c9b8a8; padding: 12px 28px; text-decoration: none; letter-spacing: 0.1em; font-size: 13px;">
          SHOP NOW
        </a>
        <p style="margin-top: 32px; font-size: 12px; color: #aaa;">
          You're receiving this because you requested a restock alert on Kefi.
        </p>
      </div>
    `,
  });
}
