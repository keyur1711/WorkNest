export const spaces = [
  {
    id: 'spc-1',
    name: 'Downtown Hub MG Road',
    city: 'Bengaluru',
    locationText: 'MG Road, Bengaluru, India',
    type: 'Hot Desk',
    pricePerDay: 899,
    rating: 4.6,
    capacity: 120,
    coordinates: { lat: 12.9738, lng: 77.6095 },
    amenities: ['Wi‑Fi', 'Meeting Rooms', 'Coffee', 'Parking', 'Projector'],
    images: ['/logo512.png'],
    owner: { id: 'own-1', name: 'WorkNest Ops', phone: '1800 123 777 888' },
    availability: {
      openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      openHours: '08:00-20:00'
    }
  },
  {
    id: 'spc-2',
    name: 'Tech Park Koramangala',
    city: 'Bengaluru',
    locationText: 'Koramangala 5th Block, Bengaluru, India',
    type: 'Dedicated Desk',
    pricePerDay: 1099,
    rating: 4.4,
    capacity: 80,
    coordinates: { lat: 12.9352, lng: 77.6245 },
    amenities: ['Wi‑Fi', 'Coffee', 'Printer', '24x7 Access'],
    images: ['/logo512.png'],
    owner: { id: 'own-2', name: 'TechSpaces', phone: '1800 555 9090' },
    availability: {
      openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      openHours: '07:00-22:00'
    }
  },
  {
    id: 'spc-3',
    name: 'Marine Drive Views',
    city: 'Mumbai',
    locationText: 'Marine Drive, Mumbai, India',
    type: 'Private Office',
    pricePerDay: 2499,
    rating: 4.8,
    capacity: 40,
    coordinates: { lat: 18.944, lng: 72.823 },
    amenities: ['Wi‑Fi', 'Conference Room', 'Coffee', 'Parking', 'Reception'],
    images: ['/logo512.png'],
    owner: { id: 'own-3', name: 'SeaView Offices', phone: '1800 111 2222' },
    availability: {
      openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      openHours: '09:00-19:00'
    }
  },
  {
    id: 'spc-4',
    name: 'Connaught Place Suites',
    city: 'Delhi',
    locationText: 'Connaught Place, New Delhi, India',
    type: 'Meeting Room',
    pricePerDay: 1599,
    rating: 4.3,
    capacity: 20,
    coordinates: { lat: 28.6315, lng: 77.2167 },
    amenities: ['Wi‑Fi', 'Projector', 'Whiteboard', 'Tea/Coffee'],
    images: ['/logo512.png'],
    owner: { id: 'own-4', name: 'Capital Workspaces', phone: '1800 333 4444' },
    availability: {
      openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      openHours: '08:00-21:00'
    }
  },
  {
    id: 'spc-5',
    name: 'Baner Innovation Center',
    city: 'Pune',
    locationText: 'Baner, Pune, India',
    type: 'Hot Desk',
    pricePerDay: 749,
    rating: 4.2,
    capacity: 100,
    coordinates: { lat: 18.559, lng: 73.786 },
    amenities: ['Wi‑Fi', 'Coffee', 'Lockers', 'AC'],
    images: ['/logo512.png'],
    owner: { id: 'own-5', name: 'Innov8 Pune', phone: '1800 777 0000' },
    availability: {
      openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      openHours: '08:00-20:00'
    }
  }
  ,
  {
    id: 'spc-6',
    name: 'Hitech City Hub',
    city: 'Hyderabad',
    locationText: 'Hitech City, Hyderabad, India',
    type: 'Dedicated Desk',
    pricePerDay: 999,
    rating: 4.5,
    capacity: 90,
    coordinates: { lat: 17.4483, lng: 78.3915 },
    amenities: ['Wi‑Fi', 'Meeting Rooms', 'Tea/Coffee', 'Parking'],
    images: ['/logo512.png'],
    owner: { id: 'own-6', name: 'TechHub Hyd', phone: '1800 909 1212' },
    availability: {
      openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      openHours: '08:00-21:00'
    }
  },
  {
    id: 'spc-7',
    name: 'Salt Lake Sector V',
    city: 'Kolkata',
    locationText: 'Sector V, Bidhannagar, Kolkata, India',
    type: 'Hot Desk',
    pricePerDay: 699,
    rating: 4.1,
    capacity: 150,
    coordinates: { lat: 22.5754, lng: 88.4337 },
    amenities: ['Wi‑Fi', 'Printer', 'Pantry', 'AC'],
    images: ['/logo512.png'],
    owner: { id: 'own-7', name: 'EastWorks', phone: '1800 123 4545' },
    availability: {
      openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      openHours: '08:00-20:00'
    }
  },
  {
    id: 'spc-8',
    name: 'Gachibowli Executive Suites',
    city: 'Hyderabad',
    locationText: 'Gachibowli, Hyderabad, India',
    type: 'Private Office',
    pricePerDay: 2199,
    rating: 4.7,
    capacity: 60,
    coordinates: { lat: 17.4401, lng: 78.3489 },
    amenities: ['Wi‑Fi', 'Conference Room', 'Parking', 'Reception'],
    images: ['/logo512.png'],
    owner: { id: 'own-8', name: 'Telangana Offices', phone: '1800 343 8989' },
    availability: {
      openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      openHours: '09:00-19:00'
    }
  },
  {
    id: 'spc-9',
    name: 'Noida Sector 62 Center',
    city: 'Delhi',
    locationText: 'Sector 62, Noida, NCR, India',
    type: 'Meeting Room',
    pricePerDay: 1399,
    rating: 4.0,
    capacity: 25,
    coordinates: { lat: 28.628, lng: 77.363 },
    amenities: ['Wi‑Fi', 'Projector', 'Whiteboard', 'Parking'],
    images: ['/logo512.png'],
    owner: { id: 'own-9', name: 'NCR Workspaces', phone: '1800 000 6262' },
    availability: {
      openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      openHours: '08:00-21:00'
    }
  },
  {
    id: 'spc-10',
    name: 'Andheri Startup Labs',
    city: 'Mumbai',
    locationText: 'Andheri East, Mumbai, India',
    type: 'Dedicated Desk',
    pricePerDay: 1199,
    rating: 4.3,
    capacity: 110,
    coordinates: { lat: 19.1197, lng: 72.8468 },
    amenities: ['Wi‑Fi', 'Coffee', 'Phone Booths', '24x7 Access'],
    images: ['/logo512.png'],
    owner: { id: 'own-10', name: 'Bombay CoWorks', phone: '1800 212 9000' },
    availability: {
      openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      openHours: '08:00-20:00'
    }
  },
  {
    id: 'spc-11',
    name: 'Hadapsar Enterprise Park',
    city: 'Pune',
    locationText: 'Hadapsar, Pune, India',
    type: 'Private Office',
    pricePerDay: 1999,
    rating: 4.5,
    capacity: 70,
    coordinates: { lat: 18.5089, lng: 73.926 },
    amenities: ['Wi‑Fi', 'Conference Room', 'Parking', 'Cafeteria'],
    images: ['/logo512.png'],
    owner: { id: 'own-11', name: 'Pune BizSpaces', phone: '1800 888 1919' },
    availability: {
      openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      openHours: '09:00-19:00'
    }
  },
  {
    id: 'spc-12',
    name: 'HSR Layout Creators Club',
    city: 'Bengaluru',
    locationText: 'HSR Layout, Bengaluru, India',
    type: 'Hot Desk',
    pricePerDay: 799,
    rating: 4.4,
    capacity: 140,
    coordinates: { lat: 12.9141, lng: 77.6387 },
    amenities: ['Wi‑Fi', 'Lockers', 'Coffee', 'AC'],
    images: ['/logo512.png'],
    owner: { id: 'own-12', name: 'StartHub BLR', phone: '1800 232 3434' },
    availability: {
      openDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      openHours: '08:00-21:00'
    }
  }
];

export const cities = ['Bengaluru', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Kolkata'];
export const types = ['Hot Desk', 'Dedicated Desk', 'Private Office', 'Meeting Room'];


