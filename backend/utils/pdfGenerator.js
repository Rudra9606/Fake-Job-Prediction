const PDFDocument = require('pdfkit');

/**
 * Generate PDF Report and stream it to the Express response
 * @param {Object} analysis - The job analysis record from DB
 * @param {Object} res - The Express response object
 */
exports.generatePDFReport = (analysis, res) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Set response headers for download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="FakeJobShield_Report_${analysis._id}.pdf"`
  );

  // Pipe PDF into Response stream
  doc.pipe(res);

  // --- Header ---
  doc.fillColor('#1e293b') // slate-800
     .fontSize(24)
     .font('Helvetica-Bold')
     .text('FakeJobShield', { align: 'center' });
  
  doc.fontSize(10)
     .font('Helvetica')
     .fillColor('#64748b')
     .text('Hybrid AI & Cybersecurity Recruitment Scams Detection Report', { align: 'center' });
  
  doc.moveDown();
  doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(1.5);

  // --- Trust Score Panel ---
  const startY = doc.y;
  doc.rect(50, startY, 495, 80).fill('#f8fafc'); // light slate background
  
  // Risk color indicator
  let riskColor = '#22c55e'; // green
  if (analysis.riskLevel === 'High Risk' || analysis.riskLevel === 'Highly Fraudulent') {
    riskColor = '#ef4444'; // red
  } else if (analysis.riskLevel === 'Medium Risk') {
    riskColor = '#f59e0b'; // amber
  } else if (analysis.riskLevel === 'Low Risk') {
    riskColor = '#3b82f6'; // blue
  }

  doc.fillColor('#1e293b')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('Trust Score & Risk Level Assessment', 65, startY + 15);

  doc.fontSize(28)
     .font('Helvetica-Bold')
     .fillColor(riskColor)
     .text(`${analysis.trustScore}/100`, 65, startY + 35);

  doc.fontSize(14)
     .font('Helvetica-Bold')
     .fillColor(riskColor)
     .text(analysis.riskLevel.toUpperCase(), 250, startY + 40);

  doc.fontSize(9)
     .font('Helvetica')
     .fillColor('#64748b')
     .text(`Fraud Probability: ${(analysis.fraudProbability * 100).toFixed(2)}%`, 250, startY + 55);

  doc.y = startY + 95;
  doc.moveDown();

  // --- Job Metadata Section ---
  doc.fillColor('#0f172a')
     .fontSize(14)
     .font('Helvetica-Bold')
     .text('Job Posting Details');
  doc.moveDown(0.5);

  doc.fontSize(10).font('Helvetica').fillColor('#334155');
  
  const textX = 60;
  const valX = 180;

  doc.font('Helvetica-Bold').text('Job Title:', textX);
  doc.font('Helvetica').text(analysis.title, valX, doc.y - 12);
  
  doc.font('Helvetica-Bold').text('Company Name:', textX);
  doc.font('Helvetica').text(analysis.company, valX, doc.y - 12);

  doc.font('Helvetica-Bold').text('Recruiter Email:', textX);
  doc.font('Helvetica').text(analysis.recruiterEmail || 'Not Provided', valX, doc.y - 12);

  doc.font('Helvetica-Bold').text('Company Website:', textX);
  doc.font('Helvetica').text(analysis.companyWebsite || 'Not Provided', valX, doc.y - 12);

  doc.font('Helvetica-Bold').text('Application Link:', textX);
  doc.font('Helvetica').text(analysis.applicationUrl || 'Not Provided', valX, doc.y - 12);

  doc.font('Helvetica-Bold').text('Scan Date:', textX);
  doc.font('Helvetica').text(new Date(analysis.createdAt).toLocaleString(), valX, doc.y - 12);

  doc.moveDown(1.5);

  // --- Cybersecurity Indicators Section ---
  doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text('Cybersecurity Verification Findings');
  doc.moveDown(0.5);

  const flags = analysis.securityFlags || {};
  const flagLabels = {
    uses_personal_email: 'Uses Personal Recruiter Email (Gmail/Yahoo/etc.)',
    email_domain_mismatch: 'Recruiter Email domain mismatch with Company',
    young_domain: 'Domain age appears newly registered (< 90 days)',
    suspicious_url: 'Contains suspicious redirects or shortened URLs',
    requests_sensitive_data: 'Requests sensitive identifiers (Aadhaar, PAN, Bank details)',
    high_urgency: 'Uses high-pressure or urgency sales language',
    weak_company_profile: 'Incomplete company profile structure',
  };

  let flagDetected = false;
  doc.fontSize(10).font('Helvetica').fillColor('#334155');

  for (const [key, val] of Object.entries(flags)) {
    if (val && flagLabels[key]) {
      flagDetected = true;
      doc.fillColor('#ef4444').text(`[!] Flagged: ${flagLabels[key]}`);
    }
  }

  if (!flagDetected) {
    doc.fillColor('#22c55e').text('No suspicious cybersecurity validation flags were activated for this posting.');
  }

  doc.moveDown(1.5);

  // --- Explainable AI Section ---
  doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text('Explainable AI (XAI) Rationale');
  doc.moveDown(0.5);

  doc.fontSize(10).font('Helvetica').fillColor('#334155');
  doc.text('Why the FakeJobShield Hybrid model reached this decision:');
  doc.moveDown(0.3);

  if (analysis.explanation && analysis.explanation.length > 0) {
    analysis.explanation.forEach((exp, idx) => {
      doc.text(`- ${exp}`);
    });
  } else {
    doc.text('Standard job formatting. No outlying word distributions detected.');
  }

  // --- Footer Notice ---
  doc.moveDown(3);
  doc.strokeColor('#e2e8f0').lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown();
  
  doc.fontSize(8)
     .font('Helvetica-Oblique')
     .fillColor('#94a3b8')
     .text('Disclaimer: FakeJobShield uses hybrid machine learning and heuristic rules to calculate trust metrics. It serves as a verification tool but does not constitute formal legal or background verification advice.', { align: 'justify' });

  // End Document
  doc.end();
};
