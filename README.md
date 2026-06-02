# 🧵 Stitch Queen - Luxury Tailoring Boutique Website

A modern, responsive website for a luxury tailoring boutique built with HTML, CSS, JavaScript, and Python Flask.

## 📋 Project Overview

Stitch Queen is a complete web solution for luxury tailoring services including:
- Custom design consultation
- Bridal collections
- Maggam work (traditional embellishment)
- Booking management
- Body measurements tracking
- Admin dashboard

## 🎨 Features

### Frontend Features
- ✨ Modern luxury boutique UI with gold, pink, black, and white color scheme
- 📱 Fully responsive design for mobile, tablet, and desktop
- 🎯 Smooth scroll animations and hover effects
- 💫 Clean CSS animations and transitions
- 🧭 Intuitive navigation with sticky navbar
- 📍 Google Maps integration on contact page
- 📊 Interactive admin dashboard

### Pages Included
1. **home.html** - Hero section, trending designs, bridal collection, maggam work, reviews
2. **gallery.html** - Image gallery with filtering options
3. **designs.html** - Custom design collections and design process
4. **bridal.html** - Bridal collection showcase with testimonials
5. **maggam.html** - Maggam work types and process
6. **booking.html** - Booking form with consultation scheduling
7. **measurements.html** - Body measurements form with size chart
8. **about.html** - About the company and team
9. **contact.html** - Contact form and location information
10. **admin.html** - Admin dashboard for managing bookings and customers

### Backend Features
- 📝 RESTful API endpoints for managing bookings
- 👥 Customer management system
- 📐 Measurements tracking
- 📊 Admin dashboard with statistics
- 💾 JSON-based data storage
- 🔐 Admin authentication

## 📁 Project Structure

```
StitchQueen/
├── frontend/
│   ├── home.html
│   ├── gallery.html
│   ├── designs.html
│   ├── bridal.html
│   ├── maggam.html
│   ├── booking.html
│   ├── measurements.html
│   ├── about.html
│   ├── contact.html
│   └── admin.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   └── (placeholder for images)
└── backend/
    ├── app.py
    ├── requirements.txt
    └── data/
        ├── bookings.json
        ├── customers.json
        └── measurements.json
```

## 🚀 Getting Started

### Prerequisites
- Python 3.7 or higher
- A modern web browser
- Text editor or IDE (VS Code recommended)

### Installation

#### 1. Clone or Download the Project
```bash
# Navigate to the project directory
cd StitchQueen
```

#### 2. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### 3. Run the Flask Backend
```bash
# From the backend directory
python app.py
```
The API will start at `http://localhost:5000`

#### 4. Open the Frontend
```bash
# Open frontend/home.html in your web browser
# Or use a local server like:
# python -m http.server 8000
# Then visit http://localhost:8000/frontend/home.html
```

## 🎨 Color Scheme

- **Black**: #1a1a1a (Primary background)
- **Gold**: #d4af37 (Accent color)
- **Pink**: #e91e63 (Secondary accent)
- **White**: #ffffff (Text/backgrounds)

## 💻 API Endpoints

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/<id>` - Get specific booking
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/<id>` - Update booking
- `DELETE /api/bookings/<id>` - Delete booking

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/<id>` - Get specific customer

### Measurements
- `GET /api/measurements` - Get all measurements
- `POST /api/measurements` - Save measurements

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Get dashboard stats

### General
- `GET /api/stats` - Get general statistics
- `GET /api/health` - Health check

## 🔐 Admin Login

**Default Admin Credentials:**
- Email: `admin@stitchqueen.com`
- Password: `stitchqueen123`

⚠️ **Important**: Change these credentials in production!

## 📱 Responsive Design

The website is fully responsive with breakpoints for:
- Desktop (1200px and above)
- Tablet (768px to 1199px)
- Mobile (below 768px)

## 🎯 Key JavaScript Features

- Form validation with custom error messages
- Phone number formatting
- Email validation
- Shopping cart/booking management with localStorage
- Mobile menu toggle
- Smooth scroll animations
- Lazy image loading
- Notification system

## 🧹 Beginner-Friendly Code

All code is written with:
- Clear variable names
- Detailed comments
- Simple CSS without complex preprocessors
- Vanilla JavaScript (no frameworks)
- Easy-to-understand file structure

## 🔄 Form Submission

Forms submit to the backend API at `/api/submit-form`. The backend automatically:
- Validates data
- Stores bookings/measurements
- Assigns unique IDs
- Timestamps all entries

## 📊 Admin Dashboard

The admin panel includes:
- Dashboard with statistics
- Booking management
- Customer list
- Order management
- Settings page

Access at `admin.html` after logging in with admin credentials.

## 🛠️ Customization

### Change Business Information
Edit these files to update business details:
- `frontend/*.html` - Update phone, email, address
- `backend/app.py` - Update admin credentials

### Modify Colors
Edit variables in `css/style.css`:
```css
:root {
    --primary-black: #1a1a1a;
    --primary-gold: #d4af37;
    --primary-pink: #e91e63;
    --primary-white: #ffffff;
}
```

### Add Services
1. Create new HTML page in `frontend/`
2. Add navigation link to navbar
3. Update links in footer

## 📝 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🚀 Deployment

### Frontend
- Upload `frontend/`, `css/`, and `js/` folders to your web server
- Works with any static hosting (GitHub Pages, Netlify, Vercel)

### Backend
- Deploy to platforms like Heroku, AWS, or DigitalOcean
- Update API URL in `script.js` for production
- Set up proper database (PostgreSQL, MySQL) instead of JSON files
- Implement proper authentication
- Add HTTPS certificate

## 🔒 Security Notes

For production deployment:
1. Change default admin credentials
2. Implement proper authentication (JWT, OAuth)
3. Use HTTPS
4. Add rate limiting
5. Validate all inputs on backend
6. Use environment variables for secrets
7. Implement CSRF protection
8. Add proper error handling
9. Set up logging and monitoring

## 📧 Contact & Email

To enable email sending in production:
1. Integrate with SendGrid, AWS SES, or similar service
2. Update `/api/send-email` in `app.py`
3. Add email templates

## 🐛 Troubleshooting

### Backend not starting?
```bash
# Check Python version
python --version

# Make sure dependencies are installed
pip install -r requirements.txt

# Try running with python3
python3 app.py
```

### Forms not submitting?
1. Check browser console for errors
2. Ensure backend is running on port 5000
3. Check CORS settings in `app.py`

### Styling issues?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check CSS file path is correct
3. Open DevTools (F12) and check for 404 errors

## 📚 Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [CSS Guide](https://www.w3schools.com/css/)
- [JavaScript Guide](https://www.w3schools.com/js/)
- [HTML Guide](https://www.w3schools.com/html/)

## 📄 License

This project is created for educational and commercial purposes.

## 👥 Team

Created with ❤️ by Stitch Queen Team

---

**Version**: 1.0.0  
**Last Updated**: May 2026

For support, contact: info@stitchqueen.com

🧵 **Happy Stitching!** ✨
