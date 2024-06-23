import jsPDF from "jspdf";

// Example background image URL (replace with your image URL)
// const backgroundImageURL = "https://images.icc-cricket.com/image/upload/t_ratio21_9-size60/prd/uh7op6arhhnprscg18mv";
import backgroundImageURL from "../Img/ticket.jpg";
// Local background image URL
// const backgroundImageURL = "./Img/ticket2.jpeg";
export function downloadTicket(
  qrDataURL,
  denomination,
  token_name,
  event_index,
  event_name,
  owner
) {
  const pdf = new jsPDF({
    orientation: "landscape", // Landscape orientation for ticket format
    unit: "mm", // Use millimeters for measurements
    format: [120, 50] // Standard credit card size: 85.6 mm x 54 mm
  });

  // Add background image
  pdf.addImage(backgroundImageURL, "JPEG", 0, 0, 120, 50);

  // Set the event name as the heading in the middle
  pdf.setFontSize(14);
  pdf.setTextColor("#00000");
  pdf.text(event_name, pdf.internal.pageSize.getWidth() / 2, 10, {
    align: "center",
  });

  // // Add "Event Ticket" as a subheading
  // pdf.setFontSize(10);
  // pdf.text("Event Ticket", pdf.internal.pageSize.getWidth() / 2, 18, {
  //   align: "center",
  // });

  // Left side: Price
  pdf.setFontSize(7);
  pdf.setTextColor("#000000");
  pdf.text(`Price: ${denomination} ${token_name}`, 10, 30);

  // Below Price: Event Index
  pdf.setFontSize(7);
  pdf.setTextColor("#000000");
  pdf.text(`Event ID: ${event_index}`, 10, 36);

  // Owner (moved below QR code to avoid overlap)
  pdf.setFontSize(6);
  pdf.setTextColor("#000000");
  pdf.text(`Owner: ${owner}`, 10, 42);

  // Right side: QR Code
  const qrX = pdf.internal.pageSize.getWidth() - 27; // Adjusting to fit within the page width
  pdf.addImage(qrDataURL, "JPEG", qrX, 20, 25, 25);

  // Event Link (moved below QR code)
  pdf.setTextColor("#000000"); // Blue color for the link
  pdf.setFontSize(7);
  pdf.textWithLink("Event Link", 10, 48, {
    url: `http://localhost:3000/home/${event_index}`,
  });

  // Bottom row: Powered by ZKTPS
  pdf.setFontSize(7);
  pdf.setTextColor("#808080");
  pdf.text("Powered by ZKTPS", pdf.internal.pageSize.getWidth() / 2, 52, {
    align: "center",
  });

  pdf.save(`ZKTPS_ticket_${event_name}.pdf`);
}
