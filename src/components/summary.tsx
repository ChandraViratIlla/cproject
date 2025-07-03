"use client";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

// Define assessment names for display
const assessmentNames: { [key: string]: string } = {
  'assessment-1': 'Assessment-1: Social Skills',
  'assessment-2': 'Assessment-2: Emotional Awareness',
  'assessment-3': 'Assessment-3: Stress Management',
  'assessment-4': 'Assessment-4: Team Dynamics',
  'assessment-5': 'Assessment-5: Motivation and Goals',
  'assessment-6': 'Assessment-6: Problem Solving',
};

// Enhanced print styles for complete consent form
const printStyles = `
  @media print {
    .print-hidden {
      display: none !important;
    }
    .print-visible {
      display: block !important;
      page-break-inside: avoid;
    }
    .print-content {
      width: 210mm;
      margin: 0;
      padding: 15mm;
      box-shadow: none;
      border: none;
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
    }
    .print-header {
      text-align: center;
      margin-bottom: 20mm;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 10mm;
    }
    .print-logo {
      width: 15mm;
      height: 15mm;
      margin: 0 auto 5mm auto;
    }
    .print-title {
      font-size: 20pt;
      font-weight: bold;
      color: #1f2937;
      margin: 5mm 0;
    }
    .print-subtitle {
      font-size: 16pt;
      font-weight: bold;
      color: #2563eb;
      margin: 2mm 0;
    }
    .print-section {
      margin: 8mm 0;
      page-break-inside: avoid;
    }
    .print-section-title {
      font-size: 14pt;
      font-weight: bold;
      color: #1f2937;
      margin: 6mm 0 3mm 0;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 2mm;
    }
    .print-table {
      width: 100%;
      border-collapse: collapse;
      margin: 5mm 0;
    }
    .print-table td, .print-table th {
      border: 1px solid #d1d5db;
      padding: 3mm;
      text-align: left;
      vertical-align: top;
    }
    .print-table th {
      background-color: #f3f4f6;
      font-weight: bold;
    }
    .print-signature-section {
      margin: 10mm 0;
      border: 1px solid #d1d5db;
      padding: 5mm;
      background-color: #f9fafb;
    }
    .print-signature-row {
      display: flex;
      justify-content: space-between;
      margin: 5mm 0;
      page-break-inside: avoid;
    }
    .print-signature-field {
      flex: 1;
      margin: 0 2mm;
    }
    .print-signature-line {
      border-bottom: 1px solid #000;
      min-height: 8mm;
      margin: 2mm 0;
    }
    .print-consent-text {
      font-size: 10pt;
      text-align: justify;
      margin: 3mm 0;
      line-height: 1.3;
    }
    .print-important-text {
      background-color: #fef3c7;
      padding: 3mm;
      border-left: 3px solid #f59e0b;
      margin: 3mm 0;
      font-weight: bold;
    }
    .print-page-break {
      page-break-before: always;
    }
    body {
      margin: 0;
    }
    .print-list {
      margin: 2mm 0 2mm 5mm;
    }
    .print-list li {
      margin: 1mm 0;
    }
  }
`;

