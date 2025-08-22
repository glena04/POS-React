# POS
# 🛒 Glesta POS System

A modern, responsive Point of Sale system built with React and Node.js, featuring real-time inventory management, secure authentication, and role-based access control.


##  Features

-  **Intuitive POS Interface** - User-friendly design for quick transactions
-  **Real-time Inventory** - Live stock tracking and updates
-  **Secure Authentication** - JWT-based authentication system
-  **Role Management** - Admin and cashier role separation
-  **Multiple Payment Methods** - Support for cash and card payments
-  **Receipt Generation** - Digital receipts with print functionality
-  **Responsive Design** - Works on desktop, tablet, and mobile
-  **Dark Theme** - Modern dark interface for reduced eye strain

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ and npm
- Git
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/glesta/pos-system.git
cd pos-system
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Initialize database and create admin user**
```bash
npm run create-admin
```

5. **Start the backend server**
```bash
npm run dev
```

6. **In a new terminal, setup the frontend**
```bash
cd client
npm install
echo "REACT_APP_API_URL=http://localhost:5001/api" > .env
npm start
```

7. **Access the application**
   - Open browser to http://localhost:3000
   - Login with admin credentials

##  Project Structure

```
glesta-pos/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Context providers
│   │   ├── CSS/          # Stylesheets
│   │   └── App.js        # Main app component
│   └── package.json
├── router/                # Express routes
│   ├── index.js          # Product routes
│   └── auth.js           # Auth routes
├── database.js           # Database setup
├── index.js             # Server entry point
├── .env                 # Environment variables
└── package.json
```

## 🛠 Technology Stack

### Frontend
- **React** - UI framework
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

##  Available Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run create-admin   # Create admin user
npm run test-auth     # Test authentication system
```

### Frontend Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test          # Run tests
```

##  API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (Admin)
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/users` - List all users (Admin)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `PUT /api/products/:id/quantity` - Update quantity
- `DELETE /api/products/:id` - Delete product (Admin)

##  User Roles

### Admin
- Full system access
- Product management (CRUD)
- User management
- View all reports

### Cashier
- Process sales
- Update inventory quantities
- Generate receipts
- View products

##  Deployment

### Traditional Server
```bash
# See deployment guide for detailed instructions
npm run build
pm2 start ecosystem.config.js
```

### Docker
```bash
docker-compose up -d
```

### Cloud Platforms
- **Heroku**: One-click deploy with Heroku button
- **AWS**: EC2 instance with Nginx
- **DigitalOcean**: App Platform deployment

## 📊 Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `password` - Hashed password
- `role` - User role (admin/cashier)
- `created_at` - Timestamp

### Products Table
- `id` - Primary key
- `name` - Product name
- `price` - Product price
- `quantity` - Stock quantity
- `created_at` - Created timestamp
- `updated_at` - Last update timestamp

##  Security

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection prevention
- Input validation
- CORS configuration
- Rate limiting support

## 📈 Performance

- Optimized database queries
- Frontend code splitting
- Lazy loading components
- Caching strategies
- Compression enabled

##  Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client && npm test

# Test authentication
npm run test-auth
```


##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License.

##  Support

For support and questions:

-  Email: info@glesta.net
-  Phone: +49 172 614 3430
-  Website: [www.glesta.net](https://www.glesta.net)
-  Address: Kopernikusstr. 63, Düsseldorf, Germany

## Acknowledgments

- React team for the amazing framework
- Express.js community
- All contributors and testers

## Roadmap

- [ ] Sales analytics dashboard
- [ ] Multi-language support
- [ ] Barcode scanning
- [ ] Customer management
- [ ] Loyalty program
- [ ] Email receipts
- [ ] Cloud sync
- [ ] Mobile app

## Screenshots

### Login Screen
Clean and secure authentication interface

### POS Interface
Intuitive product selection and cart management

### Admin Dashboard
Comprehensive product and user management

### Receipt Generation
Professional receipts with print functionality

---

**Made with ❤ by Glesta**

*Building better business solutions*
