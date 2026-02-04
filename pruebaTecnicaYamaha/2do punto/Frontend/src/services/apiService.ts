import { SalesFormData } from '../schemas/salesSchema';
import { ApiResponse } from '../types';

const API_URL = 'http://localhost:3000/api/v1';

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
export const uploadSalesFile = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();

    // Progress tracking
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      try {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      } catch (error) {
        resolve({ 
          success: false, 
          message: "Error al procesar la respuesta del servidor" 
        });
      }
    });

    xhr.addEventListener('error', () => {
      resolve({ 
        success: false, 
        message: "Error de conexión al subir el archivo" 
      });
    });

    xhr.addEventListener('timeout', () => {
      resolve({ 
        success: false, 
        message: "Tiempo de espera agotado al subir el archivo" 
      });
    });

    xhr.timeout = 30000; // 30 segundos
    xhr.open('POST', `${API_URL}/ventas/batch`);
    xhr.send(formData);
  });
};