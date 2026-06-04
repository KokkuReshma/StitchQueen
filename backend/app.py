"""
Stitch Queen - Flask Backend
A luxury tailoring boutique management system
"""

from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from datetime import datetime, timedelta
import json
import os
from pathlib import Path

# Initialize Flask app
app = Flask(__name__, static_folder='../js', template_folder='../frontend')
CORS(app)
app.secret_key = 'stitchqueen_secret_key_2026'

# Data storage directory
DATA_DIR = Path(__file__).parent / 'data'
DATA_DIR.mkdir(exist_ok=True)

# Database files
BOOKINGS_FILE = DATA_DIR / 'bookings.json'
CUSTOMERS_FILE = DATA_DIR / 'customers.json'
MEASUREMENTS_FILE = DATA_DIR / 'measurements.json'

# Initialize data files
def init_data_files():
    """Initialize JSON data files if they don't exist"""
    if not BOOKINGS_FILE.exists():
        with open(BOOKINGS_FILE, 'w') as f:
            json.dump([], f)
    
    if not CUSTOMERS_FILE.exists():
        with open(CUSTOMERS_FILE, 'w') as f:
            json.dump([], f)
    
    if not MEASUREMENTS_FILE.exists():
        with open(MEASUREMENTS_FILE, 'w') as f:
            json.dump([], f)

# Load data from JSON files
def load_data(filename):
    """Load data from JSON file"""
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except:
        return []

# Save data to JSON files
def save_data(filename, data):
    """Save data to JSON file"""
    try:
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except:
        return False

# ==========================================
# ROUTES
# ==========================================

from flask import render_template

@app.route('/')
def index():
    return render_template('index.html')

# Booking Routes
@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    """Get all bookings"""
    bookings = load_data(BOOKINGS_FILE)
    return jsonify(bookings)

