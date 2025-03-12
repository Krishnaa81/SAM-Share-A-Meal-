import { Box, Container, Grid, Typography, Link, IconButton, Stack, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn, 
  YouTube,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" component="div" gutterBottom fontWeight="bold">
              FoodShare
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              A comprehensive platform connecting restaurants, donors, cloud kitchens, and corporations for a sustainable food ecosystem.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="inherit" aria-label="Facebook" component="a" href="https://facebook.com" target="_blank">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter" component="a" href="https://twitter.com" target="_blank">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" component="a" href="https://instagram.com" target="_blank">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn" component="a" href="https://linkedin.com" target="_blank">
                <LinkedIn />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube" component="a" href="https://youtube.com" target="_blank">
                <YouTube />
              </IconButton>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/" color="inherit" underline="hover">
                  Home
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/restaurants" color="inherit" underline="hover">
                  Restaurants
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/donate-food" color="inherit" underline="hover">
                  Donate Food
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/donate-money" color="inherit" underline="hover">
                  Donate Money
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/about" color="inherit" underline="hover">
                  About Us
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/contact" color="inherit" underline="hover">
                  Contact Us
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <LocationOn sx={{ mr: 1 }} />
              <Typography variant="body2">
                123 Food Street, Hyderabad, India 500001
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Phone sx={{ mr: 1 }} />
              <Typography variant="body2">
                +91 9876543210
              </Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Email sx={{ mr: 1 }} />
              <Typography variant="body2">
                info@foodshare.com
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, md: 0 } }}>
            © {new Date().getFullYear()} FoodShare. All rights reserved.
          </Typography>
          <Box>
            <Link component={RouterLink} to="/privacy" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Privacy Policy
            </Link>
            <Link component={RouterLink} to="/terms" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Terms of Service
            </Link>
            <Link component={RouterLink} to="/faq" color="inherit" underline="hover" sx={{ mx: 1 }}>
              FAQ
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 