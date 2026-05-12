import jsPDF from "jspdf";

export const generateCertificatePDF = async (
  userName: string,
  courseTitle: string,
  courseEmoji: string,
  issuedAt: string
): Promise<{ pdf: jsPDF; base64: string }> => {
  const date = new Date(issuedAt).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });
  const certId = "ALB-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  // A4 landscape: 297 x 210 mm
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297;
  const H = 210;

  // ── Background ──
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, W, H, "F");

  // ── Outer gold border ──
  pdf.setDrawColor(201, 168, 76);
  pdf.setLineWidth(1.5);
  pdf.rect(8, 8, W - 16, H - 16);

  // ── Inner gold border ──
  pdf.setLineWidth(0.4);
  pdf.rect(12, 12, W - 24, H - 24);

  // ── Left accent bar ──
  pdf.setFillColor(108, 99, 255);
  pdf.rect(18, 18, 3, H - 36, "F");

  // ── Watermark "ALB" ──
  pdf.setTextColor(108, 99, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(120);
  pdf.setGState(new (pdf as any).GState({ opacity: 0.04 }));
  pdf.text("ALB", W / 2, H / 2 + 30, { align: "center" });
  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

  // ── Brand ──
  pdf.setTextColor(108, 99, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("AI LEARNBOARD", W / 2, 32, { align: "center", charSpace: 3 });

  // ── Gold divider ──
  const drawGoldDivider = (y: number, width = 60) => {
    const x = (W - width) / 2;
    pdf.setDrawColor(201, 168, 76);
    pdf.setLineWidth(0.8);
    pdf.line(x, y, x + width, y);
  };
  drawGoldDivider(37);

  // ── Title ──
  pdf.setTextColor(26, 26, 46);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.text("Certificate of Completion", W / 2, 50, { align: "center" });

  // ── Subtitle ──
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(11);
  pdf.setTextColor(136, 136, 136);
  pdf.text("This is proudly presented to", W / 2, 60, { align: "center" });

  // ── Student name ──
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(32);
  pdf.setTextColor(26, 26, 46);
  pdf.text(userName, W / 2, 78, { align: "center" });

  // ── Name underline ──
  const nameWidth = pdf.getTextWidth(userName);
  const nx = (W - nameWidth) / 2;
  pdf.setDrawColor(108, 99, 255);
  pdf.setLineWidth(0.6);
  pdf.line(nx, 81, nx + nameWidth, 81);

  // ── Course label ──
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(102, 102, 102);
  pdf.text("has successfully completed the course", W / 2, 92, { align: "center" });

  // ── Course title ──
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(108, 99, 255);
  pdf.text(`${courseEmoji}  ${courseTitle}`, W / 2, 104, { align: "center" });

  drawGoldDivider(112);

  // ── Badges ──
  // Purple badge
  pdf.setFillColor(108, 99, 255);
  pdf.roundedRect(W / 2 - 52, 117, 48, 10, 5, 5, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.text("✓  100% Completed", W / 2 - 28, 123.5, { align: "center" });

  // Gold badge
  pdf.setFillColor(201, 168, 76);
  pdf.roundedRect(W / 2 + 4, 117, 48, 10, 5, 5, "F");
  pdf.text("★  Certified", W / 2 + 28, 123.5, { align: "center" });

  // ── Footer ──
  // Seal circle
  const sx = W / 2;
  const sy = 158;
  pdf.setDrawColor(201, 168, 76);
  pdf.setLineWidth(1.2);
  pdf.circle(sx, sy, 16);
  pdf.setLineWidth(0.4);
  pdf.circle(sx, sy, 13);
  pdf.setTextColor(201, 168, 76);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.text("VERIFIED", sx, sy - 2, { align: "center" });
  pdf.text("CERTIFICATE", sx, sy + 4, { align: "center" });
  pdf.setFontSize(14);
  pdf.text("⭐", sx, sy - 8, { align: "center" });

  // Left footer — AI LearnBoard
  pdf.setTextColor(51, 51, 51);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("AI LearnBoard", 70, 158, { align: "center" });
  pdf.setDrawColor(204, 204, 204);
  pdf.setLineWidth(0.4);
  pdf.line(35, 150, 105, 150);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(153, 153, 153);
  pdf.text("ISSUING AUTHORITY", 70, 163, { align: "center" });

  // Right footer — Date
  pdf.setTextColor(51, 51, 51);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(date, W - 70, 158, { align: "center" });
  pdf.line(W - 105, 150, W - 35, 150);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(153, 153, 153);
  pdf.text("DATE OF ISSUE", W - 70, 163, { align: "center" });

  // ── Certificate ID ──
  pdf.setFontSize(7);
  pdf.setTextColor(204, 204, 204);
  pdf.text(`Certificate ID: ${certId}`, W - 15, H - 10, { align: "right" });

  const base64 = pdf.output("datauristring").split(",")[1];
  return { pdf, base64 };
};

export const downloadCertificatePDF = async (
  userName: string,
  courseTitle: string,
  courseEmoji: string,
  issuedAt: string
) => {
  const { pdf } = await generateCertificatePDF(userName, courseTitle, courseEmoji, issuedAt);
  pdf.save(`AILearnBoard_Certificate_${courseTitle.replace(/\s+/g, "_")}.pdf`);
};
