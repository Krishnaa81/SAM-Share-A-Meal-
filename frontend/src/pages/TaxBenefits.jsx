import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Receipt,
  Assignment,
  CloudDownload,
  Description,
  CheckCircle,
  VerifiedUser,
  AttachFile,
  Info,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock data for tax benefits
const taxDocuments = [
  {
    id: 1,
    title: 'Donation Certificate - Q1 2023',
    date: '2023-03-31',
    amount: '₹250,000',
    status: 'Verified',
    downloadUrl: '#',
  },
  {
    id: 2,
    title: 'Donation Certificate - Q2 2023',
    date: '2023-06-30',
    amount: '₹300,000',
    status: 'Verified',
    downloadUrl: '#',
  },
  {
    id: 3,
    title: 'Donation Certificate - Q3 2023',
    date: '2023-09-30',
    amount: '₹400,000',
    status: 'Pending',
    downloadUrl: '#',
  },
];

// Tax filing steps
const taxFilingSteps = [
  'Generate Donation Certificate',
  'Verify Certificate',
  'Submit to Tax Portal',
  'Receive Tax Deduction',
];

export default function TaxBenefits() {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tax Benefits
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage tax benefits for your CSR food donations
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Donations
              </Typography>
              <Typography variant="h3" color="primary">
                ₹950,000
              </Typography>
              <Typography variant="body2" color="text.secondary">
                For Financial Year 2023-24
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tax Deduction Available
              </Typography>
              <Typography variant="h3" color="secondary">
                ₹142,500
              </Typography>
              <Typography variant="body2" color="text.secondary">
                15% of total donations
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Certificates Issued
              </Typography>
              <Typography variant="h3" color="primary">
                3
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2 Verified, 1 Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tax Filing Process */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tax Filing Process
            </Typography>
            <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 4 }}>
              {taxFilingSteps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOpenDialog}
                startIcon={<Info />}
              >
                View Filing Guidelines
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Tax Documents */}
        <Grid item xs={12}>
          <Paper>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Donation Certificates
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Download and use these certificates for tax filing
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Certificate</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taxDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.title}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>{doc.amount}</TableCell>
                      <TableCell>
                        <Chip
                          label={doc.status}
                          color={doc.status === 'Verified' ? 'success' : 'warning'}
                          size="small"
                          icon={doc.status === 'Verified' ? <VerifiedUser /> : null}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CloudDownload />}
                          href={doc.downloadUrl}
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Tax Benefits Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Available Tax Benefits
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Section 80G Deduction"
                  secondary="Eligible for 50% deduction on donation amount"
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="CSR Compliance"
                  secondary="Counts towards 2% CSR obligation under Companies Act"
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Government Recognition"
                  secondary="Eligible for government recognition programs"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Required Documents */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Required Documents
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText
                  primary="Donation Certificates"
                  secondary="Official certificates for all donations made"
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <Receipt />
                </ListItemIcon>
                <ListItemText
                  primary="Payment Receipts"
                  secondary="Proof of payment for each donation"
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <Assignment />
                </ListItemIcon>
                <ListItemText
                  primary="CSR Declaration Form"
                  secondary="Official declaration for CSR activities"
                />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon>
                  <AttachFile />
                </ListItemIcon>
                <ListItemText
                  primary="Company Registration"
                  secondary="Company incorporation certificate"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Tax Filing Guidelines Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>Tax Filing Guidelines</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Steps to Claim Tax Benefits for CSR Donations
          </Typography>
          <Typography variant="body1" paragraph>
            To claim tax benefits for your CSR donations, follow these steps:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Step 1: Download Donation Certificates"
                secondary="Download all verified donation certificates from your dashboard"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Step 2: Include in ITR Form"
                secondary="Include the donation details in Schedule 80G of your Income Tax Return form"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Step 3: Attach Supporting Documents"
                secondary="Attach all donation certificates and payment receipts with your tax filing"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Step 4: Mention in CSR Report"
                secondary="Include these donations in your annual CSR report to the Ministry of Corporate Affairs"
              />
            </ListItem>
          </List>
          <Typography variant="subtitle2" color="primary" sx={{ mt: 2 }}>
            Need assistance? Contact our tax experts at tax-support@shareamealsam.com
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCloseDialog}
            startIcon={<CloudDownload />}
          >
            Download Guidelines
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 