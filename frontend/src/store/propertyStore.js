import { create } from 'zustand';
import { getProperties, getFeaturedProperties, getPropertyStats, saveProperty as apiSave } from '../api/properties';
import toast from 'react-hot-toast';

const usePropertyStore = create((set, get) => ({
  properties: [],
  featured: [],
  currentProperty: null,
  stats: null,
  loading: false,
  total: 0,
  page: 1,
  filters: {
    listingType: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    search: '',
    sort: '-createdAt'
  },

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters }, page: 1 }),
  resetFilters: () => set({
    filters: { listingType: '', type: '', minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '', city: '', search: '', sort: '-createdAt' },
    page: 1
  }),
  setPage: (page) => set({ page }),

  fetchProperties: async () => {
    set({ loading: true });
    try {
      const { filters, page } = get();
      const params = { page, limit: 12 };
      if (filters.listingType) params.listingType = filters.listingType;
      if (filters.type) params.type = filters.type;
      if (filters.minPrice) params.price = { ...params.price, gte: filters.minPrice };
      if (filters.maxPrice) params.price = { ...params.price, lte: filters.maxPrice };
      if (filters.bedrooms) params['bedrooms[gte]'] = filters.bedrooms;
      if (filters.bathrooms) params['bathrooms[gte]'] = filters.bathrooms;
      if (filters.city) params['address.city'] = filters.city;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await getProperties(params);
      set({ properties: data.data, total: data.total, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchFeatured: async () => {
    try {
      const { data } = await getFeaturedProperties();
      set({ featured: data.data });
    } catch (err) {
      console.error(err);
    }
  },

  fetchStats: async () => {
    try {
      const { data } = await getPropertyStats();
      set({ stats: data.data });
    } catch (err) {
      console.error(err);
    }
  },

  toggleSave: async (id) => {
    try {
      const { data } = await apiSave(id);
      toast.success(data.saved ? 'Property saved! ❤️' : 'Property unsaved');
      return data;
    } catch {
      toast.error('Please login to save properties');
    }
  }
}));

export default usePropertyStore;
