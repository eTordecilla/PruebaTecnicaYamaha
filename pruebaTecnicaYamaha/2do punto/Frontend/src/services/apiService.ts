import { SalesFormData } from '../schemas/salesSchema';
import { ApiResponse } from '../types';

const API_URL = 'https://api.tu-dominio-yamaha.com/v1';

/**
 * Envía los datos del formulario de venta al servidor
 */
export const saveSale = async (payload: SalesFormData): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_URL}/ventas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` <- Si usáramos JWT
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al procesar la venta');
    }

    return await response.json();
  } catch (error) {
    console.error("API Service Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido"
    };
  }
};

/**
 * Servicio para cargar el archivo plano (Punto 3 del requerimiento)
 */
export const uploadSalesFile = async (file: File): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/ventas/batch`, {
      method: 'POST',
      body: formData, // El navegador configura el Content-Type a multipart/form-data
    });

    return await response.json();
  } catch (error) {
    return { success: false, message: "Error al subir el archivo" };
  }
};