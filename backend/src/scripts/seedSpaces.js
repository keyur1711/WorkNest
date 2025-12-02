// /* eslint-disable no-console */
// const path = require('path');
// const dotenv = require('dotenv');
// const connectDB = require('../config/db');
// const Space = require('../models/Space');

// dotenv.config({
//   path: path.resolve(__dirname, '../../.env')
// });

// const seedSpaces = [
//   {
//     name: 'Downtown Hub MG Road',
//     city: 'Bengaluru',
//     locationText: 'MG Road, Bengaluru, India',
//     type: 'Hot Desk',
//     pricePerDay: 899,
//     rating: 4.6,
//     capacity: 120,
//     coordinates: { lat: 12.9738, lng: 77.6095 },
//     amenities: ['Wi-Fi', 'Meeting Rooms', 'Coffee', 'Parking', 'Projector'],
//     images: ['/logo512.png'],
//     owner: { name: 'WorkNest Ops', phone: '1800 123 777 888' },
//     availability: {
//       openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//       openHours: '08:00-20:00'
//     }
//   },
//   {
//     name: 'Tech Park Koramangala',
//     city: 'Bengaluru',
//     locationText: 'Koramangala 5th Block, Bengaluru, India',
//     type: 'Dedicated Desk',
//     pricePerDay: 1099,
//     rating: 4.4,
//     capacity: 80,
//     coordinates: { lat: 12.9352, lng: 77.6245 },
//     amenities: ['Wi-Fi', 'Coffee', 'Printer', '24x7 Access'],
//     images: ['/logo512.png'],
//     owner: { name: 'TechSpaces', phone: '1800 555 9090' },
//     availability: {
//       openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//       openHours: '07:00-22:00'
//     }
//   },
//   {
//     name: 'Marine Drive Views',
//     city: 'Mumbai',
//     locationText: 'Marine Drive, Mumbai, India',
//     type: 'Private Office',
//     pricePerDay: 2499,
//     rating: 4.8,
//     capacity: 40,
//     coordinates: { lat: 18.944, lng: 72.823 },
//     amenities: ['Wi-Fi', 'Conference Room', 'Coffee', 'Parking', 'Reception'],
//     images: ['/logo512.png'],
//     owner: { name: 'SeaView Offices', phone: '1800 111 2222' },
//     availability: {
//       openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//       openHours: '09:00-19:00'
//     }
//   },
//   {
//     name: 'Connaught Place Suites',
//     city: 'Delhi',
//     locationText: 'Connaught Place, New Delhi, India',
//     type: 'Meeting Room',
//     pricePerDay: 1599,
//     rating: 4.3,
//     capacity: 20,
//     coordinates: { lat: 28.6315, lng: 77.2167 },
//     amenities: ['Wi-Fi', 'Projector', 'Whiteboard', 'Tea/Coffee'],
//     images: ['/logo512.png'],
//     owner: { name: 'Capital Workspaces', phone: '1800 333 4444' },
//     availability: {
//       openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//       openHours: '08:00-21:00'
//     }
//   },
//   {
//     name: 'Baner Innovation Center',
//     city: 'Pune',
//     locationText: 'Baner, Pune, India',
//     type: 'Hot Desk',
//     pricePerDay: 749,
//     rating: 4.2,
//     capacity: 100,
//     coordinates: { lat: 18.559, lng: 73.786 },
//     amenities: ['Wi-Fi', 'Coffee', 'Lockers', 'AC'],
//     images: ['/logo512.png'],
//     owner: { name: 'Innov8 Pune', phone: '1800 777 0000' },
//     availability: {
//       openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//       openHours: '08:00-20:00'
//     }
//   },
//   {
//     name: 'Hitech City Hub',
//     city: 'Hyderabad',
//     locationText: 'Hitech City, Hyderabad, India',
//     type: 'Dedicated Desk',
//     pricePerDay: 999,
//     rating: 4.5,
//     capacity: 90,
//     coordinates: { lat: 17.4483, lng: 78.3915 },
//     amenities: ['Wi-Fi', 'Meeting Rooms', 'Tea/Coffee', 'Parking'],
//     images: ['/logo512.png'],
//     owner: { name: 'TechHub Hyd', phone: '1800 909 1212' },
//     availability: {
//       openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//       openHours: '08:00-21:00'
//     }
//   },
//   {
//     name: 'Salt Lake Sector V',
//     city: 'Kolkata',
//     locationText: 'Sector V, Bidhannagar, Kolkata, India',
//     type: 'Hot Desk',
//     pricePerDay: 699,
//     rating: 4.1,
//     capacity: 150,
//     coordinates: { lat: 22.5754, lng: 88.4337 },
//     amenities: ['Wi-Fi', 'Printer', 'Pantry', 'AC'],
//     images: ['/logo512.png'],
//     owner: { name: 'EastWorks', phone: '1800 123 4545' },
//     availability: {
//       openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//       openHours: '08:00-20:00'
//     }
//   },
//   {
//     name: 'Gachibowli Executive Suites',
//     city: 'Hyderabad',
//     locationText: 'Gachibowli, Hyderabad, India',
//     type: 'Private Office',
//     pricePerDay: 2199,
//     rating: 4.7,
//     capacity: 60,
//     coordinates: { lat: 17.4401, lng: 78.3489 },
//     amenities: ['Wi-Fi', 'Conference Room', 'Parking', 'Reception'],
//     images: ['/logo512.png'],
//     owner: { name: 'Telangana Offices', phone: '1800 343 8989' },
//     availability: {
//       openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//       openHours: '09:00-19:00'
//     }
//   },
//   {
//     name: 'Noida Sector 62 Center',
//     city: 'Delhi',
//     locationText: 'Sector 62, Noida, NCR, India',
//     type: 'Meeting Room',
//     pricePerDay: 1399,
//     rating: 4.0,
//     capacity: 25,
//     coordinates: { lat: 28.628, lng: 77.363 },
//     amenities: ['Wi-Fi', 'Projector', 'Whiteboard', 'Parking'],
//     images: ['/logo512.png'],
//     owner: { name: 'NCR Workspaces', phone: '1800 000 6262' },
//     availability: {
//       openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//       openHours: '08:00-21:00'
//     }
//   },
//   {
//     name: 'Andheri Startup Labs',
//     city: 'Mumbai',
//     locationText: 'Andheri East, Mumbai, India',
//     type: 'Dedicated Desk',
//     pricePerDay: 1199,
//     rating: 4.3,
//     capacity: 110,
//     coordinates: { lat: 19.1197, lng: 72.8468 },
//     amenities: ['Wi-Fi', 'Coffee', 'Phone Booths', '24x7 Access'],
//     images: ['/logo512.png'],
//     owner: { name: 'Bombay CoWorks', phone: '1800 212 9000' },
//     availability: {
//       openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//       openHours: '08:00-20:00'
//     }
//   },
//   {
//     name: 'Hadapsar Enterprise Park',
//     city: 'Pune',
//     locationText: 'Hadapsar, Pune, India',
//     type: 'Private Office',
//     pricePerDay: 1999,
//     rating: 4.5,
//     capacity: 70,
//     coordinates: { lat: 18.5089, lng: 73.926 },
//     amenities: ['Wi-Fi', 'Conference Room', 'Parking', 'Cafeteria'],
//     images: ['/logo512.png'],
//     owner: { name: 'Pune BizSpaces', phone: '1800 888 1919' },
//     availability: {
//       openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//       openHours: '09:00-19:00'
//     }
//   },
//   {
//     name: 'HSR Layout Creators Club',
//     city: 'Bengaluru',
//     locationText: 'HSR Layout, Bengaluru, India',
//     type: 'Hot Desk',
//     pricePerDay: 799,
//     rating: 4.4,
//     capacity: 140,
//     coordinates: { lat: 12.9141, lng: 77.6387 },
//     amenities: ['Wi-Fi', 'Lockers', 'Coffee', 'AC'],
//     images: ['/logo512.png'],
//     owner: { name: 'StartHub BLR', phone: '1800 232 3434' },
//     availability: {
//       openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//       openHours: '08:00-21:00'
//     }
//   }
// ];