const SummaryContent = () => {
  const searchParams = useSearchParams();

  // Extract consent form data
  const consentData = {
    name: searchParams.get('name') || 'Not Provided',
    rollNumber: searchParams.get('rollNumber') || 'Not Provided',
    phoneNumber: searchParams.get('phoneNumber') || 'Not Provided',
    counselorName: searchParams.get('counselorName') || 'Not Provided',
    signatureDate: searchParams.get('signatureDate') || 'Not Provided',
  };

  const hasAssessment = searchParams.get('hasAssessment') === 'true';
  const selectedAssessments = searchParams.get('selectedAssessments')?.split(',') || [];

  // Retrieve scores from localStorage (client-side only)
  const getScores = () => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('assessmentScores') || '{}');
    }
    return {};
  };

  const scores = getScores();

  useEffect(() => {
    // Inject print styles into the document (client-side only)
    if (typeof window !== 'undefined') {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = printStyles;
      document.head.appendChild(styleSheet);

      // Clean up localStorage on component mount
      localStorage.removeItem('assessmentScores');
      localStorage.removeItem('assessmentAnswers');
      localStorage.removeItem('consentFormData');

      return () => {
        document.head.removeChild(styleSheet);
      };
    }
  }, []);

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Complete Summary and Consent Form</title>
            <style>${printStyles}</style>
          </head>
          <body>
            <div class="print-content">
              <!-- Header Section -->
              <div class="print-header">
                <div class="print-logo">
                  <img src="./logo.jpeg" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;" />
                </div>
                <div class="print-title">INFORMED CONSENT & SUMMARY REPORT</div>
                <div class="print-subtitle">ADITYA UNIVERSITY, SURAMPALEM</div>
                <div style="font-size: 12pt; font-weight: 600; color: #4b5563;">University Counselling Centre</div>
                <div style="font-size: 9pt; color: #6b7280; margin-top: 2mm;">Surampalem, Andhra Pradesh | (123) 456-7890 | counseling@adityauniversity.edu</div>
                <div style="margin-top: 3mm; padding: 2mm; border: 1px solid #2563eb; color: #2563eb; font-weight: bold; display: inline-block;">CONFIDENTIAL DOCUMENT</div>
              </div>

              <!-- Summary Section -->
              <div class="print-section">
                <div class="print-section-title">Summary Report</div>
                <table class="print-table">
                  <tr>
                    <th style="width: 25%;">Student Name</th>
                    <td>${consentData.name}</td>
                  </tr>
                  <tr>
                    <th>Roll Number</th>
                    <td>${consentData.rollNumber}</td>
                  </tr>
                  <tr>
                    <th>Phone Number</th>
                    <td>${consentData.phoneNumber}</td>
                  </tr>
                  <tr>
                    <th>Counselor Name</th>
                    <td>${consentData.counselorName}</td>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <td>${consentData.signatureDate}</td>
                  </tr>
                </table>
                ${hasAssessment && selectedAssessments.length > 0 ? `
                  <div class="print-section-title">Assessment Results Summary</div>
                  <table class="print-table">
                    <thead>
                      <tr>
                        <th>Assessment Name</th>
                        <th style="width: 20%; text-align: center;">Score</th>
                        <th style="width: 30%;">Performance Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${selectedAssessments.map((assessmentId) => {
                        const score = scores[assessmentId];
                        let performanceLevel = 'Not Completed';
                        if (score !== undefined && score !== null) {
                          if (score >= 80) performanceLevel = 'Excellent';
                          else if (score >= 60) performanceLevel = 'Good';
                          else if (score >= 40) performanceLevel = 'Average';
                          else performanceLevel = 'Needs Improvement';
                        }
                        return `
                          <tr>
                            <td>${assessmentNames[assessmentId]}</td>
                            <td style="text-align: center;">${(score !== undefined && score !== null) ? `${score}/100` : 'Not completed'}</td>
                            <td>${performanceLevel}</td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                  <div class="print-important-text">
                    Note: These assessment scores are for counseling purposes only and should be interpreted by qualified professionals.
                  </div>
                ` : `
                  <div class="print-consent-text">No assessments were completed during this session. Consent form was submitted for counseling services only.</div>
                `}
              </div>

              <!-- Page Break for Consent Form -->
              <div class="print-page-break"></div>

              <!-- Full Consent Form Content -->
              <div class="print-section">
                <div class="print-section-title">INFORMED CONSENT FOR COUNSELING SERVICES</div>
                <div class="print-consent-text">
                  At Aditya University, we prioritize both your physical and mental well-being. For your physical health, we have partnered with Apollo, and for your mental well-being, our dedicated student counselors are here to support you. The University Counselling Centre at Surampalem provides a safe and confidential space for all students to explore personal concerns, develop coping strategies, and enhance overall well-being. This college-organized initiative supports your mental health journey, and you can attend multiple counseling sessions as per your wish.
                </div>
                <div class="print-important-text">
                  Please sign this form only if you understand and agree with the information. You can discuss any questions with your counselor at any time.
                </div>

                <!-- Welcome Section -->
                <div class="print-section-title">Welcome to Aditya University, Surampalem</div>
                <div class="print-consent-text">
                  At Aditya University, we prioritize both your physical and mental well-being. For your physical health, we have partnered with Apollo, and for your mental well-being, our dedicated student counselors are here to support you. Located in Surampalem, our University Counselling Centre is committed to fostering a safe and inclusive environment for all students.
                </div>
                <div class="print-consent-text"><strong>What We Offer:</strong></div>
                <ul class="print-list">
                  <li>Individual counseling sessions</li>
                  <li>Group therapy opportunities</li>
                  <li>Workshops to enhance your skills</li>
                </ul>
                <div class="print-consent-text">
                  This initiative, organized by the college, aims to support the mental health of all students, ensuring you thrive during your time at Aditya University, Surampalem.
                </div>

                <!-- Counseling Support -->
                <div class="print-section-title">What is Counseling Support?</div>
                <div class="print-consent-text">
                  Counseling at the University Counselling Centre is a friendly and supportive space where you can share your thoughts, explore personal concerns, and develop strategies to enhance your well-being. You are welcome to attend multiple sessions at your own pace, whenever you feel the need for guidance or support.
                </div>
                <div class="print-consent-text"><strong>Why It Helps:</strong></div>
                <ul class="print-list">
                  <li>Build confidence and coping skills</li>
                  <li>Navigate academic and personal challenges</li>
                  <li>Feel supported in a safe environment</li>
                </ul>
                <div class="print-consent-text">
                  Our experienced counselors are here to listen and guide you, making sure you feel comfortable and empowered throughout your journey at Aditya University, Surampalem.
                </div>

                <!-- Your Role -->
                <div class="print-section-title">Your Role in Counseling</div>
                <div class="print-consent-text">
                  Your participation is key to making the most of counseling. Feel free to share your thoughts openly and work with your counselor to set goals that suit your needs.
                </div>
                <ul class="print-list">
                  <li>Attend sessions at your convenience</li>
                  <li>Share your experiences to receive tailored support</li>
                  <li>Let your counselor know if you need a different approach</li>
                </ul>

                <!-- Confidentiality -->
                <div class="print-section-title">Keeping Your Conversations Private</div>
                <div class="print-consent-text">
                  Everything you discuss with your counselor at the University Counselling Centre is kept confidential, creating a safe space for you to open up. This is supported by university policies and laws.
                </div>
                <div class="print-consent-text"><strong>When We May Share:</strong></div>
                <ul class="print-list">
                  <li>If there’s a risk of harm to you or others, we’ll take steps to ensure safety</li>
                  <li>With your permission, we can share with university staff if needed</li>
                </ul>
              </div>

              <!-- Signature Section -->
              <div class="print-signature-section">
                <div class="print-section-title">Signatures and Acknowledgment</div>
                <div class="print-consent-text">
                  I have read and understood the information above and feel comfortable proceeding with counseling at the University Counselling Centre. I agree to attend sessions as needed and can discuss any concerns with my counselor.
                </div>
                <table class="print-table" style="margin-top: 8mm;">
                  <tr>
                    <th>Student Name</th>
                    <td>${consentData.name}</td>
                  </tr>
                  <tr>
                    <th>Roll Number</th>
                    <td>${consentData.rollNumber}</td>
                  </tr>
                  <tr>
                    <th>Phone Number</th>
                    <td>${consentData.phoneNumber}</td>
                  </tr>
                  <tr>
                    <th>Counselor Name</th>
                    <td>${consentData.counselorName}</td>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <td>${consentData.signatureDate}</td>
                  </tr>
                </table>
              </div>

              <!-- Footer -->
              <div style="margin-top: 15mm; text-align: center; font-size: 9pt; color: #6b7280; border-top: 1px solid #d1d5db; padding-top: 5mm;">
                <div><strong>Aditya University Counselling Centre</strong></div>
                <div>Surampalem, Andhra Pradesh | Phone: (123) 456-7890</div>
                <div>Email: counseling@adityauniversity.edu</div>
                <div style="margin-top: 2mm; font-weight: bold;">This document contains confidential information</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-10 print:bg-white print:p-0 flex flex-col items-center">
      <div className="max-w-6xl w-full print:w-full print:max-w-none print:shadow-none">
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden print:shadow-none print:border print:border-gray-200">
          <CardHeader className="text-center border-b-2 border-teal-200 bg-gradient-to-r from-teal-100 to-blue-100 p-10 print:border-b print:border-gray-300">
            <CardTitle className="text-5xl font-extrabold text-gray-900 print:text-2xl">
              Summary Report
            </CardTitle>
            <div className="mt-6 text-lg text-gray-600 space-y-2 print:text-sm">
              <p className="text-3xl font-semibold text-teal-700 print:text-lg">Aditya University</p>
              <p className="text-xl print:text-base">Counseling Center</p>
              <Badge variant="outline" className="mt-2 border-teal-600 text-teal-600 print:border-teal-600 print:text-teal-600">
                Confidential
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-12 print:pt-6">
            <div className="mb-12 print:mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 print:text-lg print:mb-4">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xl text-gray-700 print:text-sm">
                <div className="bg-white p-6 rounded-xl shadow-lg"><strong>Name:</strong> {consentData.name}</div>
                <div className="bg-white p-6 rounded-xl shadow-lg"><strong>Roll Number:</strong> {consentData.rollNumber}</div>
                <div className="bg-white p-6 rounded-xl shadow-lg"><strong>Phone Number:</strong> {consentData.phoneNumber}</div>
                <div className="bg-white p-6 rounded-xl shadow-lg"><strong>Counselor Name:</strong> {consentData.counselorName}</div>
                <div className="bg-white p-6 rounded-xl shadow-lg"><strong>Date:</strong> {consentData.signatureDate}</div>
              </div>
            </div>

            {hasAssessment && selectedAssessments.length > 0 && (
              <div className="mb-12 print:mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 print:text-lg print:mb-4">Assessment Scores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedAssessments.map((assessmentId) => (
                    <div key={assessmentId} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                      <p className="text-lg font-medium text-gray-800 print:text-sm">
                        <strong>{assessmentNames[assessmentId]}:</strong>{' '}
                        {(scores[assessmentId] !== undefined && scores[assessmentId] !== null)
                          ? `${scores[assessmentId]}/100`
                          : 'Not completed'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!hasAssessment && (
              <div className="mb-12 print:mb-6">
                <p className="text-lg text-gray-700 print:text-sm">
                  No assessments were taken. Consent form submitted successfully.
                </p>
              </div>
            )}

            <div className="flex justify-center print-hidden">
              <Button
                onClick={handlePrint}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xl px-10 py-4 rounded-xl shadow-xl transition duration-300"
              >
                Print Complete Summary & Consent Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Wrap the component in Suspense at the page level
export default function SummaryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading summary...</div>}>
      <SummaryContent />
    </Suspense>
  );
}