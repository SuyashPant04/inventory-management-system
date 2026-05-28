import api from "./api";

const customerService = {
  getAll: async () => {
    try {
      const response = await api.get("/customers/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (customerData) => {
    try {
      const response = await api.post("/customers/", customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default customerService;
