import api from "./api";

const orderService = {
  getAll: async () => {
    try {
      const response = await api.get("/orders/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (orderData) => {
    try {
      const response = await api.post("/orders/", orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default orderService;
