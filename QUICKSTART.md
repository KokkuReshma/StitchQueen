# ⚡ Stitch Queen - Quick Start Guide

Get your Stitch Queen website running in 5 minutes!

## 🚀 Quick Setup

### Step 1: Navigate to Project
```bash
cd "C:\Users\Testing\OneDrive\Desktop\Tailor Website\stitchqueen"
```

### Step 2: Install Backend Dependencies
```bash
cd backend
pip install Flask Flask-CORS
```

### Step 3: Start the Backend
```bash
python app.py
```
✅ Backend running at: `http://localhost:5000`

### Step 4: Open the Website
Simply open in your browser:
```
file:///C:/Users/Testing/OneDrive/Desktop/Tailor%20Website/stitchqueen/frontend/home.html
```

Or use Python's built-in server:
```bash
python -m http.server 8000
# Then visit: http://localhost:8000/frontend/home.html
```

---

## 🎯 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `home.html` | Hero, trending designs, reviews |
| Gallery | `gallery.html` | Image showcase with filters |
| Designs | `designs.html` | Custom design collections |
| Bridal | `bridal.html` | Bridal collection |
| Maggam | `maggam.html` | Stone work & embellishment |
| Booking | `booking.html` | Consultation booking |
| Measurements | `measurements.html` | Body measurements form |
| About | `about.html` | About company & team |
| Contact | `contact.html` | Contact form & location |
| Admin | `admin.html` | Admin dashboard |

---

## 👤 Admin Access

**URL**: `admin.html`

**Login Credentials:**
- Email: `admin@stitchqueen.com`
- Password: `stitchqueen123`

---

## 📁 File Structure

```
stitchqueen/
├── frontend/          ← All HTML pages
├── css/
│   └── style.css      ← All styling
├── js/
│   └── script.js      ← All interactivity
├── images/            ← Placeholder for images
└── backend/
    └── app.py         ← Flask API
```

---

## 🎨 Customize

### Change Business Name
1. Open any `frontend/*.html` file
2. Replace "STITCH QUEEN" with your name
3. Replace phone number `+1 (555) 123-4567`
4. Replace email `info@stitchqueen.com`

### Change Colors
Edit `css/style.css` top section:
```css
:root {
    --primary-black: #1a1a1a;
    --primary-gold: #d4af37;
    --primary-pink: #e91e63;
    --primary-white: #ffffff;
}
```

---

## 🔗 API Reference

### Create Booking
```javascript
fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        name: "John Doe",
        email: "john@example.com",
        phone: "5551234567",
        date: "2026-06-15",
        time: "10:00",
        service: "Bridal"
    })
})
```

### Get All Bookings
```javascript
fetch('http://localhost:5000/api/bookings')
    .then(r => r.json())
    .then(data => console.log(data))
```

### Get Statistics
```javascript
fetch('http://localhost:5000/api/stats')
    .then(r => r.json())
    .then(data => console.log(data))
```

---

## ✨ Features Included

✅ Responsive design (mobile-friendly)
✅ 10 fully-designed HTML pages
✅ Professional CSS styling
✅ Interactive JavaScript forms
✅ Flask backend API
✅ Admin dashboard
✅ Booking management
✅ Customer tracking
✅ Measurements form
✅ Contact page with map
✅ Smooth animations
✅ Gallery with filters
✅ Testimonials
✅ Size chart
✅ FAQ sections

---

## 🐛 Common Issues

**Q: Backend won't start?**
```bash
pip install --upgrade Flask Flask-CORS
python app.py
```

**Q: Styles not showing?**
- Clear browser cache (Ctrl+Shift+Delete)
- Make sure CSS file path is correct

**Q: Forms not working?**
- Check if backend is running on port 5000
- Open browser console (F12) for errors

**Q: Getting CORS errors?**
- Backend has CORS enabled already
- Restart backend if you modified it

---

## 📱 Tested On

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

---

## 📞 Need Help?

1. Check `README.md` for detailed documentation
2. Open browser DevTools (F12) to check for errors
3. Review the code comments
4. Test with provided demo credentials

---

## 🚀 Next Steps

1. ✅ Start backend
2. ✅ Open home.html
3. ✅ Test all pages
4. ✅ Try booking form
5. ✅ Login to admin
6. ✅ Customize for your business
7. ✅ Deploy to web server

---

**Enjoy your Stitch Queen website! 🧵✨**

*Version 1.0 | May 2026*
