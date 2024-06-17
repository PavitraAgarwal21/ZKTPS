import jsPDF from "jspdf";
export function downloadTicket(
  qrDataURL,
  denomination,
  token_name,
  event_name
) {
  const pdf = new jsPDF();
  pdf.setFontSize(30);
  pdf.text("Ticketing Protocol Powered by Starknet", 65, 14);
  pdf.addImage(qrDataURL, "JPEG", 45, 20, 100, 100);
  pdf.setTextColor("#808080");
  pdf.text("", 25, 140);
  pdf.setFontSize(23);
  pdf.text("Use the QR Code to verify and Invalidate the ticket.", 25, 130);
  pdf.text(`Price:${denomination}${token_name}`, 25, 150);
  pdf.text(`Event:${event_name}`, 25, 160);
  pdf.setTextColor("#808080");
  pdf.setFontSize(10);

  pdf.setFontSize(10);

  pdf.save(`ZKTPS_tickets.pdf`);
}
