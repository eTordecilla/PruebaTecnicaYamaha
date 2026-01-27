//Es fundamental que tengamos centralizado los tipos para que tanto el esquema de validacion 
// como los servicios hablen el mismo idioma. Aqui definimos la estructura de las entidades del modelo.

export interface Cliente {
  id?: number;
  documento: string;
  nombres: string;
  apellidos: string;
  direccion?: string;
  fecha_nacimiento?: string;
  genero?: string;
  celular: string;
  email: string;
}

export interface Vehiculo {
  id?: number;
  modelo_id: number;
  motor: string;
  cilindraje: number;
  color: string;
  fecha_ensamble: string;
  anio_modelo: number;
}

export interface Venta {
  id?: number;
  fecha: string;
  factura_num: string;
  ciudad: string;
  tienda: string;
  precio: number;
  cliente_id: number;
  vehiculo_id: number;
  vendedor: string;
}

// Tipo para la respuesta de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}