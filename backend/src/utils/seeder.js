const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Property = require('../models/Property');
const Review = require('../models/Review');

mongoose.connect(process.env.MONGO_URI);

const users = [
  { name: 'Admin User', email: 'admin@propspace.com', password: 'password123', role: 'admin' },
  { name: 'Sarah Mitchell', email: 'sarah@propspace.com', password: 'password123', role: 'agent', phone: '+1-555-0101', bio: 'Top-rated agent with 10+ years experience in luxury real estate.' },
  { name: 'James Carter', email: 'james@propspace.com', password: 'password123', role: 'agent', phone: '+1-555-0102', bio: 'Specializing in residential properties and first-time home buyers.' },
  { name: 'Emily Johnson', email: 'emily@propspace.com', password: 'password123', role: 'user' }
];

const getProperties = (ownerIds) => [
  {
    title: 'Stunning Modern Villa with Ocean Views',
    description: 'Experience luxury living in this breathtaking modern villa perched above the coastline. Floor-to-ceiling windows frame panoramic ocean views from every room. The open-plan living space flows seamlessly to an infinity pool terrace. Chef\'s kitchen with premium appliances, 5 en-suite bedrooms, and a private gym complete this masterpiece.',
    type: 'villa', listingType: 'sale', price: 4500000, status: 'active', featured: true,
    address: { street: '1 Ocean Drive', city: 'Malibu', state: 'CA', zipCode: '90265' },
    size: 5800, bedrooms: 5, bathrooms: 6, garage: 3, yearBuilt: 2021,
    images: [
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200', caption: 'Front Exterior' },
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200', caption: 'Living Room' },
      { url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200', caption: 'Pool Area' }
    ],
    amenities: ['pool', 'gym', 'parking', 'security', 'balcony', 'air_conditioning', 'alarm_system'],
    owner: ownerIds[1]
  },
  {
    title: 'Elegant Downtown Penthouse',
    description: 'Perched atop one of downtown\'s most iconic towers, this penthouse offers 360-degree city views. The sprawling terrace is perfect for entertaining. Inside, Italian marble floors, custom millwork, and curated finishes create an atmosphere of refined elegance. Building amenities include concierge, rooftop lounge, and valet parking.',
    type: 'apartment', listingType: 'sale', price: 2800000, status: 'active', featured: true,
    address: { street: '500 Park Avenue', city: 'New York', state: 'NY', zipCode: '10022' },
    size: 3200, bedrooms: 4, bathrooms: 4, garage: 2, yearBuilt: 2019,
    images: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200', caption: 'Penthouse Exterior' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200', caption: 'Living Area' }
    ],
    amenities: ['parking', 'elevator', 'security', 'gym', 'concierge', 'air_conditioning', 'internet'],
    owner: ownerIds[1]
  },
  {
    title: 'Charming Craftsman Bungalow',
    description: 'This lovingly restored 1920s Craftsman bungalow blends original character with modern updates. Original hardwood floors, built-in bookcases, and picture-frame moldings evoke timeless charm. The updated kitchen opens to a covered porch overlooking a landscaped garden. Located in a top-rated school district.',
    type: 'house', listingType: 'sale', price: 895000, status: 'active', featured: true,
    address: { street: '742 Maple Street', city: 'Portland', state: 'OR', zipCode: '97201' },
    size: 1850, bedrooms: 3, bathrooms: 2, garage: 1, yearBuilt: 1924,
    images: [
      { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200', caption: 'Front of Home' },
      { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200', caption: 'Kitchen' }
    ],
    amenities: ['garden', 'parking', 'fireplace', 'laundry'],
    owner: ownerIds[2]
  },
  {
    title: 'Luxury High-Rise Apartment for Rent',
    description: 'Sophisticated urban living in this high-rise apartment with stunning skyline views. The open-concept layout features premium finishes throughout. Enjoy building amenities including rooftop pool, state-of-the-art fitness center, and 24-hour concierge. Walking distance to top restaurants, shopping, and cultural venues.',
    type: 'apartment', listingType: 'rent', price: 8500, priceUnit: 'per_month', status: 'active', featured: true,
    address: { street: '1200 Lakeshore Drive', city: 'Chicago', state: 'IL', zipCode: '60611' },
    size: 1400, bedrooms: 2, bathrooms: 2, garage: 1, yearBuilt: 2018,
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200', caption: 'Living Room' },
      { url: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200', caption: 'City Views' }
    ],
    amenities: ['pool', 'gym', 'parking', 'elevator', 'security', 'air_conditioning', 'internet', 'furnished'],
    owner: ownerIds[1]
  },
  {
    title: 'Spacious Family Home with Pool',
    description: 'Perfect for families, this generous home sits on a large lot in a quiet cul-de-sac. The updated kitchen features an island and opens to the family room. Four generous bedrooms upstairs, plus a bonus room. The backyard is an entertainer\'s dream with a pool, spa, and built-in BBQ.',
    type: 'house', listingType: 'sale', price: 1250000, status: 'active', featured: false,
    address: { street: '33 Willow Creek Road', city: 'Scottsdale', state: 'AZ', zipCode: '85251' },
    size: 3400, bedrooms: 4, bathrooms: 3, garage: 2, yearBuilt: 2005,
    images: [
      { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200', caption: 'Home Exterior' },
      { url: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=1200', caption: 'Pool' }
    ],
    amenities: ['pool', 'garage', 'garden', 'air_conditioning', 'laundry', 'security'],
    owner: ownerIds[2]
  },
  {
    title: 'Sleek Downtown Studio Apartment',
    description: 'Efficiently designed studio in the heart of the city. High ceilings, industrial-chic finishes, and a clever layout maximize every square foot. Floor-to-ceiling windows flood the space with natural light. Building features co-working space, bike storage, and a rooftop terrace.',
    type: 'studio', listingType: 'rent', price: 2800, priceUnit: 'per_month', status: 'active', featured: false,
    address: { street: '88 Market Street', city: 'San Francisco', state: 'CA', zipCode: '94102' },
    size: 520, bedrooms: 0, bathrooms: 1, garage: 0, yearBuilt: 2016,
    images: [
      { url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200', caption: 'Studio Interior' }
    ],
    amenities: ['elevator', 'security', 'internet', 'air_conditioning'],
    owner: ownerIds[2]
  },
  {
    title: 'Rustic Mountain Retreat',
    description: 'Escape to this stunning mountain retreat nestled among towering pines. The log-and-stone construction features soaring ceilings, a massive stone fireplace, and wraparound decks with mountain views. Fully furnished with high-end rustic furnishings. Minutes from skiing, hiking, and mountain biking trails.',
    type: 'house', listingType: 'sale', price: 1750000, status: 'active', featured: true,
    address: { street: '99 Pine Ridge Way', city: 'Aspen', state: 'CO', zipCode: '81611' },
    size: 2800, bedrooms: 4, bathrooms: 3, garage: 2, yearBuilt: 2010,
    images: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', caption: 'Mountain Home' },
      { url: 'https://images.unsplash.com/photo-1592595896616-c37162298647?w=1200', caption: 'Interior' }
    ],
    amenities: ['fireplace', 'parking', 'garden', 'storage', 'furnished', 'heating'],
    owner: ownerIds[1]
  },
  {
    title: 'Modern Townhouse in Prime Location',
    description: 'Contemporary townhouse offering 3 levels of thoughtfully designed living space. Open plan kitchen-dining-living on the main floor, 3 bedrooms and 2 baths above, and a flexible lower level perfect for a home office or gym. Private rooftop terrace with city views. Low HOA fees.',
    type: 'townhouse', listingType: 'sale', price: 685000, status: 'active', featured: false,
    address: { street: '215 Oak Avenue', city: 'Austin', state: 'TX', zipCode: '78701' },
    size: 2100, bedrooms: 3, bathrooms: 2, garage: 1, yearBuilt: 2020,
    images: [
      { url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200', caption: 'Townhouse Exterior' }
    ],
    amenities: ['parking', 'balcony', 'air_conditioning', 'laundry', 'internet'],
    owner: ownerIds[2]
  }
];

const importData = async () => {
  try {
    await Review.deleteMany();
    await Property.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create(users);
    const ownerIds = createdUsers.map(u => u._id);

    const properties = getProperties(ownerIds);
    const createdProperties = await Property.create(properties);

    // Add some reviews
    const reviews = [
      { title: 'Absolutely stunning!', text: 'This property exceeded every expectation. The views are incredible and the finishes are top-notch.', rating: 5, property: createdProperties[0]._id, user: createdUsers[3]._id },
      { title: 'Perfect downtown living', text: 'The location is unbeatable and the apartment itself is beautifully designed. Highly recommend!', rating: 5, property: createdProperties[1]._id, user: createdUsers[3]._id },
      { title: 'Great family home', text: 'Spacious, well-maintained, and in a fantastic neighborhood. The pool is a huge bonus.', rating: 4, property: createdProperties[4]._id, user: createdUsers[3]._id }
    ];
    await Review.create(reviews);

    console.log('✅ Data imported successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error importing data:', err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Review.deleteMany();
    await Property.deleteMany();
    await User.deleteMany();
    console.log('✅ Data destroyed successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error destroying data:', err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
