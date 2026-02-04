import { z } from 'zod';

// Aquí usamos Zod para definir las reglas de negocio de los campos

export const salesSchema = z.object({
  // Datos del Cliente
  documento: z.string().min(7, "Cédula inválida").max(20),
  nombres: z.string().min(2, "Nombre requerido"),
  apellidos: z.string().min(2, "Apellido requerido"),
  email: z.string().email("Email no válido"),
  
  // Datos del Vehículo
  motor: z.string().min(5, "Número de motor requerido"),
  modelo_id: z.string().min(1, "Seleccione un modelo"),
  
  // Datos de la Venta
  factura_num: z.string().min(1, "Número de factura requerido"),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  fecha: z.string().refine((val) => !isNaN(Date.parse(val)), "Fecha inválida"),
  
  // Campos adicionales para el backend
  ciudad: z.string().min(1, "Ciudad requerida"),
  tienda: z.string().min(1, "Tienda requerida"),
  vendedor: z.string().min(1, "Vendedor requerido"),
  
  // Campos opcionales
  direccion: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  genero: z.string().optional(),
  celular: z.string().optional(),
  cilindraje: z.number().optional(),
  color: z.string().optional(),
  fecha_ensamble: z.string().optional(),
  anio_modelo: z.number().optional()
});

// Inferencia automática del tipo de datos
export type SalesFormData = z.infer<typeof salesSchema>;