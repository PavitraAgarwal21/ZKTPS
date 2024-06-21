import jsPDF from "jspdf";

export function downloadTicket(
  qrDataURL,
  denomination,
  token_name,
  event_index,
  event_name,
  owner
) {
  const pdf = new jsPDF();

  // Set the event name as the heading in the middle
  pdf.setFontSize(30);
  pdf.setTextColor("#000000");
  pdf.text(event_name, pdf.internal.pageSize.getWidth() / 2, 20, {
    align: "center",
  });

  // Add "Event Ticket" as a subheading
  pdf.setFontSize(20);
  pdf.text("Event Ticket", pdf.internal.pageSize.getWidth() / 2, 30, {
    align: "center",
  });

  // Left side: Price
  pdf.setFontSize(23);
  pdf.setTextColor("#000000");
  pdf.text(`Price: ${denomination} ${token_name}`, 10, 50);

  // Below Price: Event Index
  pdf.setFontSize(18);
  pdf.setTextColor("#000000");
  pdf.text(`Event ID: ${event_index}`, 10, 60);

  // Owner
  pdf.setFontSize(8);
  pdf.setTextColor("#000000");
  pdf.text(`Owner: ${owner}`, 10, 70);

  // Right side: QR Code
  const qrX = pdf.internal.pageSize.getWidth() - 90; // Adjusting to fit within the page width
  pdf.addImage(qrDataURL, "JPEG", qrX, 40, 80, 80);

  // Event Link
  pdf.setTextColor("#0000FF"); // Blue color for the link
  pdf.setFontSize(12);
  pdf.textWithLink("Event Link", pdf.internal.pageSize.getWidth() / 8, 80, {
    url: `http://localhost:3000/home/${event_index}`,
  });

  // Bottom row: Powered by ZKTPS
  pdf.setFontSize(12);
  pdf.setTextColor("#808080");
  pdf.text("Powered by ZKTPS", pdf.internal.pageSize.getWidth() / 2, 140, {
    align: "center",
  });

  pdf.save(`ZKTPS_ticket_${event_name}.pdf`);
}