@app.route('/api/bookings/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    """Get specific booking"""
    bookings = load_data(BOOKINGS_FILE)
    booking = next((b for b in bookings if b.get('id') == booking_id), None)
    
    if booking:
        return jsonify(booking)
    return jsonify({'error': 'Booking not found'}), 404

@app.route('/api/submit-form', methods=['POST'])
def submit_form():
    """Handle form submissions (bookings, measurements, contact)"""
    try:
        data = request.get_json()
        
        # Add timestamp
        data['timestamp'] = datetime.now().isoformat()
        data['id'] = len(load_data(BOOKINGS_FILE)) + 1
        
        # Determine form type and save accordingly
        form_type = data.get('service') or data.get('type', 'booking')
        
        if 'date' in data and 'time' in data:
            # It's a booking form
            bookings = load_data(BOOKINGS_FILE)
            bookings.append(data)
            save_data(BOOKINGS_FILE, bookings)
            
            # Also save customer info
            customers = load_data(CUSTOMERS_FILE)
            customer = {
                'id': data.get('id'),
                'name': data.get('name'),
                'email': data.get('email'),
                'phone': data.get('phone'),
                'created_at': data.get('timestamp')
            }
            customers.append(customer)
            save_data(CUSTOMERS_FILE, customers)
            
            return jsonify({
                'success': True,
                'message': 'Booking submitted successfully!',
                'booking_id': data.get('id')
            })
        
        elif 'bust' in data or 'measurements' in data:
            # It's a measurements form
            measurements = load_data(MEASUREMENTS_FILE)
            measurements.append(data)
            save_data(MEASUREMENTS_FILE, measurements)
            
            return jsonify({
                'success': True,
                'message': 'Measurements saved successfully!',
                'measurement_id': data.get('id')
            })
        
        else:
            # It's a contact form
            # In production, send email here
            return jsonify({
                'success': True,
                'message': 'Message sent successfully! We will contact you soon.'
            })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    """Create a new booking"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'date', 'time', 'service']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        bookings = load_data(BOOKINGS_FILE)
        booking = {
            'id': len(bookings) + 1,
            'name': data.get('name'),
            'email': data.get('email'),
            'phone': data.get('phone'),
            'date': data.get('date'),
            'time': data.get('time'),
            'service': data.get('service'),
            'event': data.get('event', ''),
            'budget': data.get('budget', ''),
            'notes': data.get('notes', ''),
            'status': 'pending',
            'created_at': datetime.now().isoformat()
        }
        
        bookings.append(booking)
        save_data(BOOKINGS_FILE, bookings)
        
        return jsonify({
            'success': True,
            'message': 'Booking created successfully!',
            'booking': booking
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/bookings/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    """Update booking status"""
    try:
        data = request.get_json()
        bookings = load_data(BOOKINGS_FILE)
        
        booking = next((b for b in bookings if b.get('id') == booking_id), None)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Update status or other fields
        for key, value in data.items():
            if key != 'id':
                booking[key] = value
        
        save_data(BOOKINGS_FILE, bookings)
        
        return jsonify({
            'success': True,
            'message': 'Booking updated successfully!',
            'booking': booking
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    """Delete a booking"""
    try:
        bookings = load_data(BOOKINGS_FILE)
        bookings = [b for b in bookings if b.get('id') != booking_id]
        save_data(BOOKINGS_FILE, bookings)
        
        return jsonify({
            'success': True,
            'message': 'Booking deleted successfully!'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Customer Routes
@app.route('/api/customers', methods=['GET'])
def get_customers():
    """Get all customers"""
    customers = load_data(CUSTOMERS_FILE)
    return jsonify(customers)

@app.route('/api/customers/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    """Get specific customer"""
    customers = load_data(CUSTOMERS_FILE)
    customer = next((c for c in customers if c.get('id') == customer_id), None)
    
    if customer:
        return jsonify(customer)
    return jsonify({'error': 'Customer not found'}), 404

# Measurements Routes
@app.route('/api/measurements', methods=['GET'])
def get_measurements():
    """Get all measurements"""
    measurements = load_data(MEASUREMENTS_FILE)
    return jsonify(measurements)

@app.route('/api/measurements', methods=['POST'])
def save_measurements():
    """Save body measurements"""
    try:
        data = request.get_json()
        
        measurements = load_data(MEASUREMENTS_FILE)
        measurement = {
            'id': len(measurements) + 1,
            'name': data.get('name'),
            'email': data.get('email'),
            'phone': data.get('phone'),
            'bust': data.get('bust'),
            'waist': data.get('waist'),
            'hip': data.get('hip'),
            'shoulder': data.get('shoulder'),
            'length': data.get('length'),
            'sleeve': data.get('sleeve'),
            'neckSize': data.get('neckSize', ''),
            'armhole': data.get('armhole', ''),
            'size': data.get('size', ''),
            'bodyType': data.get('bodyType', ''),
            'notes': data.get('notes', ''),
            'saved_at': datetime.now().isoformat()
        }
        
        measurements.append(measurement)
        save_data(MEASUREMENTS_FILE, measurements)
        
        return jsonify({
            'success': True,
            'message': 'Measurements saved successfully!',
            'measurement': measurement
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Admin Routes
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Admin login"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Simple authentication (in production, use proper auth)
        if email == 'admin@stitchqueen.com' and password == 'stitchqueen123':
            session['admin'] = True
            return jsonify({
                'success': True,
                'message': 'Login successful!',
                'token': 'admin_token_2026'
            })
        
        return jsonify({
            'success': False,
            'error': 'Invalid credentials'
        }), 401
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/admin/dashboard', methods=['GET'])
def admin_dashboard():
    """Get admin dashboard stats"""
    try:
        bookings = load_data(BOOKINGS_FILE)
        customers = load_data(CUSTOMERS_FILE)
        measurements = load_data(MEASUREMENTS_FILE)
        
        stats = {
            'total_bookings': len(bookings),
            'total_customers': len(customers),
            'total_measurements': len(measurements),
            'pending_bookings': len([b for b in bookings if b.get('status') == 'pending']),
            'completed_bookings': len([b for b in bookings if b.get('status') == 'completed']),
            'recent_bookings': bookings[-5:] if bookings else []
        }
        
        return jsonify(stats)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Statistics Routes
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get general statistics"""
    try:
        bookings = load_data(BOOKINGS_FILE)
        customers = load_data(CUSTOMERS_FILE)
        
        today = datetime.now().date()
        today_bookings = [b for b in bookings if b.get('date') == str(today)]
        
        stats = {
            'total_bookings': len(bookings),
            'total_customers': len(customers),
            'today_bookings': len(today_bookings),
            'pending_bookings': len([b for b in bookings if b.get('status') == 'pending'])
        }
        
        return jsonify(stats)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Email notification (example - integrate with email service)
@app.route('/api/send-email', methods=['POST'])
def send_email():
    """Send email notification"""
    try:
        data = request.get_json()
        
        # In production, integrate with email service like SendGrid or AWS SES
        # For now, just log it
        email_log = {
            'to': data.get('to'),
            'subject': data.get('subject'),
            'body': data.get('body'),
            'sent_at': datetime.now().isoformat()
        }
        
        print(f"Email would be sent: {email_log}")
        
        return jsonify({
            'success': True,
            'message': 'Email sent successfully!'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Stitch Queen API'
    })

# ==========================================
# MAIN
# ==========================================

if __name__ == '__main__':
    # Initialize data files
    init_data_files()
    
    # Run Flask app
    print("=" * 50)
    print("🧵 Stitch Queen - Flask Backend")
    print("=" * 50)
    print("Server starting on http://localhost:5000")
    print("API Documentation:")
    print("  GET  /api/bookings")
    print("  POST /api/bookings")
    print("  GET  /api/customers")
    print("  GET  /api/measurements")
    print("  POST /api/measurements")
    print("  GET  /api/stats")
    print("=" * 50)
    
    # Run development server
    app.run(
        debug=False,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )

