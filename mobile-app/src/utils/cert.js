import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export async function downloadCertificate(user) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            color: #1a1a1a;
            font-family: 'Helvetica', 'Arial', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
          }
          .border {
            border: 8px solid #2fae7a;
            margin: 24px;
            padding: 40px;
            width: calc(100% - 48px);
            height: calc(100% - 48px);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #fcfcfc;
          }
          h1 {
            color: #2fae7a;
            font-size: 56px;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          h2 {
            font-size: 32px;
            margin-bottom: 40px;
            color: #333;
          }
          .dim {
            color: #666;
            font-size: 20px;
            margin-bottom: 20px;
          }
          .name {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 30px;
            color: #000;
            text-decoration: underline;
            text-decoration-color: #2fae7a;
          }
          .footer {
            font-size: 16px;
            color: #888;
            margin-top: 60px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="border">
          <h1>Ripple</h1>
          <h2>Certificate of Volunteer Service</h2>
          <div class="dim">This certifies that</div>
          <div class="name">${user.name || 'Volunteer'}</div>
          <div class="dim" style="max-width: 80%; line-height: 1.6;">
            has contributed <strong>${user.totalHours || 0}</strong> verified volunteer hours across <strong>${user.cleanups || 0}</strong> community cleanups,<br/>
            helping remove an estimated <strong>${user.lbsCollected || 0} lbs</strong> of litter from local communities.
          </div>
          <div class="footer">
            <strong>Rank achieved:</strong> ${user.rank || 'Volunteer'}<br/>
            Issued ${new Date().toLocaleDateString()} &middot; Ripple Volunteer Program
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({
      html,
      width: 1056, // Letter landscape width
      height: 816, // Letter landscape height
    });
    
    await Sharing.shareAsync(uri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
      dialogTitle: 'Download Certificate',
    });
  } catch (err) {
    console.error('Failed to generate or share certificate:', err);
    throw err;
  }
}
