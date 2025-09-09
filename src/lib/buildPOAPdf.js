import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const mm = (n) => (n * 72) / 25.4;

function drawMultiLineText(page, text, x, y, maxWidth, lineHeight, font, size) {
  const words = String(text || '').split(/\s+/);
  let line = '';
  let cursorY = y;

  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    const width = font.widthOfTextAtSize(test, size);
    if (width > maxWidth) {
      if (line) {
        page.drawText(line, { x, y: cursorY, size, font });
        cursorY -= lineHeight;
        line = w;
      } else {
        page.drawText(test, { x, y: cursorY, size, font });
        cursorY -= lineHeight;
        line = '';
      }
    } else {
      line = test;
    }
  }
  if (line) page.drawText(line, { x, y: cursorY, size, font });
  return cursorY - lineHeight;
}

export async function buildPOAPdf(vals) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([mm(210), mm(297)]); // A4
  const { width, height } = page.getSize();

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const margin = mm(20);
  const contentWidth = width - margin * 2;
  let y = height - margin;

  const H1 = 14;
  const H2 = 11;
  const BODY = 10;
  const LINE = 14;

  const title = 'LIMITED POWER OF ATTORNEY – MEDICAL BILLING REPRESENTATION';
  const titleWidth = fontBold.widthOfTextAtSize(title, H1);
  page.drawText(title, {
    x: margin + (contentWidth - titleWidth) / 2,
    y,
    size: H1,
    font: fontBold,
  });
  y -= LINE * 1.8;

  const field = (label, value) => {
    page.drawText(label, { x: margin, y, size: BODY, font: fontBold });
    page.drawText(String(value || '-'), {
      x: margin + mm(45),
      y,
      size: BODY,
      font,
    });
    y -= LINE;
  };

  // Principal
  page.drawText('Principal (Patient/Customer):', {
    x: margin,
    y,
    size: H2,
    font: fontBold,
  });
  y -= LINE * 1.2;

  field('Name:', vals.principalName);
  field('Date of Birth:', vals.dob);
  page.drawText('Address:', { x: margin, y, size: BODY, font: fontBold });
  y -= LINE * 0.2;
  y = drawMultiLineText(
    page,
    vals.address,
    margin + mm(45),
    y,
    contentWidth - mm(45),
    LINE,
    font,
    BODY
  );
  y -= LINE * 0.2;
  field('Phone:', vals.phone || '');
  field('Email:', vals.email);

  // Attorney-in-Fact
  y -= LINE * 0.5;
  page.drawText('Attorney-in-Fact (Representative):', {
    x: margin,
    y,
    size: H2,
    font: fontBold,
  });
  y -= LINE * 1.2;

  field('Organization:', vals.attorneyInFact?.org);
  field('Email:', vals.attorneyInFact?.email);
  field('Phone:', vals.attorneyInFact?.phone);
  page.drawText('Address:', { x: margin, y, size: BODY, font: fontBold });
  y -= LINE * 0.2;
  y = drawMultiLineText(
    page,
    vals.attorneyInFact?.address,
    margin + mm(45),
    y,
    contentWidth - mm(45),
    LINE,
    font,
    BODY
  );
  y -= LINE * 0.2;

  // Scope
  y -= LINE * 0.2;
  page.drawText('Scope of Authority', {
    x: margin,
    y,
    size: H2,
    font: fontBold,
  });
  y -= LINE * 1.2;
  for (const item of vals.scopeOfAuthority || []) {
    page.drawText('•', { x: margin, y, size: BODY, font });
    y = drawMultiLineText(
      page,
      item,
      margin + mm(5),
      y,
      contentWidth - mm(5),
      LINE,
      font,
      BODY
    );
    y -= LINE * 0.2;
  }

  // Disclaimer
  y -= LINE * 0.2;
  page.drawText('Disclaimer', { x: margin, y, size: H2, font: fontBold });
  y -= LINE * 1.2;
  y = drawMultiLineText(
    page,
    vals.disclaimer,
    margin,
    y,
    contentWidth,
    LINE,
    font,
    BODY
  );

  // Duration
  y -= LINE * 0.6;
  page.drawText('Duration', { x: margin, y, size: H2, font: fontBold });
  y -= LINE * 1.2;
  field('Start Date:', vals.startDate);
  field('End Date:', vals.endDate);

  // Revocation
  y -= LINE * 0.6;
  page.drawText('Revocation', { x: margin, y, size: H2, font: fontBold });
  y -= LINE * 1.2;
  y = drawMultiLineText(
    page,
    vals.revocation,
    margin,
    y,
    contentWidth,
    LINE,
    font,
    BODY
  );

  // Signatures
  y -= LINE * 0.6;
  page.drawText('Signatures', { x: margin, y, size: H2, font: fontBold });
  y -= LINE * 1.2;

  if (vals.signaturePng) {
    const b64 = vals.signaturePng.split(',')[1];
    const pngBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const png = await doc.embedPng(pngBytes);
    const sigW = mm(70);
    const scale = sigW / png.width;
    const sigH = png.height * scale;

    page.drawImage(png, {
      x: margin,
      y: y - sigH + mm(2),
      width: sigW,
      height: sigH,
    });
  }

  page.drawText('Principal Signature:', {
    x: margin,
    y,
    size: BODY,
    font: fontBold,
  });
  const printed = vals.printedName || vals.principalName || '';
  page.drawText(`Printed Name: ${printed}`, {
    x: margin + mm(90),
    y,
    size: BODY,
    font,
  });
  y -= LINE;
  page.drawText(`Date: ${vals.executionDate}`, {
    x: margin + mm(90),
    y,
    size: BODY,
    font,
  });

  // Footer
  page.drawText('Generated by T.H.E.M LLC', {
    x: margin,
    y: mm(10),
    size: 8,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  const pdfBytes = await doc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export function downloadBlob(blob, fileName) {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName);
    return;
  }

  const ua = navigator.userAgent;
  const isIOS = /iP(ad|hone|od)/i.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  if (isIOS || isSafari) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const a = document.createElement('a');
      a.href = reader.result; // data: URL
      a.download = fileName;
      a.target = '_self';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    reader.readAsDataURL(blob);
    return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  a.target = '_self';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
