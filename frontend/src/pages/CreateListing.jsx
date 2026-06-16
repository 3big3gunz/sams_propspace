import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusCircle, X, Upload, Home, MapPin, DollarSign, Info, CheckSquare, Image } from 'lucide-react';
import { createProperty, updateProperty, getProperty } from '../api/properties';
import toast from 'react-hot-toast';
import './CreateListing.css';

const AMENITY_OPTIONS = [
  { value: 'pool', label: '🏊 Pool' },
  { value: 'gym', label: '🏋️ Gym' },
  { value: 'parking', label: '🚗 Parking' },
  { value: 'elevator', label: '🛗 Elevator' },
  { value: 'security', label: '🔒 Security' },
  { value: 'garden', label: '🌿 Garden' },
  { value: 'balcony', label: '🏙️ Balcony' },
  { value: 'fireplace', label: '🔥 Fireplace' },
  { value: 'laundry', label: '🫧 Laundry' },
  { value: 'storage', label: '📦 Storage' },
  { value: 'pet_friendly', label: '🐾 Pet Friendly' },
  { value: 'furnished', label: '🛋️ Furnished' },
  { value: 'air_conditioning', label: '❄️ A/C' },
  { value: 'heating', label: '🌡️ Heating' },
  { value: 'internet', label: '📶 Internet' },
  { value: 'alarm_system', label: '🚨 Alarm' },
];

const STEPS = ['Basic Info', 'Location', 'Details', 'Amenities', 'Images', 'Review'];

const defaultForm = {
  title: '', description: '', type: 'house', listingType: 'sale',
  price: '', priceUnit: 'total', status: 'active', featured: false,
  address: { street: '', city: '', state: '', zipCode: '', country: 'United States' },
  size: '', bedrooms: '', bathrooms: '', garage: '', yearBuilt: '',
  amenities: [],
  images: [{ url: '', caption: '' }],
};

