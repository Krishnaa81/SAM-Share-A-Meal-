import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Divider,
  Chip,
  Rating,
  Tabs,
  Tab,
  List,
  ListItem,
  IconButton,
  Paper,
  Avatar,
  TextField,
  Badge,
  Alert,
  CircularProgress,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Star as StarIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Phone as PhoneIcon,
  ArrowBack as ArrowBackIcon,
  AttachMoney as AttachMoneyIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

import { useCart } from '../context/CartContext';
import * as imageUtils from '../utils/imageUtils';

// Mock kitchen data
const MOCK_KITCHENS = [
  {
    id: 1,
    name: 'Spice Hub Cloud Kitchen',
    cuisine: 'North Indian',
    address: 'East City, Hyderabad',
    rating: 4.3,
    delivery_time: '30-40 min',
    price_range: '₹₹',
    image: 'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGtpdGNoZW58ZW58MHx8MHx8&w=1000&q=80',
    description: 'A cloud kitchen specializing in authentic North Indian cuisine, offering everything from rich curries to tandoori specialties.',
    openingHours: '10:00 AM - 10:00 PM',
    phone: '+91 9876543210',
    minOrder: 200,
    deliveryFee: 40,
    menu: [
      {
        category: 'Starters',
        items: [
          { id: 101, name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled to perfection', price: 220, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGFuZWVyJTIwdGlra2F8ZW58MHx8MHx8&w=1000&q=80', vegetarian: true, bestseller: true },
          { id: 102, name: 'Chicken 65', description: 'Spicy deep-fried chicken with South Indian spices', price: 250, image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGZyaWVkfGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: false },
          { id: 103, name: 'Samosa', description: 'Crispy pastry filled with spiced potatoes and peas', price: 80, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftb3NhfGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: true },
        ]
      },
      {
        category: 'Main Course',
        items: [
          { id: 201, name: 'Butter Chicken', description: 'Tender chicken pieces in a rich butter and tomato gravy', price: 340, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YnV0dGVyJTIwY2hpY2tlbnxlbnwwfHwwfHw%3D&w=1000&q=80', vegetarian: false, bestseller: true },
          { id: 202, name: 'Paneer Butter Masala', description: 'Cottage cheese in a creamy tomato sauce', price: 280, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGFuZWVyJTIwYnV0dGVyJTIwbWFzYWxhfGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: true },
          { id: 203, name: 'Dal Makhani', description: 'Black lentils cooked with butter and cream', price: 220, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZGFsJTIwbWFraGFuaXxlbnwwfHwwfHw%3D&w=1000&q=80', vegetarian: true, bestseller: true },
        ]
      },
      {
        category: 'Rice & Breads',
        items: [
          { id: 301, name: 'Jeera Rice', description: 'Basmati rice tempered with cumin seeds', price: 120, image: 'https://images.unsplash.com/photo-1589309736404-2d28c1f0825c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8amVlcmElMjByaWNlfGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: true },
          { id: 302, name: 'Butter Naan', description: 'Leavened flatbread baked in tandoor and brushed with butter', price: 50, image: 'https://images.unsplash.com/photo-1633037404690-d074e813ab4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bmFhbnxlbnwwfHwwfHw%3D&w=1000&q=80', vegetarian: true },
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: 401, name: 'Gulab Jamun', description: 'Deep-fried milk solids soaked in sugar syrup', price: 120, image: 'https://images.unsplash.com/photo-1601303516533-a8432f33a801?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z3VsYWIlMjBqYW11bnxlbnwwfHwwfHw%3D&w=1000&q=80', vegetarian: true, bestseller: true },
        ]
      }
    ],
    reviews: [
      { id: 1, user: 'Ravi K.', rating: 5, date: '2023-05-15', comment: 'Great food and quick delivery. The Butter Chicken is absolutely delicious.', avatar: 'https://randomuser.me/api/portraits/men/64.jpg' },
      { id: 2, user: 'Aisha S.', rating: 4, date: '2023-05-10', comment: 'Food quality is excellent. Would have given 5 stars if the delivery was faster.', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
    ]
  },
  {
    id: 2,
    name: 'Wok & Roll Kitchen',
    cuisine: 'Chinese',
    address: 'West End, Hyderabad',
    rating: 4.2,
    delivery_time: '35-45 min',
    price_range: '₹₹',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpbmVzZSUyMGtpdGNoZW58ZW58MHx8MHx8&w=1000&q=80',
    description: 'Authentic Chinese cuisine prepared fresh daily in our cloud kitchen. From noodles to dim sum, we have it all.',
    openingHours: '11:00 AM - 11:00 PM',
    phone: '+91 9876543220',
    minOrder: 250,
    deliveryFee: 50,
    menu: [
      {
        category: 'Starters',
        items: [
          { id: 101, name: 'Spring Rolls', description: 'Crispy rolls filled with vegetables and served with dipping sauce', price: 180, image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c3ByaW5nJTIwcm9sbHN8ZW58MHx8MHx8&w=1000&q=80', vegetarian: true },
          { id: 102, name: 'Crispy Chilli Chicken', description: 'Deep-fried chicken tossed with bell peppers in a spicy sauce', price: 280, image: 'https://images.unsplash.com/photo-1622880833523-7cf1c0bd4296?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y3Jpc3B5JTIwY2hpY2tlbnxlbnwwfHwwfHw%3D&w=1000&q=80', vegetarian: false, bestseller: true },
        ]
      },
      {
        category: 'Main Course',
        items: [
          { id: 201, name: 'Kung Pao Chicken', description: 'Diced chicken stir-fried with peanuts, vegetables, and chili peppers', price: 320, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8a3VuZyUyMHBhbyUyMGNoaWNrZW58ZW58MHx8MHx8&w=1000&q=80', vegetarian: false },
          { id: 202, name: 'Vegetable Hakka Noodles', description: 'Stir-fried noodles with mixed vegetables in a savory sauce', price: 220, image: 'https://images.unsplash.com/photo-1632661032099-761a4849f110?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGFra2ElMjBub29kbGVzfGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: true, bestseller: true },
        ]
      }
    ],
    reviews: [
      { id: 1, user: 'Neha M.', rating: 4, date: '2023-06-20', comment: 'Best Chinese food in town! Their Kung Pao Chicken is amazing.', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
      { id: 2, user: 'Karan T.', rating: 5, date: '2023-06-15', comment: 'Great quality food and packaging. Will order again!', avatar: 'https://randomuser.me/api/portraits/men/28.jpg' },
    ]
  },
  {
    id: 3,
    name: 'Green Bowl',
    cuisine: 'Healthy Food',
    address: 'Koramangala, Bangalore',
    rating: 4.2,
    delivery_time: '25-35 min',
    price_range: '₹₹',
    image: 'https://images.unsplash.com/photo-1546241072-48010ad2862c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGhlYWx0aHklMjBraXRjaGVufGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    description: 'Healthy and nutritious meals made with fresh ingredients. Perfect for health-conscious food lovers.',
    openingHours: '8:00 AM - 10:00 PM',
    phone: '+91 9876543230',
    minOrder: 200,
    deliveryFee: 40,
    menu: [
      {
        category: 'Salads',
        items: [
          { id: 101, name: 'Mediterranean Quinoa Bowl', description: 'Quinoa with roasted vegetables, feta, and olive oil dressing', price: 280, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3', vegetarian: true, bestseller: true },
          { id: 102, name: 'Asian Slaw Salad', description: 'Shredded cabbage, carrots, and Asian-inspired dressing', price: 220, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3', vegetarian: true },
          { id: 103, name: 'Grilled Chicken Caesar', description: 'Classic Caesar salad with grilled chicken breast', price: 300, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3', vegetarian: false }
        ]
      },
      {
        category: 'Power Bowls',
        items: [
          { id: 201, name: 'Buddha Bowl', description: 'Brown rice, avocado, chickpeas, and tahini dressing', price: 320, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3', vegetarian: true, bestseller: true },
          { id: 202, name: 'Teriyaki Tofu Bowl', description: 'Brown rice, grilled tofu, and stir-fried vegetables', price: 280, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?ixlib=rb-4.0.3', vegetarian: true },
          { id: 203, name: 'Salmon Poke Bowl', description: 'Fresh salmon, sushi rice, and Asian vegetables', price: 380, image: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?ixlib=rb-4.0.3', vegetarian: false }
        ]
      },
      {
        category: 'Smoothies',
        items: [
          { id: 301, name: 'Green Detox', description: 'Spinach, apple, cucumber, and ginger', price: 180, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?ixlib=rb-4.0.3', vegetarian: true },
          { id: 302, name: 'Berry Blast', description: 'Mixed berries, banana, and almond milk', price: 200, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3', vegetarian: true, bestseller: true }
        ]
      }
    ],
    reviews: [
      { id: 1, user: 'Priya M.', rating: 5, date: '2023-06-18', comment: 'Love their healthy options! The Buddha Bowl is amazing.', avatar: 'https://randomuser.me/api/portraits/women/42.jpg' },
      { id: 2, user: 'Rahul S.', rating: 4, date: '2023-06-15', comment: 'Fresh ingredients and great taste. Slightly expensive though.', avatar: 'https://randomuser.me/api/portraits/men/38.jpg' }
    ]
  },
  {
    id: 4,
    name: 'Pizza Express',
    cuisine: 'Italian',
    address: 'Connaught Place, Delhi',
    rating: 4.6,
    delivery_time: '30-40 min',
    price_range: '₹₹',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3',
    description: 'Authentic Italian pizzas made in wood-fired ovens with fresh ingredients and homemade sauce.',
    openingHours: '11:00 AM - 11:00 PM',
    phone: '+91 9876543240',
    minOrder: 300,
    deliveryFee: 50,
    menu: [
      {
        category: 'Classic Pizzas',
        items: [
          { id: 101, name: 'Margherita', description: 'Fresh tomato sauce, mozzarella, and basil', price: 299, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3', vegetarian: true, bestseller: true },
          { id: 102, name: 'Pepperoni', description: 'Spicy pepperoni with extra cheese', price: 399, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3', vegetarian: false },
          { id: 103, name: 'Quattro Formaggi', description: 'Four cheese blend pizza', price: 449, image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?ixlib=rb-4.0.3', vegetarian: true }
        ]
      },
      {
        category: 'Specialty Pizzas',
        items: [
          { id: 201, name: 'BBQ Chicken', description: 'Grilled chicken with BBQ sauce and red onions', price: 449, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3', vegetarian: false, bestseller: true },
          { id: 202, name: 'Mediterranean', description: 'Olives, feta, sun-dried tomatoes', price: 399, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3', vegetarian: true },
          { id: 203, name: 'Seafood Special', description: 'Mixed seafood with garlic and herbs', price: 499, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3', vegetarian: false }
        ]
      },
      {
        category: 'Sides',
        items: [
          { id: 301, name: 'Garlic Bread', description: 'Freshly baked with herbs and cheese', price: 149, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-4.0.3', vegetarian: true },
          { id: 302, name: 'Caesar Salad', description: 'Classic Caesar with croutons', price: 199, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3', vegetarian: true }
        ]
      }
    ],
    reviews: [
      { id: 1, user: 'Amit K.', rating: 5, date: '2023-06-22', comment: 'Best pizza in Delhi! The crust is perfect.', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
      { id: 2, user: 'Sneha R.', rating: 4, date: '2023-06-20', comment: 'Great taste and quick delivery.', avatar: 'https://randomuser.me/api/portraits/women/48.jpg' }
    ]
  },
  {
    id: 5,
    name: 'Burger Joint',
    cuisine: 'American',
    address: 'Anna Nagar, Chennai',
    rating: 4.4,
    delivery_time: '25-35 min',
    price_range: '₹₹',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-4.0.3',
    description: 'Gourmet burgers made with premium ingredients and secret sauce recipes.',
    openingHours: '11:00 AM - 11:00 PM',
    phone: '+91 9876543250',
    minOrder: 250,
    deliveryFee: 45,
    menu: [
      {
        category: 'Signature Burgers',
        items: [
          { id: 101, name: 'Classic Cheeseburger', description: 'Beef patty with cheddar and special sauce', price: 299, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3', vegetarian: false, bestseller: true },
          { id: 102, name: 'Veggie Supreme', description: 'Plant-based patty with fresh vegetables', price: 279, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-4.0.3', vegetarian: true },
          { id: 103, name: 'Spicy Chicken', description: 'Crispy chicken with spicy mayo', price: 289, image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3', vegetarian: false }
        ]
      },
      {
        category: 'Gourmet Burgers',
        items: [
          { id: 201, name: 'Truffle Mushroom', description: 'Beef patty with truffle mayo and mushrooms', price: 399, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3', vegetarian: false, bestseller: true },
          { id: 202, name: 'BBQ Bacon', description: 'Beef patty with bacon and BBQ sauce', price: 379, image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3', vegetarian: false },
          { id: 203, name: 'Mediterranean Lamb', description: 'Lamb patty with feta and tzatziki', price: 399, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3', vegetarian: false }
        ]
      },
      {
        category: 'Sides',
        items: [
          { id: 301, name: 'Loaded Fries', description: 'With cheese sauce and bacon bits', price: 199, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3', vegetarian: false },
          { id: 302, name: 'Onion Rings', description: 'Crispy battered onion rings', price: 149, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?ixlib=rb-4.0.3', vegetarian: true, bestseller: true }
        ]
      }
    ],
    reviews: [
      { id: 1, user: 'Vikram S.', rating: 4, date: '2023-06-25', comment: 'Juicy burgers and amazing fries!', avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
      { id: 2, user: 'Meera P.', rating: 5, date: '2023-06-23', comment: 'Best burgers in Chennai, hands down.', avatar: 'https://randomuser.me/api/portraits/women/55.jpg' }
    ]
  },
  {
    id: 6,
    name: 'Sushi Corner',
    cuisine: 'Japanese',
    address: 'Koregaon Park, Pune',
    rating: 4.8,
    delivery_time: '35-45 min',
    price_range: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3',
    description: 'Authentic Japanese sushi and sashimi prepared by expert chefs using fresh ingredients.',
    openingHours: '12:00 PM - 10:00 PM',
    phone: '+91 9876543260',
    minOrder: 500,
    deliveryFee: 60,
    menu: [
      {
        category: 'Sushi Rolls',
        items: [
          { id: 101, name: 'California Roll', description: 'Crab stick, avocado, and cucumber', price: 399, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3', vegetarian: false, bestseller: true },
          { id: 102, name: 'Spicy Tuna Roll', description: 'Fresh tuna with spicy mayo', price: 449, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3', vegetarian: false },
          { id: 103, name: 'Vegetable Roll', description: 'Assorted vegetables and avocado', price: 349, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3', vegetarian: true }
        ]
      },
      {
        category: 'Sashimi',
        items: [
          { id: 201, name: 'Salmon Sashimi', description: 'Fresh salmon slices (6 pieces)', price: 499, image: 'https://images.unsplash.com/photo-1534256958597-7fe685cbd745?ixlib=rb-4.0.3', vegetarian: false, bestseller: true },
          { id: 202, name: 'Tuna Sashimi', description: 'Premium tuna slices (6 pieces)', price: 549, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3', vegetarian: false },
          { id: 203, name: 'Assorted Sashimi', description: "Chef's selection (12 pieces)", price: 899, image: 'https://images.unsplash.com/photo-1534256958597-7fe685cbd745?ixlib=rb-4.0.3', vegetarian: false }
        ]
      },
      {
        category: 'Appetizers',
        items: [
          { 
            id: 301, 
            name: 'Miso Soup', 
            description: 'Traditional Japanese soup', 
            price: 149, 
            image: 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?ixlib=rb-4.0.3', 
            vegetarian: true 
          },
          { 
            id: 302, 
            name: 'Edamame', 
            description: 'Steamed soybeans with sea salt', 
            price: 199, 
            image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3', 
            vegetarian: true, 
            bestseller: true 
          }
        ]
      }
    ],
    reviews: [
      { id: 1, user: 'Rohan M.', rating: 5, date: '2023-06-28', comment: 'Exceptional sushi quality! Worth every penny.', avatar: 'https://randomuser.me/api/portraits/men/62.jpg' },
      { id: 2, user: 'Anita G.', rating: 5, date: '2023-06-26', comment: 'Fresh and authentic Japanese flavors.', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' }
    ]
  }
];

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`kitchen-tabpanel-${index}`}
      aria-labelledby={`kitchen-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const KitchenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [kitchen, setKitchen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const fetchKitchenData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Input validation
        if (!id) {
          throw new Error('Kitchen ID is required');
        }

        const kitchenId = parseInt(id);
        if (isNaN(kitchenId)) {
          throw new Error('Invalid kitchen ID format');
        }

        // Find kitchen data
        const kitchenData = MOCK_KITCHENS.find(k => k.id === kitchenId);
        if (!kitchenData) {
          throw new Error(`Kitchen with ID ${kitchenId} not found`);
        }

        // Validate kitchen data structure
        if (!kitchenData.menu || !Array.isArray(kitchenData.menu)) {
          throw new Error('Invalid kitchen menu data');
        }

        setKitchen(kitchenData);
        
        // Set the first category as selected by default
        if (kitchenData.menu.length > 0) {
          setSelectedCategory(kitchenData.menu[0].category);
        }
      } catch (err) {
        console.error('Error loading kitchen details:', err);
        setError(err.message || 'Failed to load kitchen details');
        setSnackbarMessage(err.message || 'Failed to load kitchen details');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchKitchenData();
  }, [id]);

  // Handle tab change with error boundary
  const handleTabChange = (event, newValue) => {
    try {
      setTabValue(newValue);
    } catch (err) {
      console.error('Error changing tab:', err);
      setSnackbarMessage('Failed to change tab');
      setSnackbarOpen(true);
    }
  };

  // Handle adding item to cart with validation
  const handleAddToCart = (item) => {
    try {
      if (!kitchen) {
        throw new Error('Kitchen data not available');
      }

      if (!item || !item.id || !item.name || !item.price) {
        throw new Error('Invalid item data');
      }

      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || '',
        restaurantId: kitchen.id,
        restaurantName: kitchen.name,
      });
      
      setSnackbarMessage(`${item.name} added to cart`);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setSnackbarMessage(err.message || 'Failed to add item to cart');
      setSnackbarOpen(true);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = () => {
    try {
      setIsFavorite(!isFavorite);
      setSnackbarMessage(
        !isFavorite 
          ? `${kitchen?.name} added to favorites` 
          : `${kitchen?.name} removed from favorites`
      );
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setSnackbarMessage('Failed to update favorites');
      setSnackbarOpen(true);
    }
  };
  
  // Handle proceeding to checkout
  const handleProceedToCheckout = () => {
    try {
      navigate('/checkout');
    } catch (err) {
      console.error('Error navigating to checkout:', err);
      setSnackbarMessage('Failed to proceed to checkout');
      setSnackbarOpen(true);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Render loading state with fallback UI
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Loading kitchen details...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Render error state with retry option
  if (error || !kitchen) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Kitchen not found'}
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained"
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/cloud-kitchens')}
            >
              Back to Cloud Kitchens
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          height: { xs: '200px', md: '300px' },
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          {...imageUtils.createImageProps(
            kitchen.image, 
            kitchen.name, 
            'kitchen',
            {
              sx: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }
            }
          )}
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.7))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: { xs: 2, md: 4 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                mr: 1,
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' } 
              }}
              onClick={() => navigate('/cloud-kitchens')}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h3" component="h1" color="white" fontWeight="bold">
              {kitchen.name}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Kitchen Info */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h5" component="h2" fontWeight="bold">
                    {kitchen.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {kitchen.cuisine} Cuisine
                  </Typography>
                </Box>
                <IconButton 
                  color={isFavorite ? "error" : "default"} 
                  onClick={handleToggleFavorite}
                  sx={{ 
                    border: '1px solid', 
                    borderColor: isFavorite ? 'error.main' : 'divider' 
                  }}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={kitchen.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {kitchen.rating} ({kitchen.reviews.length} reviews)
                  </Typography>
                </Box>
                <Chip 
                  icon={<AccessTimeIcon fontSize="small" />} 
                  label={kitchen.delivery_time} 
                  variant="outlined" 
                  size="small"
                />
                <Chip 
                  icon={<AttachMoneyIcon fontSize="small" />} 
                  label={kitchen.price_range} 
                  variant="outlined" 
                  size="small"
                />
              </Box>

              <Typography variant="body1" paragraph>
                {kitchen.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <LocationOnIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                    <Typography variant="body2">
                      {kitchen.address}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {kitchen.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {kitchen.openingHours}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Minimum order: ₹{kitchen.minOrder}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Delivery fee: ₹{kitchen.deliveryFee}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => {
                      // Scroll to menu section
                      document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Order Now
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Tabs for Menu/Reviews */}
            <Box sx={{ width: '100%', mb: 3 }} id="menu-section">
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  aria-label="kitchen tabs"
                  variant="fullWidth"
                >
                  <Tab label="Menu" />
                  <Tab label={`Reviews (${kitchen.reviews.length})`} />
                  <Tab label="Info" />
                </Tabs>
              </Box>
              
              {/* Menu Tab */}
              <TabPanel value={tabValue} index={0}>
                {/* Category navigation for larger screens */}
                {!isMobile && (
                  <Box sx={{ display: 'flex', mb: 3, overflowX: 'auto', pb: 1 }}>
                    {kitchen.menu.map((category, index) => (
                      <Button
                        key={index}
                        variant={selectedCategory === category.category ? "contained" : "outlined"}
                        sx={{ 
                          mr: 1, 
                          whiteSpace: 'nowrap',
                          minWidth: 'auto'
                        }}
                        onClick={() => setSelectedCategory(category.category)}
                      >
                        {category.category}
                      </Button>
                    ))}
                  </Box>
                )}

                {/* Menu sections */}
                {kitchen.menu.map((category, index) => (
                  <Box 
                    key={index} 
                    sx={{ mb: 4 }}
                    id={`category-${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                      {category.category}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      {category.items.map((item) => (
                        <Grid item xs={12} sm={6} md={6} key={item.id}>
                          <Card sx={{ 
                            display: 'flex', 
                            height: '100%',
                            position: 'relative',
                            overflow: 'visible'
                          }}>
                            {item.bestseller && (
                              <Chip
                                label="Bestseller"
                                color="secondary"
                                size="small"
                                sx={{ 
                                  position: 'absolute', 
                                  top: -10, 
                                  left: 10, 
                                  zIndex: 1 
                                }}
                              />
                            )}
                            <Box sx={{ width: '35%', position: 'relative' }}>
                              <CardMedia
                                component="img"
                                sx={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover'
                                }}
                                {...imageUtils.createImageProps(item.image, item.name, 'food')}
                              />
                              {item.vegetarian && (
                                <Box 
                                  sx={{ 
                                    position: 'absolute', 
                                    bottom: 5, 
                                    left: 5, 
                                    width: 20, 
                                    height: 20, 
                                    borderRadius: '50%', 
                                    bgcolor: 'success.main',
                                    border: '2px solid white',
                                  }} 
                                />
                              )}
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              width: '65%',
                              justifyContent: 'space-between'
                            }}>
                              <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" component="h4" fontWeight="bold">
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {item.description}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  ₹{item.price}
                                </Typography>
                              </CardContent>
                              <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  startIcon={<AddIcon />}
                                  onClick={() => handleAddToCart(item)}
                                >
                                  Add
                                </Button>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}

                {/* Confirm Order Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleProceedToCheckout}
                    disabled={cartItems.length === 0}
                    startIcon={<ShoppingCartIcon />}
                  >
                    Confirm Order ({cartItems.length > 0 ? cartItems.length : 0})
                  </Button>
                </Box>
              </TabPanel>
              
              {/* Reviews Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    Customer Reviews
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                      <Typography variant="h3" component="span" fontWeight="bold" color="primary" sx={{ mr: 1 }}>
                        {kitchen.rating}
                      </Typography>
                      <Box>
                        <Rating value={kitchen.rating} precision={0.1} readOnly />
                        <Typography variant="body2" color="text.secondary">
                          {kitchen.reviews.length} reviews
                        </Typography>
                      </Box>
                    </Box>
                    <Button variant="outlined" sx={{ ml: 'auto' }}>
                      Write a Review
                    </Button>
                  </Box>
                  
                  <Divider sx={{ mb: 3 }} />
                  
                  {kitchen.reviews.map((review) => (
                    <Box key={review.id} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Avatar src={review.avatar} alt={review.user} sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {review.user}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={review.rating} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {review.date}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {review.comment}
                      </Typography>
                      <Divider />
                    </Box>
                  ))}
                </Box>
              </TabPanel>
              
              {/* Info Tab */}
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    Kitchen Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Address
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                        <LocationOnIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                        <Typography variant="body1">
                          {kitchen.address}
                        </Typography>
                      </Box>
                      
                      <Typography variant="h6" gutterBottom>
                        Contact
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          {kitchen.phone}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Opening Hours
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          {kitchen.openingHours}
                        </Typography>
                      </Box>
                      
                      <Typography variant="h6" gutterBottom>
                        Delivery Information
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Delivery Time: {kitchen.delivery_time}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Delivery Fee: ₹{kitchen.deliveryFee}
                      </Typography>
                      <Typography variant="body1">
                        Minimum Order: ₹{kitchen.minOrder}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
            </Box>
          </Grid>
          
          {/* Sidebar for cart and info on larger screens */}
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper 
              elevation={3} 
              sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 100 }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Categories
              </Typography>
              <List disablePadding>
                {kitchen.menu.map((category, index) => (
                  <ListItem 
                    key={index} 
                    disablePadding 
                    sx={{ 
                      mb: 1,
                      bgcolor: selectedCategory === category.category ? 'primary.light' : 'transparent',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: selectedCategory === category.category ? 'primary.light' : 'action.hover',
                      }
                    }}
                  >
                    <Button
                      fullWidth
                      sx={{ 
                        justifyContent: 'flex-start', 
                        color: selectedCategory === category.category ? 'white' : 'text.primary',
                        py: 1
                      }}
                      onClick={() => {
                        setSelectedCategory(category.category);
                        setTabValue(0); // Switch to menu tab
                        
                        // Scroll to category
                        const element = document.getElementById(`category-${category.category.toLowerCase().replace(/\s+/g, '-')}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                    >
                      {category.category}
                    </Button>
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <InfoIcon color="action" sx={{ mr: 1, mt: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Delivery fee: ₹{kitchen.deliveryFee}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <InfoIcon color="action" sx={{ mr: 1, mt: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Minimum order: ₹{kitchen.minOrder}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default KitchenDetail; 