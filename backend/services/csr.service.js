const CsrTransaction = require('../models/CsrTransaction');
const User = require('../models/User');
const PDFDocument = require('pdfkit'); // You'll need to install this: npm install pdfkit --save
const fs = require('fs');
const path = require('path');

/**
 * Calculate tax credit based on donation amount and tax credit percentage
 * @param {Number} amount - Donation amount
 * @param {Number} percentage - Tax credit percentage (default: 50%)
 * @returns {Number} - Calculated tax credit
 */
const calculateTaxCredit = (amount, percentage = 50) => {
  return (amount * percentage) / 100;
};

/**
 * Determine the current fiscal year
 * @returns {String} - Current fiscal year in "YYYY-YYYY" format
 */
const getCurrentFiscalYear = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 0-indexed
  
  // In India, fiscal year is April 1 to March 31
  if (currentMonth >= 4) {
    return `${currentYear}-${currentYear + 1}`;
  } else {
    return `${currentYear - 1}-${currentYear}`;
  }
};

/**
 * Get total CSR contributions for a corporate in a given fiscal year
 * @param {String} corporateId - Corporate user ID
 * @param {String} fiscalYear - Fiscal year in "YYYY-YYYY" format
 * @returns {Promise<Object>} - Totals for contributions and tax credits
 */
const getYearlyContributionTotal = async (corporateId, fiscalYear = getCurrentFiscalYear()) => {
  try {
    const results = await CsrTransaction.aggregate([
      {
        $match: { 
          corporate: corporateId, 
          fiscalYear, 
          status: 'completed' 
        }
      },
      {
        $group: {
          _id: null,
          totalContribution: { $sum: '$amount' },
          totalTaxCredit: { $sum: '$taxCredit' },
          count: { $sum: 1 }
        }
      }
    ]);

    if (results.length === 0) {
      return {
        totalContribution: 0,
        totalTaxCredit: 0,
        count: 0
      };
    }

    return results[0];
  } catch (error) {
    console.error('Error getting yearly contribution total:', error);
    throw error;
  }
};

/**
 * Generate a receipt PDF for a CSR transaction
 * @param {String} transactionId - CSR transaction ID
 * @returns {Promise<String>} - Path to the generated PDF file
 */
