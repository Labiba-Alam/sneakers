/**
 * ====================================================
 * KINGSMAN SNEAKERS - GOOGLE APPS SCRIPT ORDER SYNC
 * Google Sheets Webhook Backend Endpoint
 * ====================================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet where you want orders logged.
 * 2. Go to Extensions -> Apps Script.
 * 3. Paste this code into Code.gs.
 * 4. Click Deploy -> New deployment -> Select Web app.
 * 5. Set 'Execute as' to 'Me' and 'Who has access' to 'Anyone'.
 * 6. Copy the Web App URL and set it in your environment variable GOOGLE_SHEETS_WEBHOOK_URL.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Ensure Header Row exists if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Order ID",
        "Date (Dhaka)",
        "Customer Name",
        "Phone",
        "District",
        "Area",
        "Address",
        "Products",
        "Sizes",
        "Quantity",
        "Subtotal (BDT)",
        "Advance Delivery Fee (BDT)",
        "Advance TrxID / Method",
        "Remaining Due on Delivery (BDT)",
        "Grand Total (BDT)",
        "Payment Method",
        "Payment Status",
        "Courier Partner",
        "Order Status",
        "Tracking Number",
        "Customer Notes"
      ]);
      
      // Style header
      var headerRange = sheet.getRange(1, 1, 1, 21);
      headerRange.setBackground("#111111");
      headerRange.setFontColor("#C7A55B");
      headerRange.setFontWeight("bold");
    }

    var data = JSON.parse(e.postData.contents);
    
    // Format products & sizes into clear strings
    var productNames = [];
    var productSizes = [];
    var totalQty = 0;
    
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach(function(item) {
        productNames.push(item.product ? item.product.name : 'Sneaker');
        productSizes.push("EU " + item.selectedSize);
        totalQty += (item.quantity || 1);
      });
    }

    var advanceInfo = data.advanceDeliveryFeeTrxId 
      ? (data.advanceDeliveryFeeMethod || 'MFS') + " (" + data.advanceDeliveryFeeTrxId + ")"
      : (data.advanceDeliveryFeePaid ? "Paid Online" : "Pending Verification");

    var newRow = [
      data.id || "KNG-ORDER",
      new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
      data.customerName || "Guest",
      data.customerPhone || "",
      data.district || data.city || "Dhaka",
      data.area || "",
      data.address || "",
      productNames.join(" | "),
      productSizes.join(" | "),
      totalQty,
      data.subtotal || 0,
      data.shippingFee || (data.district && data.district.indexOf('Inside City') !== -1 ? 100 : 160),
      advanceInfo,
      data.remainingAmountDue || 0,
      data.total || 0,
      data.paymentMethod || "COD",
      data.paymentStatus || "Pending",
      data.courierPartner || "Steadfast",
      data.orderStatus || "Pending",
      data.trackingNumber || "",
      data.notes || ""
    ];

    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "orderId": data.id,
      "rowLogged": sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    "status": "KINGSMAN Google Sheets Webhook Active",
    "timestamp": new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
