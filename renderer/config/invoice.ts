const html = String.raw;

export const invoice = html`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Restaurant Bill</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 80mm; /* Adjust width to fit your thermal printer */
          margin: 0 auto;
          padding: 10px;
        }
        .header {
          text-align: center;
          margin-bottom: 10px;
        }
        .bill-details {
          margin-bottom: 10px;
        }
        .bill-details table {
          width: 100%;
          border-collapse: collapse;
        }
        .bill-details th,
        .bill-details td {
          padding: 3px;
          border-bottom: 1px solid #000;
          text-align: left;
        }
        .bill-total {
          text-align: right;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Restaurant Bill</h2>
          <p>Date: 03/03/2024</p>
        </div>
        <div class="bill-details">
          <table>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
            <tr>
              <td>Pizza</td>
              <td>2</td>
              <td>$10.00</td>
            </tr>
            <tr>
              <td>Burger</td>
              <td>1</td>
              <td>$5.00</td>
            </tr>
            <tr>
              <td>Drink</td>
              <td>3</td>
              <td>$2.00</td>
            </tr>
          </table>
        </div>
        <div class="bill-total">
          <p>Total: $24.00</p>
        </div>
      </div>
    </body>
  </html> `;