const generateTransactionReceipt = async (transactionId) => {
  try {
    const transaction = await CsrTransaction.findById(transactionId)
      .populate('corporate', 'name companyName gstNumber email');
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const receiptNumber = `CSR-${transaction._id.toString().slice(-6)}-${new Date().getFullYear()}`;
    const outputPath = path.join(__dirname, '../uploads/receipts', `${receiptNumber}.pdf`);
    const outputDir = path.dirname(outputPath);
    
    // Ensure the directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Pipe PDF to output file
    doc.pipe(fs.createWriteStream(outputPath));

    // Add content to PDF
    doc.fontSize(20).text('CSR Contribution Receipt', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Receipt Number: ${receiptNumber}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    
    doc.text(`Company: ${transaction.corporate.companyName}`);
    doc.text(`GST Number: ${transaction.corporate.gstNumber}`);
    doc.text(`Email: ${transaction.corporate.email}`);
    doc.moveDown();
    
    doc.text(`Transaction Type: ${transaction.transactionType.replace('_', ' ').toUpperCase()}`);
    doc.text(`Category: ${transaction.category.replace('_', ' ').toUpperCase()}`);
    doc.text(`Purpose: ${transaction.purpose}`);
    doc.moveDown();
    
    doc.text(`Amount Contributed: ₹${transaction.amount.toFixed(2)}`);
    doc.text(`Tax Credit (${transaction.taxCreditPercentage}%): ₹${transaction.taxCredit.toFixed(2)}`);
    doc.text(`Fiscal Year: ${transaction.fiscalYear}`);
    doc.moveDown();
    
    doc.text(`Status: ${transaction.status.toUpperCase()}`);
    doc.text(`Payment Method: ${transaction.paymentMethod.replace('_', ' ').toUpperCase()}`);
    if (transaction.paymentDetails && transaction.paymentDetails.transactionId) {
      doc.text(`Payment Transaction ID: ${transaction.paymentDetails.transactionId}`);
    }
    doc.moveDown(2);
    
    // Add legal disclaimer
    doc.fontSize(10).text('This receipt is issued for the purpose of claiming tax benefits under applicable laws. The tax credit amount is subject to verification by tax authorities. Please keep this receipt for your records.', { align: 'left' });
    
    // Add signature
    doc.moveDown(2);
    doc.fontSize(12).text('For Share-A-Meal', { align: 'right' });
    doc.moveDown(2);
    doc.text('Authorized Signatory', { align: 'right' });
    
    // Finalize the PDF
    doc.end();

    // Update transaction with receipt details
    transaction.acknowledgement = {
      receiptNumber,
      issuedDate: new Date(),
      issuedBy: 'Share-A-Meal CSR System'
    };
    await transaction.save();

    return outputPath;
  } catch (error) {
    console.error('Error generating transaction receipt:', error);
    throw error;
  }
};

/**
 * Generate a yearly tax certificate for all contributions
 * @param {String} corporateId - Corporate user ID
 * @param {String} fiscalYear - Fiscal year in "YYYY-YYYY" format
 * @returns {Promise<String>} - Path to the generated certificate
 */
const generateYearlyTaxCertificate = async (corporateId, fiscalYear = getCurrentFiscalYear()) => {
  try {
    const corporate = await User.findById(corporateId).select('name companyName gstNumber email');
    
    if (!corporate) {
      throw new Error('Corporate user not found');
    }
    
    const transactions = await CsrTransaction.find({
      corporate: corporateId,
      fiscalYear,
      status: 'completed'
    });
    
    if (transactions.length === 0) {
      throw new Error('No completed transactions found for this fiscal year');
    }
    
    const totals = await getYearlyContributionTotal(corporateId, fiscalYear);
    
    const certificateId = `TAX-CERT-${corporate._id.toString().slice(-6)}-${fiscalYear}`;
    const outputPath = path.join(__dirname, '../uploads/certificates', `${certificateId}.pdf`);
    const outputDir = path.dirname(outputPath);
    
    // Ensure the directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });
    
    // Pipe PDF to output file
    doc.pipe(fs.createWriteStream(outputPath));
    
    // Add content to PDF
    doc.fontSize(20).text('Annual CSR Tax Certificate', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Certificate Number: ${certificateId}`);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`);
    doc.text(`Fiscal Year: ${fiscalYear}`);
    doc.moveDown();
    
    doc.text(`Company: ${corporate.companyName}`);
    doc.text(`GST Number: ${corporate.gstNumber}`);
    doc.text(`Email: ${corporate.email}`);
    doc.moveDown();
    
    doc.text(`Total Contributions: ₹${totals.totalContribution.toFixed(2)}`);
    doc.text(`Total Tax Credit: ₹${totals.totalTaxCredit.toFixed(2)}`);
    doc.text(`Number of Contributions: ${totals.count}`);
    doc.moveDown(2);
    
    // Contribution details table
    doc.text('Contribution Details:', { underline: true });
    doc.moveDown();
    
    let yPos = doc.y;
    
    // Table headers
    doc.text('Date', 50, yPos);
    doc.text('Purpose', 150, yPos);
    doc.text('Amount (₹)', 300, yPos);
    doc.text('Tax Credit (₹)', 400, yPos);
    
    doc.moveDown();
    yPos = doc.y;
    
    // Table rows
    transactions.forEach((transaction, index) => {
      const rowY = yPos + (index * 20);
      
      doc.text(transaction.createdAt.toLocaleDateString(), 50, rowY);
      doc.text(transaction.purpose.substring(0, 25) + (transaction.purpose.length > 25 ? '...' : ''), 150, rowY);
      doc.text(transaction.amount.toFixed(2), 300, rowY);
      doc.text(transaction.taxCredit.toFixed(2), 400, rowY);
      
      // Check if we need to add a new page
      if (rowY > 700) {
        doc.addPage();
        yPos = 50;
      }
    });
    
    // Move to a new position after the table
    doc.moveDown(transactions.length + 2);
    
    // Add legal disclaimer
    doc.fontSize(10).text('This certificate is issued for the purpose of claiming tax benefits under applicable laws. The tax credit amount is subject to verification by tax authorities. This certificate consolidates all CSR contributions made during the specified fiscal year.', { align: 'left' });
    
    // Add signature
    doc.moveDown(2);
    doc.fontSize(12).text('For Share-A-Meal', { align: 'right' });
    doc.moveDown(2);
    doc.text('Authorized Signatory', { align: 'right' });
    
    // Finalize the PDF
    doc.end();
    
    // Update all transactions with certificate reference
    await CsrTransaction.updateMany(
      {
        corporate: corporateId,
        fiscalYear,
        status: 'completed'
      },
      {
        $set: {
          'taxDocuments.certificateId': certificateId,
          'taxDocuments.issuedDate': new Date(),
          'taxDocuments.downloadUrl': `/api/csr/certificates/${certificateId}`
        }
      }
    );
    
    return outputPath;
  } catch (error) {
    console.error('Error generating yearly tax certificate:', error);
    throw error;
  }
};

module.exports = {
  calculateTaxCredit,
  getCurrentFiscalYear,
  getYearlyContributionTotal,
  generateTransactionReceipt,
  generateYearlyTaxCertificate
}; 