// // Available workspace images from frontend/src/images folder
// const workspaceImages = [
//   '/static/media/austin-distel-wawEfYdpkag-unsplash.jpg',
//   '/static/media/infralist-com-kmIKEGO7Vl4-unsplash.jpg',
//   '/static/media/uneebo-office-design-UgYT5nkXdK4-unsplash.jpg',
//   '/static/media/pawel-chu-ULh0i2txBCY-unsplash.jpg',
//   '/static/media/suryadhityas-NrDZJ9oWV_Y-unsplash.jpg',
//   '/static/media/running-a-successful-coworking-space-5aaa98c0bb414814ce745dc8.jpg',
//   '/static/media/bean_buro_work_project_causeway_bay_raised_meeting_room_copy.jpg',
//   '/static/media/PAB9080-HDR-1.jpg',
//   '/static/media/The-Anatomy-of-Good-Coworking-Space-Design-In-Pictures-Fohlio-Product-Specification-and-Materials-Budget-Calculator-The-Assemblage-1.webp',
//   '/static/media/The-Anatomy-of-Good-Coworking-Space-Design-In-Pictures-Fohlio-Product-Specification-and-Materials-Budget-Calculator-WeWork-Shanghai-1.webp'
// ];

// // Function to get random images for a space (1-3 images)
// function getRandomImages() {
//   const numImages = Math.floor(Math.random() * 3) + 1; // 1-3 images
//   const shuffled = [...workspaceImages].sort(() => Math.random() - 0.5);
//   return shuffled.slice(0, numImages);
// }

// // Assign random images to each space
// seedSpaces.forEach(space => {
//   space.images = getRandomImages();
// });

// const User = require('../models/User');

// const seedDatabase = async () => {
//   try {
//     await connectDB();

//     // Find admin user to assign as owner
//     const adminEmail = process.env.ADMIN_EMAIL || 'admin@worknest.com';
//     let admin = await User.findOne({ email: adminEmail });

//     if (!admin) {
//       console.log('Admin user not found. Creating one...');
//       // Create a default admin if not exists (though seedAdmin should be run first preferably)
//       // For simplicity in this script, we'll try to find ANY user if admin specific one fails, or just fail.
//       // Better: Let's just find the first user available if admin is missing, or create a dummy one.

//       // Try to find ANY user
//       admin = await User.findOne();

//       if (!admin) {
//         console.error('No users found in database. Please run "npm run seed:admin" first.');
//         process.exit(1);
//       }
//     }

//     console.log(`Assigning spaces to user: ${admin.email} (${admin._id})`);

//     const spacesWithOwner = seedSpaces.map(space => ({
//       ...space,
//       ownerUser: admin._id
//     }));

//     await Space.deleteMany({});
//     await Space.insertMany(spacesWithOwner);

//     console.log(`Seeded ${spacesWithOwner.length} spaces successfully.`);
//     process.exit(0);
//   } catch (error) {
//     console.error('Failed to seed database:', error);
//     process.exit(1);
//   }
// };

// seedDatabase();

