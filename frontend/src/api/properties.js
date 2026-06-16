import api from './axios';

export const getProperties = (params) => api.get('/properties', { params });
export const getProperty = (id) => api.get(`/properties/${id}`);
export const createProperty = (data) => api.post('/properties', data);
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data);
export const deleteProperty = (id) => api.delete(`/properties/${id}`);
export const getFeaturedProperties = () => api.get('/properties/featured');
export const getPropertyStats = () => api.get('/properties/stats');
export const getMyListings = () => api.get('/properties/my-listings');
export const saveProperty = (id) => api.put(`/properties/${id}/save`);
export const getReviews = (propertyId) => api.get(`/properties/${propertyId}/reviews`);
export const addReview = (propertyId, data) => api.post(`/properties/${propertyId}/reviews`, data);
export const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`);

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');
export const updateDetails = (data) => api.put('/auth/updatedetails', data);
export const updatePassword = (data) => api.put('/auth/updatepassword', data);

export const getSavedProperties = () => api.get('/users/saved');
export const getAgentProfile = (id) => api.get(`/users/${id}`);

export const uploadImage = (formData) => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