export default function CreateListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getProperty(id).then(({ data }) => {
        const p = data.data;
        setForm({
          ...defaultForm, ...p,
          address: p.address || defaultForm.address,
          images: p.images?.length ? p.images : defaultForm.images,
          amenities: p.amenities || [],
        });
        setLoading(false);
      }).catch(() => navigate('/dashboard'));
    }
  }, [id]);

  const update = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const updateAddr = (key, val) => setForm(p => ({ ...p, address: { ...p.address, [key]: val } }));
  const updateImg = (i, key, val) => {
    const imgs = [...form.images];
    imgs[i] = { ...imgs[i], [key]: val };
    setForm(p => ({ ...p, images: imgs }));
  };
  const addImage = () => setForm(p => ({ ...p, images: [...p.images, { url: '', caption: '' }] }));
  const removeImage = (i) => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));
  const toggleAmenity = (a) => {
    setForm(p => ({
      ...p,
      amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a]
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        size: Number(form.size),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        garage: Number(form.garage) || 0,
        yearBuilt: Number(form.yearBuilt) || undefined,
        images: form.images.filter(img => img.url.trim()),
      };
      if (isEdit) {
        await updateProperty(id, payload);
        toast.success('Listing updated!');
      } else {
        await createProperty(payload);
        toast.success('Listing created! 🎉');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save listing');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="page-loader" style={{ paddingTop: 'var(--header-height)' }}><div className="spinner" /></div>;

  return (
    <div className="create-listing-page">
      <div className="container">
        <div className="cl-header">
          <h1 className="cl-title">{isEdit ? 'Edit Listing' : 'Create New Listing'}</h1>
          <p className="cl-subtitle">Fill in the details to {isEdit ? 'update your' : 'publish a new'} property listing.</p>
        </div>

        {/* Steps */}
        <div className="cl-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`cl-step ${i === step ? 'active' : i < step ? 'done' : ''}`} onClick={() => i < step && setStep(i)}>
              <div className="cl-step-num">{i < step ? '✓' : i + 1}</div>
              <span className="cl-step-label">{s}</span>
            </div>
          ))}
        </div>

        <div className="cl-card">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="cl-step-panel">
              <div className="cl-step-header"><Home size={20} /><h2>Basic Information</h2></div>
              <div className="form-group">
                <label className="form-label">Property Title *</label>
                <input className="form-control" placeholder="e.g. Stunning Modern Villa with Ocean Views"
                  value={form.title} onChange={e => update('title', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-control" rows={6}
                  placeholder="Describe the property in detail..."
                  value={form.description} onChange={e => update('description', e.target.value)} required />
              </div>
              <div className="cl-grid-3">
                <div className="form-group">
                  <label className="form-label">Property Type *</label>
                  <select className="form-control form-select" value={form.type} onChange={e => update('type', e.target.value)}>
                    {['house','apartment','condo','townhouse','villa','studio','land','commercial'].map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Listing Type *</label>
                  <select className="form-control form-select" value={form.listingType} onChange={e => update('listingType', e.target.value)}>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="lease">Lease</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control form-select" value={form.status} onChange={e => update('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="cl-checkbox-row">
                <label className="cl-checkbox">
                  <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} />
                  <span>⭐ Mark as Featured Property</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="cl-step-panel">
              <div className="cl-step-header"><MapPin size={20} /><h2>Location</h2></div>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input className="form-control" placeholder="123 Main Street"
                  value={form.address.street} onChange={e => updateAddr('street', e.target.value)} />
              </div>
              <div className="cl-grid-2">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input className="form-control" placeholder="Los Angeles"
                    value={form.address.city} onChange={e => updateAddr('city', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input className="form-control" placeholder="CA"
                    value={form.address.state} onChange={e => updateAddr('state', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP Code *</label>
                  <input className="form-control" placeholder="90001"
                    value={form.address.zipCode} onChange={e => updateAddr('zipCode', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input className="form-control" value={form.address.country}
                    onChange={e => updateAddr('country', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="cl-step-panel">
              <div className="cl-step-header"><DollarSign size={20} /><h2>Price & Details</h2></div>
              <div className="cl-grid-2">
                <div className="form-group">
                  <label className="form-label">Price *</label>
                  <input type="number" className="form-control" placeholder="500000"
                    value={form.price} onChange={e => update('price', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price Unit</label>
                  <select className="form-control form-select" value={form.priceUnit} onChange={e => update('priceUnit', e.target.value)}>
                    <option value="total">Total Price</option>
                    <option value="per_month">Per Month</option>
                    <option value="per_year">Per Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Size (sqft) *</label>
                  <input type="number" className="form-control" placeholder="1500"
                    value={form.size} onChange={e => update('size', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Year Built</label>
                  <input type="number" className="form-control" placeholder="2020"
                    value={form.yearBuilt} onChange={e => update('yearBuilt', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bedrooms</label>
                  <input type="number" className="form-control" min="0" placeholder="3"
                    value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bathrooms</label>
                  <input type="number" className="form-control" min="0" placeholder="2"
                    value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Garage Spaces</label>
                  <input type="number" className="form-control" min="0" placeholder="1"
                    value={form.garage} onChange={e => update('garage', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Amenities */}
          {step === 3 && (
            <div className="cl-step-panel">
              <div className="cl-step-header"><CheckSquare size={20} /><h2>Amenities</h2></div>
              <p className="cl-hint">Select all amenities available in this property.</p>
              <div className="amenities-picker">
                {AMENITY_OPTIONS.map(({ value, label }) => (
                  <button key={value} type="button"
                    className={`amenity-pick-btn ${form.amenities.includes(value) ? 'active' : ''}`}
                    onClick={() => toggleAmenity(value)}>
                    {form.amenities.includes(value) && <span className="amenity-check-mark">✓ </span>}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Images */}
          {step === 4 && (
            <div className="cl-step-panel">
              <div className="cl-step-header"><Image size={20} /><h2>Property Images</h2></div>
              <p className="cl-hint">Add image URLs for your property. The first image will be the cover photo.</p>
              <div className="images-list">
                {form.images.map((img, i) => (
                  <div key={i} className="image-input-row">
                    <div className="image-preview-sm">
                      {img.url ? <img src={img.url} alt={`img ${i}`} onError={e => e.target.style.display='none'} /> : <Upload size={20} />}
                    </div>
                    <div className="image-inputs">
                      <input className="form-control" placeholder="https://images.unsplash.com/..."
                        value={img.url} onChange={e => updateImg(i, 'url', e.target.value)} />
                      <input className="form-control" placeholder="Caption (optional)"
                        value={img.caption} onChange={e => updateImg(i, 'caption', e.target.value)} />
                    </div>
                    {form.images.length > 1 && (
                      <button className="remove-img-btn" onClick={() => removeImage(i)} type="button"><X size={16} /></button>
                    )}
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-sm" type="button" onClick={addImage}>
                <PlusCircle size={15} /> Add Another Image
              </button>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="cl-step-panel">
              <div className="cl-step-header"><Info size={20} /><h2>Review & Publish</h2></div>
              <div className="review-grid">
                <div className="review-item"><span>Title</span><strong>{form.title || '–'}</strong></div>
                <div className="review-item"><span>Type</span><strong>{form.type} / {form.listingType}</strong></div>
                <div className="review-item"><span>Price</span><strong>${Number(form.price).toLocaleString()}{form.priceUnit !== 'total' ? `/${form.priceUnit.replace('per_','')}` : ''}</strong></div>
                <div className="review-item"><span>Location</span><strong>{form.address.city}, {form.address.state}</strong></div>
                <div className="review-item"><span>Size</span><strong>{form.size} sqft</strong></div>
                <div className="review-item"><span>Beds / Baths</span><strong>{form.bedrooms} / {form.bathrooms}</strong></div>
                <div className="review-item"><span>Amenities</span><strong>{form.amenities.length}</strong></div>
                <div className="review-item"><span>Images</span><strong>{form.images.filter(i=>i.url).length}</strong></div>
                <div className="review-item"><span>Featured</span><strong>{form.featured ? 'Yes ⭐' : 'No'}</strong></div>
                <div className="review-item"><span>Status</span><strong style={{textTransform:'capitalize'}}>{form.status}</strong></div>
              </div>
              {form.images[0]?.url && (
                <div className="review-preview-img">
                  <img src={form.images[0].url} alt="preview" />
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="cl-nav-btns">
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)} disabled={step === 0}>← Back</button>
            <div className="cl-progress">Step {step + 1} of {STEPS.length}</div>
            {step < STEPS.length - 1
              ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Next →</button>
              : <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Publishing...' : isEdit ? '✓ Save Changes' : '🚀 Publish Listing'}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
