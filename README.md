# SAM - Share-A-Meal 🍽️

SAM (Share-A-Meal) is a modern food delivery platform that connects users with local cloud kitchens, restaurants, and food services. Built with React and Material-UI, it offers a seamless food ordering experience with a beautiful, responsive interface.

## 🌟 Features

### For Customers
- **Browse Cloud Kitchens**: Explore various cloud kitchens and restaurants
- **Detailed Menus**: View comprehensive menus with prices, descriptions, and images
- **Smart Filtering**: Filter by cuisine, price range, and dietary preferences
- **Real-time Order Tracking**: Track your order status in real-time
- **Reviews & Ratings**: Read and write reviews for kitchens and dishes
- **Favorites**: Save your favorite kitchens for quick access
- **Cart Management**: Easy-to-use cart with quick checkout
- **Multiple Payment Options**: Secure payment processing with various options

### For Kitchen Partners
- **Kitchen Dashboard**: Manage orders, menu, and availability
- **Menu Management**: Easy menu updates and item availability control
- **Order Processing**: Efficient order acceptance and processing
- **Analytics**: Track sales, popular items, and customer feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/SAM-Share-A-Meal-.git
cd SAM-Share-A-Meal-
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:
```bash
# Start frontend (from frontend directory)
npm start

# Start backend (from backend directory)
npm run dev
```

## 🛠️ Tech Stack

### Frontend
- React.js
- Material-UI (MUI)
- React Router
- Context API for state management
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Socket.io for real-time updates

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile devices

## 🔒 Security Features

- JWT-based authentication
- Secure password hashing
- Protected API endpoints
- Input validation and sanitization
- CORS protection

## 🎨 UI Components

### Kitchen Details Page
- Hero image with kitchen information
- Menu categories with items
- Reviews and ratings
- Order placement functionality
- Cart management

### User Dashboard
- Order history
- Favorite kitchens
- Delivery addresses
- Payment methods

## 📦 Project Structure

```
SAM-Share-A-Meal-/
├── frontend/
│   ├── public/
│   │   └── images/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── utils/
│       └── App.jsx
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Frontend Developer - [Name]
- Backend Developer - [Name]
- UI/UX Designer - [Name]
- Project Manager - [Name]

## 📞 Support

For support, email support@sam-share-a-meal.com or join our Slack channel.

## 🙏 Acknowledgments

- Material-UI team for the amazing component library
- Unsplash for the beautiful food images
- All our beta testers and early adopters

---

Made with ❤️ by the SAM Team 
