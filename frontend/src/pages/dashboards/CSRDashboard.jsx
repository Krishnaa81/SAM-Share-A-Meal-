import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Business,
  Handshake,
  Assessment,
  MonetizationOn,
  TrendingUp,
  People,
  Edit,
  Delete,
  VerifiedUser,
  Receipt,
  LocalShipping,
  Restaurant,
} from '@mui/icons-material';

// Mock data
const contributions = [
  {
    id: 1,
    company: 'Tech Corp',
    type: 'Food Donation',
    amount: '₹100,000',
    meals: 500,
    date: '2024-03-15',
    status: 'Verified',
  },
  {
    id: 2,
    company: 'Global Services Ltd',
    type: 'Monetary',
    amount: '₹150,000',
    meals: 750,
    date: '2024-03-14',
    status: 'Pending',
  },
];

const partners = [
  {
    id: 1,
    name: 'Tech Corp',
    type: 'Corporate',
    contribution: '₹500,000',
    status: 'Active',
    impact: '2500 meals',
  },
  {
    id: 2,
    name: 'Global Services Ltd',
    type: 'Corporate',
    contribution: '₹300,000',
    status: 'Active',
    impact: '1500 meals',
  },
];

const analytics = {
  totalContribution: '₹2,500,000',
  mealsServed: 12500,
  activePartners: 15,
  taxBenefits: '₹750,000',
  impactMetrics: {
    peopleServed: 5000,
    communitiesReached: 8,
    employeeParticipation: '75%',
  },
};

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

export default function CSRDashboard() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      {/* Welcome Section */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            CSR Impact Dashboard
          </Typography>
          <Typography variant="subtitle1">
            Track and manage your corporate social responsibility initiatives
          </Typography>
        </Paper>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MonetizationOn sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Total Contribution</Typography>
            </Box>
            <Typography variant="h4" gutterBottom>
              {analytics.totalContribution}
            </Typography>
            <LinearProgress variant="determinate" value={75} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Restaurant sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Meals Served</Typography>
            </Box>
            <Typography variant="h4" gutterBottom>
              {analytics.mealsServed}
            </Typography>
            <LinearProgress variant="determinate" value={85} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Business sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Active Partners</Typography>
            </Box>
            <Typography variant="h4" gutterBottom>
              {analytics.activePartners}
            </Typography>
            <LinearProgress variant="determinate" value={65} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Receipt sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Tax Benefits</Typography>
            </Box>
            <Typography variant="h4" gutterBottom>
              {analytics.taxBenefits}
            </Typography>
            <LinearProgress variant="determinate" value={90} />
          </CardContent>
        </Card>
      </Grid>

      {/* Main Content */}
      <Grid item xs={12}>
        <Paper>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Handshake />} label="Contributions" />
            <Tab icon={<Business />} label="Partners" />
            <Tab icon={<Assessment />} label="Impact" />
          </Tabs>

          {/* Contributions Tab */}
          <TabPanel value={tabValue} index={0}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Meals</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contributions.map((contribution) => (
                    <TableRow key={contribution.id}>
                      <TableCell>{contribution.company}</TableCell>
                      <TableCell>{contribution.type}</TableCell>
                      <TableCell>{contribution.amount}</TableCell>
                      <TableCell>{contribution.meals}</TableCell>
                      <TableCell>{contribution.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={contribution.status}
                          color={contribution.status === 'Verified' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <VerifiedUser />
                        </IconButton>
                        <IconButton size="small">
                          <Receipt />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Partners Tab */}
          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Partner</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Total Contribution</TableCell>
                    <TableCell>Impact</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>{partner.name}</TableCell>
                      <TableCell>{partner.type}</TableCell>
                      <TableCell>{partner.contribution}</TableCell>
                      <TableCell>{partner.impact}</TableCell>
                      <TableCell>
                        <Chip
                          label={partner.status}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Impact Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Social Impact Metrics
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="People Served"
                          secondary={analytics.impactMetrics.peopleServed}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Communities Reached"
                          secondary={analytics.impactMetrics.communitiesReached}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Employee Participation"
                          secondary={analytics.impactMetrics.employeeParticipation}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tax Benefits Overview
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Total Tax Benefits"
                          secondary={analytics.taxBenefits}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Documentation Status"
                          secondary="All documents verified"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Next Filing Due"
                          secondary="March 31, 2024"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
} 