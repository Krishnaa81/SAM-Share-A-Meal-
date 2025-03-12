import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
  LinearProgress,
} from '@mui/material';
import {
  Business,
  TrackChanges,
  Description,
  Gavel,
  EmojiEvents,
  CheckCircle,
  Assessment,
  People,
  VerifiedUser,
  CloudDownload,
  Handshake,
  Timeline,
  MonetizationOn,
  Group,
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`csr-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CSRCredits() {
  const [tabValue, setTabValue] = useState(0);
  const [companyData, setCompanyData] = useState({
    name: '',
    revenue: '',
    email: '',
    phone: '',
    registrationNumber: '',
    employeeCount: '',
    taxId: '',
  });
  const [employeeMatching, setEmployeeMatching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCompanyRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate revenue requirement
      if (parseFloat(companyData.revenue) < 5) {
        throw new Error('Company revenue must be above ₹5 crores');
      }

      // Mock API call to register company
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Company registration:', companyData);
      
      // Success message would be shown here
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const contributionData = [
    { id: 1, date: '2024-03-15', type: 'Food Donation', value: '₹50,000', status: 'Verified', impact: '200 meals' },
    { id: 2, date: '2024-03-14', type: 'Monetary', value: '₹100,000', status: 'Pending', impact: '400 meals' },
  ];

  const leaderboardData = [
    { rank: 1, company: 'Tech Corp Ltd.', contributions: '₹500,000', impact: '2000 meals', badges: ['Platinum Donor', 'Impact Leader'] },
    { rank: 2, company: 'Global Foods Inc.', contributions: '₹450,000', impact: '1800 meals', badges: ['Gold Donor'] },
    { rank: 3, company: 'Innovate Solutions', contributions: '₹400,000', impact: '1600 meals', badges: ['Silver Donor'] },
  ];

  const impactMetrics = {
    totalMeals: 5400,
    totalBeneficiaries: 1200,
    employeeParticipation: 75,
    governmentVerified: true,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1" align="center">
        CSR Credits Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Business />} label="Corporate Registration" />
          <Tab icon={<TrackChanges />} label="Contribution Tracking" />
          <Tab icon={<Description />} label="Tax Benefits" />
          <Tab icon={<Gavel />} label="Compliance" />
          <Tab icon={<Assessment />} label="Impact Analytics" />
          <Tab icon={<People />} label="Employee Matching" />
          <Tab icon={<VerifiedUser />} label="Certificates" />
          <Tab icon={<EmojiEvents />} label="Leaderboard" />
        </Tabs>

        {/* Corporate Registration Tab */}
        <TabPanel value={tabValue} index={0}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Corporate Registration
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              For companies with revenue above ₹5 crores
            </Typography>
            <form onSubmit={handleCompanyRegistration}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Company Name"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Annual Revenue (in crores)"
                    type="number"
                    value={companyData.revenue}
                    onChange={(e) => setCompanyData({ ...companyData, revenue: e.target.value })}
                    helperText="Must be above ₹5 crores"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Phone"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Company Registration Number"
                    value={companyData.registrationNumber}
                    onChange={(e) => setCompanyData({ ...companyData, registrationNumber: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Tax ID/PAN"
                    value={companyData.taxId}
                    onChange={(e) => setCompanyData({ ...companyData, taxId: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit" 
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Register Company'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </TabPanel>

        {/* Contribution Tracking Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ p: 2 }}>
              CSR Contribution History
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Impact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contributionData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell>{row.impact}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        color={row.status === 'Verified' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tax Benefits Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tax Benefits Documentation
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Income Tax Integration Status
                </Typography>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Your account is connected with the Income Tax Department Portal
                </Alert>
              </Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Generate Tax Benefit Reports"
                    secondary="Download detailed reports for tax filing"
                  />
                  <Button variant="outlined" startIcon={<CloudDownload />}>
                    Generate Report
                  </Button>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Contribution Certificates"
                    secondary="Download certificates for your CSR contributions"
                  />
                  <Button variant="outlined" startIcon={<CloudDownload />}>
                    Download
                  </Button>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timeline />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Annual Tax Summary"
                    secondary="Comprehensive summary of all CSR activities for tax purposes"
                  />
                  <Button variant="outlined" startIcon={<Assessment />}>
                    View Summary
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Compliance Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Government Portal Integration
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Gavel />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Connect to Government Portal"
                        secondary="Link your account with government tax portals for automated verification"
                      />
                      <Button variant="contained" color="primary">
                        Connect
                      </Button>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    NGO Partnerships
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Handshake />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Verified NGO Partners"
                        secondary="Connect with government-approved NGOs for CSR activities"
                      />
                      <Button variant="outlined">
                        View Partners
                      </Button>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Impact Analytics Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Impact Overview
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Meals Provided
                  </Typography>
                  <Typography variant="h4">
                    {impactMetrics.totalMeals}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ mt: 2 }} 
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Beneficiaries Reached
                  </Typography>
                  <Typography variant="h4">
                    {impactMetrics.totalBeneficiaries}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={60} 
                    sx={{ mt: 2 }} 
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Employee Participation
                  </Typography>
                  <Typography variant="h4">
                    {impactMetrics.employeeParticipation}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={impactMetrics.employeeParticipation} 
                    sx={{ mt: 2 }} 
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Government Verified
                  </Typography>
                  <Typography variant="h4">
                    <CheckCircle color="success" sx={{ fontSize: 40 }} />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Employee Matching Tab */}
        <TabPanel value={tabValue} index={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Employee Donation Matching Program
              </Typography>
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={employeeMatching}
                      onChange={(e) => setEmployeeMatching(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable Employee Donation Matching"
                />
                <Typography variant="body2" color="text.secondary">
                  Match your employees' donations to double the impact
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Matching Rules
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <MonetizationOn />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Match up to ₹10,000 per employee"
                            secondary="Annual limit per employee"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Group />
                          </ListItemIcon>
                          <ListItemText 
                            primary="All full-time employees eligible"
                            secondary="After 6 months of employment"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Program Statistics
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Total Matched Donations"
                            secondary="₹250,000"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Participating Employees"
                            secondary="45 out of 60"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Certificates Tab */}
        <TabPanel value={tabValue} index={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Digital Certificates & Badges
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Your Achievements
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    <Chip label="Platinum Donor" color="primary" />
                    <Chip label="Impact Leader" color="secondary" />
                    <Chip label="Employee Champion" color="success" />
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Available Certificates
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <VerifiedUser color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="CSR Excellence Certificate 2024"
                        secondary="Awarded for outstanding contribution to social causes"
                      />
                      <Button variant="outlined" startIcon={<CloudDownload />}>
                        Download
                      </Button>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <VerifiedUser color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Food Donation Impact Certificate"
                        secondary="Recognition for providing 5000+ meals"
                      />
                      <Button variant="outlined" startIcon={<CloudDownload />}>
                        Download
                      </Button>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Next Achievements
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Diamond Donor Status"
                        secondary="Donate 2000 more meals to unlock"
                      />
                      <LinearProgress 
                        variant="determinate" 
                        value={75} 
                        sx={{ width: 100, ml: 2 }} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Community Champion"
                        secondary="Achieve 90% employee participation"
                      />
                      <LinearProgress 
                        variant="determinate" 
                        value={60} 
                        sx={{ width: 100, ml: 2 }} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Leaderboard Tab */}
        <TabPanel value={tabValue} index={7}>
          <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Top CSR Contributors
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Total Contributions</TableCell>
                  <TableCell>Impact</TableCell>
                  <TableCell>Badges</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboardData.map((row) => (
                  <TableRow key={row.rank}>
                    <TableCell>{row.rank}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.contributions}</TableCell>
                    <TableCell>{row.impact}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {row.badges.map((badge, index) => (
                          <Chip 
                            key={index} 
                            label={badge} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Container>
  );
} 