import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Fastfood,
  LocalShipping,
  People,
  Assessment,
  Add,
  VerifiedUser,
  Schedule,
  LocationOn,
  Restaurant,
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`donation-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DonationManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [openDonationDialog, setOpenDonationDialog] = useState(false);
  const [donationForm, setDonationForm] = useState({
    foodType: '',
    quantity: '',
    pickupAddress: '',
    pickupTime: '',
    description: '',
  });

  // Mock data
  const donations = [
    {
      id: 1,
      donor: 'Grand Hotel',
      foodType: 'Cooked Food',
      quantity: '50 meals',
      status: 'Scheduled',
      pickupTime: '2:00 PM',
    },
    {
      id: 2,
      donor: 'Wedding Hall',
      foodType: 'Buffet Items',
      quantity: '100 meals',
      status: 'In Transit',
      pickupTime: '3:30 PM',
    },
  ];

  const distributionCenters = [
    {
      id: 1,
      name: 'Hope Orphanage',
      type: 'Orphanage',
      capacity: '100 meals/day',
      status: 'Verified',
      address: '45, Park Street',
    },
    {
      id: 2,
      name: 'Senior Care Home',
      type: 'Old Age Home',
      capacity: '50 meals/day',
      status: 'Verified',
      address: '22, Lake Road',
    },
  ];

  const analytics = {
    totalDonations: 1500,
    mealsServed: 5000,
    activeDonors: 25,
    beneficiaries: 500,
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDonationSubmit = () => {
    console.log('New donation:', donationForm);
    setOpenDonationDialog(false);
    setDonationForm({
      foodType: '',
      quantity: '',
      pickupAddress: '',
      pickupTime: '',
      description: '',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Food Donation Management
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Donations
              </Typography>
              <Typography variant="h4">
                {analytics.totalDonations}
              </Typography>
              <LinearProgress variant="determinate" value={75} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Meals Served
              </Typography>
              <Typography variant="h4">
                {analytics.mealsServed}
              </Typography>
              <LinearProgress variant="determinate" value={85} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Donors
              </Typography>
              <Typography variant="h4">
                {analytics.activeDonors}
              </Typography>
              <LinearProgress variant="determinate" value={60} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Beneficiaries
              </Typography>
              <Typography variant="h4">
                {analytics.beneficiaries}
              </Typography>
              <LinearProgress variant="determinate" value={70} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Fastfood />} label="Donations" />
            <Tab icon={<LocalShipping />} label="Pickup Management" />
            <Tab icon={<People />} label="Distribution Centers" />
            <Tab icon={<Assessment />} label="Impact" />
          </Tabs>
        </Box>

        {/* Donations Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Active Donations</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDonationDialog(true)}
            >
              New Donation
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Donor</TableCell>
                  <TableCell>Food Type</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Pickup Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{donation.donor}</TableCell>
                    <TableCell>{donation.foodType}</TableCell>
                    <TableCell>{donation.quantity}</TableCell>
                    <TableCell>{donation.pickupTime}</TableCell>
                    <TableCell>
                      <Chip
                        label={donation.status}
                        color={donation.status === 'Scheduled' ? 'primary' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Distribution Centers Tab */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {distributionCenters.map((center) => (
                  <TableRow key={center.id}>
                    <TableCell>{center.name}</TableCell>
                    <TableCell>{center.type}</TableCell>
                    <TableCell>{center.capacity}</TableCell>
                    <TableCell>{center.address}</TableCell>
                    <TableCell>
                      <Chip
                        icon={<VerifiedUser />}
                        label={center.status}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        Assign Donation
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Impact Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribution by Type
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Restaurant />
                      </ListItemIcon>
                      <ListItemText
                        primary="Cooked Food"
                        secondary="3000 meals distributed"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Fastfood />
                      </ListItemIcon>
                      <ListItemText
                        primary="Packaged Food"
                        secondary="2000 meals distributed"
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
                    Beneficiary Impact
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Orphanages Served"
                        secondary="10 centers"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Old Age Homes"
                        secondary="5 centers"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Community Centers"
                        secondary="8 locations"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* New Donation Dialog */}
      <Dialog open={openDonationDialog} onClose={() => setOpenDonationDialog(false)}>
        <DialogTitle>Register New Donation</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Food Type</InputLabel>
                <Select
                  value={donationForm.foodType}
                  onChange={(e) => setDonationForm({ ...donationForm, foodType: e.target.value })}
                >
                  <MenuItem value="Cooked Food">Cooked Food</MenuItem>
                  <MenuItem value="Packaged Food">Packaged Food</MenuItem>
                  <MenuItem value="Raw Materials">Raw Materials</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantity (in meals)"
                type="number"
                value={donationForm.quantity}
                onChange={(e) => setDonationForm({ ...donationForm, quantity: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pickup Address"
                value={donationForm.pickupAddress}
                onChange={(e) => setDonationForm({ ...donationForm, pickupAddress: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Preferred Pickup Time"
                type="time"
                value={donationForm.pickupTime}
                onChange={(e) => setDonationForm({ ...donationForm, pickupTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Description"
                multiline
                rows={3}
                value={donationForm.description}
                onChange={(e) => setDonationForm({ ...donationForm, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDonationDialog(false)}>Cancel</Button>
          <Button onClick={handleDonationSubmit} variant="contained" color="primary">
            Register Donation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 