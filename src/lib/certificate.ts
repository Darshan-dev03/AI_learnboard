import jsPDF from "jspdf";

export const generateCertificatePDF = async (
  userName: string,
  courseTitle: string,
  courseEmoji: string,
  issuedAt: string
): Promise<{ pdf: jsPDF; base64: string }> => {
  const date = new Date(issuedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const certId = "ALB-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();

  // A4 landscape: 297 x 210 mm
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297;
  const H = 210;
  const centerX = W / 2;

  // ═══════════════════════════════════════════════════════════
  // BACKGROUND & BORDERS
  // ═══════════════════════════════════════════════════════════
  
  // White background
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, W, H, "F");

  // Outer decorative border (gold)
  pdf.setDrawColor(201, 168, 76);
  pdf.setLineWidth(2);
  pdf.rect(10, 10, W - 20, H - 20);

  // Inner border (gold)
  pdf.setLineWidth(0.5);
  pdf.rect(14, 14, W - 28, H - 28);

  // Accent corners (purple)
  pdf.setFillColor(108, 99, 255);
  const cornerSize = 15;
  // Top-left corner
  pdf.rect(14, 14, cornerSize, 0.5, "F");
  pdf.rect(14, 14, 0.5, cornerSize, "F");
  // Top-right corner
  pdf.rect(W - 14 - cornerSize, 14, cornerSize, 0.5, "F");
  pdf.rect(W - 14.5, 14, 0.5, cornerSize, "F");
  // Bottom-left corner
  pdf.rect(14, H - 14, cornerSize, 0.5, "F");
  pdf.rect(14, H - 14 - cornerSize, 0.5, cornerSize, "F");
  // Bottom-right corner
  pdf.rect(W - 14 - cornerSize, H - 14, cornerSize, 0.5, "F");
  pdf.rect(W - 14.5, H - 14 - cornerSize, 0.5, cornerSize, "F");

  // Subtle watermark
  pdf.setTextColor(108, 99, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(140);
  pdf.setGState(new (pdf as any).GState({ opacity: 0.03 }));
  pdf.text("ALB", centerX, H / 2 + 35, { align: "center" });
  pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

  // ═══════════════════════════════════════════════════════════
  // HEADER SECTION
  // ═══════════════════════════════════════════════════════════
  
  // Logo/Brand
  pdf.setTextColor(108, 99, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("AI LEARNBOARD", centerX, 32, { align: "center" });
  
  // Tagline
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(136, 136, 136);
  pdf.text("Online Learning Platform", centerX, 40, { align: "center" });

  // Decorative line
  pdf.setDrawColor(201, 168, 76);
  pdf.setLineWidth(1);
  pdf.line(centerX - 50, 46, centerX + 50, 46);

  // ═══════════════════════════════════════════════════════════
  // TITLE SECTION
  // ═══════════════════════════════════════════════════════════
  
  pdf.setTextColor(26, 26, 46);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(36);
  pdf.text("CERTIFICATE", centerX, 62, { align: "center" });
  
  pdf.setFontSize(18);
  pdf.text("OF COMPLETION", centerX, 74, { align: "center" });

  // ═══════════════════════════════════════════════════════════
  // PRESENTATION SECTION
  // ═══════════════════════════════════════════════════════════
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(102, 102, 102);
  pdf.text("This certificate is proudly presented to", centerX, 90, { align: "center" });

  // Student name box
  pdf.setFillColor(248, 248, 252);
  pdf.roundedRect(centerX - 85, 96, 170, 22, 3, 3, "F");
  
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(26);
  pdf.setTextColor(26, 26, 46);
  pdf.text(userName, centerX, 110, { align: "center" });

  // ═══════════════════════════════════════════════════════════
  // COURSE INFORMATION SECTION
  // ═══════════════════════════════════════════════════════════
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(102, 102, 102);
  pdf.text("for successfully completing the course", centerX, 128, { align: "center" });

  // Course title box
  pdf.setFillColor(108, 99, 255);
  pdf.setDrawColor(108, 99, 255);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(centerX - 95, 135, 190, 18, 4, 4, "FD");
  
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255);
  // Only use course title, skip emoji as jsPDF doesn't support it
  pdf.text(courseTitle, centerX, 147, { align: "center" });

  // ═══════════════════════════════════════════════════════════
  // ACHIEVEMENT BADGES
  // ═══════════════════════════════════════════════════════════
  
  const badgeY = 162;
  const badgeWidth = 50;
  const badgeHeight = 11;
  const badgeSpacing = 8;
  
  // Badge 1: Completion
  pdf.setFillColor(34, 197, 94);
  pdf.roundedRect(centerX - badgeWidth - badgeSpacing - badgeWidth/2, badgeY, badgeWidth, badgeHeight, 5, 5, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.text("100% COMPLETED", centerX - badgeWidth/2 - badgeSpacing - badgeWidth/2, badgeY + 7.5, { align: "center" });

  // Badge 2: Verified
  pdf.setFillColor(201, 168, 76);
  pdf.roundedRect(centerX - badgeWidth/2, badgeY, badgeWidth, badgeHeight, 5, 5, "F");
  pdf.text("VERIFIED", centerX, badgeY + 7.5, { align: "center" });

  // Badge 3: Certified
  pdf.setFillColor(108, 99, 255);
  pdf.roundedRect(centerX + badgeSpacing + badgeWidth/2, badgeY, badgeWidth, badgeHeight, 5, 5, "F");
  pdf.text("CERTIFIED", centerX + badgeWidth/2 + badgeSpacing + badgeWidth/2, badgeY + 7.5, { align: "center" });

  // ═══════════════════════════════════════════════════════════
  // SIGNATURE & SEAL SECTION
  // ═══════════════════════════════════════════════════════════
  
  const sigY = 185;
  
  // Left signature - Issuing Authority
  const leftSigX = 70;
  pdf.setDrawColor(102, 102, 102);
  pdf.setLineWidth(0.3);
  pdf.line(leftSigX - 35, sigY - 10, leftSigX + 35, sigY - 10);
  
  pdf.setTextColor(51, 51, 51);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("AI LearnBoard", leftSigX, sigY - 3, { align: "center" });
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(136, 136, 136);
  pdf.text("Issuing Authority", leftSigX, sigY + 4, { align: "center" });

  // Center - Verification Seal
  const sealX = centerX;
  const sealY = sigY - 5;
  
  // Outer circle
  pdf.setDrawColor(201, 168, 76);
  pdf.setLineWidth(2);
  pdf.circle(sealX, sealY, 20);
  
  // Inner circle
  pdf.setLineWidth(0.5);
  pdf.circle(sealX, sealY, 17);
  
  // Seal content
  pdf.setTextColor(201, 168, 76);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("OFFICIAL", sealX, sealY - 3, { align: "center" });
  
  pdf.setFontSize(8);
  pdf.text("VERIFIED", sealX, sealY + 4, { align: "center" });
  
  pdf.setFontSize(7);
  pdf.text("CERTIFICATE", sealX, sealY + 11, { align: "center" });

  // Right signature - Date
  const rightSigX = W - 70;
  pdf.setDrawColor(102, 102, 102);
  pdf.setLineWidth(0.3);
  pdf.line(rightSigX - 35, sigY - 10, rightSigX + 35, sigY - 10);
  
  pdf.setTextColor(51, 51, 51);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text(date, rightSigX, sigY - 3, { align: "center" });
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(136, 136, 136);
  pdf.text("Date of Issue", rightSigX, sigY + 4, { align: "center" });

  // ═══════════════════════════════════════════════════════════
  // FOOTER SECTION
  // ═══════════════════════════════════════════════════════════
  
  // Certificate ID
  pdf.setFontSize(7);
  pdf.setTextColor(153, 153, 153);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Certificate ID: ${certId}`, centerX, H - 8, { align: "center" });
  
  // Verification URL
  pdf.setFontSize(6);
  pdf.setTextColor(108, 99, 255);
  pdf.text("Verify at: www.ailearnboard.com/verify", centerX, H - 4, { align: "center" });

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
