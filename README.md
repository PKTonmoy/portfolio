# Portfolio Website with Admin Dashboard

A modern, professional single-page portfolio website with a comprehensive admin dashboard for dynamic content management.

## Features

### Portfolio Website
- **Hero Section**: Eye-catching hero with professional image and call-to-action
- **Services/Skills Cards**: Showcase your expertise with beautiful cards
- **Projects Section**: Display your work with clickable links
- **Contact Form**: Visitors can send you messages directly
- **Responsive Design**: Works perfectly on all devices
- **Smooth Animations**: Modern animations and transitions
- **Royal Color Palette**: Professional Royal Blue, Navy Blue, Black, and White theme
- **SF Pro Font**: Premium typography throughout

### Admin Dashboard
- **Secure Authentication**: Login-protected admin panel
- **Hero Management**: Update heading, subheading, CTA, and image
- **Cards CRUD**: Add, edit, and delete service/skill cards
- **Projects CRUD**: Manage portfolio projects with links and images
- **Message Inbox**: View and manage contact form submissions
- **Footer Editor**: Update copyright and social links
- **Real-time Updates**: Changes reflect immediately on the main site

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Access the Website**
   - Portfolio: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin.html

## Admin Credentials

**Default Login:**
- Username: `admin`
- Password: `admin123`

> **Important**: Change these credentials in `server/data/config.json` before deploying to production.

## Project Structure

```
protfolio/
├── public/              # Frontend files
│   ├── index.html       # Main portfolio page
│   ├── admin.html       # Admin dashboard
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   └── images/          # Image assets
├── server/              # Backend files
│   ├── server.js        # Express server
│   ├── routes/          # API routes
│   └── data/            # JSON data storage
└── package.json         # Dependencies
```

## Customization

### Change Admin Credentials
Edit `server/data/config.json`:
```json
{
  "admin": {
    "username": "your-username",
    "password": "your-password"
  }
}
```

### Update Content
Use the admin dashboard at `/admin.html` to update all content dynamically, or edit `server/data/content.json` directly.

### Modify Colors
Edit CSS variables in `public/css/style.css` and `public/css/admin.css`:
```css
:root {
  --royal-blue: #4169E1;
  --navy-blue: #000080;
  /* ... other colors */
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Check auth status

### Content
- `GET /api/content` - Get all content
- `PUT /api/content/hero` - Update hero section
- `POST /api/content/cards` - Add card
- `PUT /api/content/cards/:id` - Update card
- `DELETE /api/content/cards/:id` - Delete card
- Similar endpoints for projects and footer

### Messages
- `POST /api/messages` - Submit contact message
- `GET /api/messages` - Get all messages (admin)
- `DELETE /api/messages/:id` - Delete message (admin)

## Deployment

### Production Checklist
1. Change admin credentials
2. Set `SESSION_SECRET` environment variable
3. Enable HTTPS and set `cookie.secure: true` in session config
4. Consider using a database instead of JSON files for production
5. Add rate limiting for API endpoints
6. Implement proper password hashing

### Environment Variables
- `PORT` - Server port (default: 3000)
- `SESSION_SECRET` - Session encryption key

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Authentication**: express-session
- **Storage**: JSON files (can be replaced with database)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

MIT License - Feel free to use this for your own portfolio!

## Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using modern web technologies
