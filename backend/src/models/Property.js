const mongoose = require('mongoose');
const slugify = require('slugify');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify property type'],
    enum: ['house', 'apartment', 'condo', 'townhouse', 'villa', 'studio', 'land', 'commercial']
  },
  listingType: {
    type: String,
    required: [true, 'Please specify listing type'],
    enum: ['sale', 'rent', 'lease']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  priceUnit: {
    type: String,
    enum: ['total', 'per_month', 'per_year'],
    default: 'total'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'sold', 'rented', 'inactive'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  address: {
    street: { type: String, required: [true, 'Please add a street address'] },
    city: { type: String, required: [true, 'Please add a city'] },
    state: { type: String, required: [true, 'Please add a state'] },
    zipCode: { type: String, required: [true, 'Please add a zip code'] },
    country: { type: String, default: 'United States' }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
      default: [0, 0]
    }
  },
  size: {
    type: Number,
    required: [true, 'Please add property size in sqft']
  },
  bedrooms: {
    type: Number,
    default: 0
  },
  bathrooms: {
    type: Number,
    default: 0
  },
  garage: {
    type: Number,
    default: 0
  },
  yearBuilt: {
    type: Number
  },
  images: [{
    url: { type: String, required: true },
    public_id: { type: String },
    caption: { type: String, default: '' }
  }],
  amenities: [{
    type: String,
    enum: [
      'pool', 'gym', 'parking', 'elevator', 'security', 'garden',
      'balcony', 'terrace', 'fireplace', 'laundry', 'storage',
      'pet_friendly', 'furnished', 'air_conditioning', 'heating',
      'internet', 'cable', 'dishwasher', 'microwave', 'alarm_system'
    ]
  }],
  views: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews
PropertySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'property',
  justOne: false
});

// Create property slug from title
PropertySchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Geocode and create location field
PropertySchema.pre('save', async function (next) {
  // Simplified: in production, use a geocoding API like Mapbox or Google Maps
  next();
});

// Static method to get average rating
PropertySchema.statics.getAverageRating = async function (propertyId) {
  const obj = await this.model('Review').aggregate([
    { $match: { property: propertyId } },
    { $group: { _id: '$property', averageRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  try {
    await this.model('Property').findByIdAndUpdate(propertyId, {
      averageRating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0,
      reviewCount: obj[0] ? obj[0].count : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Index for text search
PropertySchema.index({ title: 'text', description: 'text', 'address.city': 'text' });

module.exports = mongoose.model('Property', PropertySchema);
