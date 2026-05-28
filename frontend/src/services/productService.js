import api from "./api";

const productService = {
  getAll: async () => {
    try {
      const response = await api.get("/products/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  search: async (query) => {
    try {
      const response = await api.get("/products/search", {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (productData) => {
    try {
      const response = await api.post("/products/", productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productService;
