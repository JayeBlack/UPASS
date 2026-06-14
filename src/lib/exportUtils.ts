type ExportFormat = "csv" | "pdf";

interface ExportOptions {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: string[][];
  fileName: string;
  format: ExportFormat;
}

function triggerDownload(content: string | Blob, fileName: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.style.display = "none";
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  // Small delay to ensure browser registers the element
  requestAnimationFrame(() => {
    anchor.click();
    // Cleanup after a longer delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(anchor);
    }, 500);
  });
}

function csvEscape(val: string): string {
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportData({ title, subtitle, headers, rows, fileName, format }: ExportOptions) {
  const safeName = fileName.replace(/[^a-zA-Z0-9_-]/g, "_");

  if (format === "csv") {
    const lines: string[] = [];
    lines.push(headers.join(","));
    for (const row of rows) {
      lines.push(row.map((cell) => csvEscape(cell)).join(","));
    }
    const bom = "\uFEFF";
    const csvContent = bom + lines.join("\r\n");
    triggerDownload(csvContent, `${safeName}.csv`, "text/csv;charset=utf-8;");
    return;
  }

  // PDF — use dynamic import to avoid blocking page load
  import("jspdf").then(({ default: jsPDF }) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm" });
    const pageW = doc.internal.pageSize.getWidth();

    // Header block
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("UNIVERSITY OF MINES AND TECHNOLOGY", pageW / 2, 18, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("School of Postgraduate Studies — Tarkwa", pageW / 2, 24, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, pageW / 2, 33, { align: "center" });
    if (subtitle) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(subtitle, pageW / 2, 39, { align: "center" });
    }

    let startY = subtitle ? 45 : 40;
    const availWidth = pageW - 20;
    const colCount = headers.length;
    const colWidths = Array.from({ length: colCount }, () => availWidth / colCount);
    const lineHeight = 6;
    const headerColor: [number, number, number] = [30, 58, 95];

    function drawHeader() {
      doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.rect(10, startY - 4, availWidth, lineHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      let x = 10;
      for (let i = 0; i < colCount; i++) {
        doc.text(String(headers[i]), x + 1, startY, { align: "left" });
        x += colWidths[i];
      }
      startY += lineHeight;
    }

    drawHeader();

    // Data rows
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    for (let r = 0; r < rows.length; r++) {
      if (startY > 280) {
        doc.addPage();
        startY = 20;
        drawHeader();
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
      }

      if (r % 2 === 1) {
        doc.setFillColor(245, 245, 245);
        doc.rect(10, startY - 4, availWidth, lineHeight, "F");
      }

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      doc.line(10, startY - 4, 10 + availWidth, startY - 4);

      let x = 10;
      doc.setFontSize(8);
      for (let i = 0; i < colCount; i++) {
        doc.text(String(rows[r][i] || ""), x + 1, startY, { align: "left" });
        x += colWidths[i];
      }
      startY += lineHeight;
    }

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(10, startY + 2, 10 + availWidth, startY + 2);
    startY += 6;
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()} — Computer Generated`, 10, startY);

    doc.save(`${safeName}.pdf`);
  }).catch((err) => {
    console.error("PDF generation error:", err);
    throw err;
  });
}