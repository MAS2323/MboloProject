// components/menu/api/menuApi.js
import axios from 'axios';
import {API_BASE_URL} from '../../../config/Service.Config';

export const fetchMenuCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories?type=menu`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    throw error;
  }
};

export const fetchSubcategories = async categoryId => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/subcategories/category/${categoryId}`,
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return []; // Retorna array vacío si no hay subcategorías
    }
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};
