const Joi = require('joi');

// Sale validation schema
const saleSchema = Joi.object({
  documento: Joi.string().min(7).max(20).required().messages({
    'string.min': 'Cédula debe tener al menos 7 caracteres',
    'string.max': 'Cédula no puede exceder 20 caracteres',
    'any.required': 'Cédula es requerida'
  }),
  nombres: Joi.string().min(2).required().messages({
    'string.min': 'Nombre debe tener al menos 2 caracteres',
    'any.required': 'Nombre es requerido'
  }),
  apellidos: Joi.string().min(2).required().messages({
    'string.min': 'Apellido debe tener al menos 2 caracteres',
    'any.required': 'Apellido es requerido'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email no es válido',
    'any.required': 'Email es requerido'
  }),
  motor: Joi.string().min(5).required().messages({
    'string.min': 'Número de motor debe tener al menos 5 caracteres',
    'any.required': 'Número de motor es requerido'
  }),
  modelo_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Modelo debe ser un número',
    'number.positive': 'Modelo debe ser positivo',
    'any.required': 'Modelo es requerido'
  }),
  factura_num: Joi.string().min(1).required().messages({
    'any.required': 'Número de factura es requerido'
  }),
  precio: Joi.number().positive().required().messages({
    'number.positive': 'Precio debe ser mayor a 0',
    'any.required': 'Precio es requerido'
  }),
  fecha: Joi.date().iso().required().messages({
    'date.format': 'Fecha debe tener formato ISO (YYYY-MM-DD)',
    'any.required': 'Fecha es requerida'
  }),
  ciudad: Joi.string().min(1).required().messages({
    'any.required': 'Ciudad es requerida'
  }),
  tienda: Joi.string().min(1).required().messages({
    'any.required': 'Tienda es requerida'
  }),
  vendedor: Joi.string().min(1).required().messages({
    'any.required': 'Vendedor es requerido'
  }),
  direccion: Joi.string().optional(),
  fecha_nacimiento: Joi.date().iso().optional(),
  genero: Joi.string().optional(),
  celular: Joi.string().min(7).required().messages({
    'string.min': 'Celular debe tener al menos 7 caracteres',
    'any.required': 'Celular es requerido'
  }),
  cilindraje: Joi.number().integer().positive().required().messages({
    'number.positive': 'Cilindraje debe ser positivo',
    'any.required': 'Cilindraje es requerido'
  }),
  color: Joi.string().min(1).required().messages({
    'any.required': 'Color es requerido'
  }),
  fecha_ensamble: Joi.date().iso().required().messages({
    'date.format': 'Fecha de ensamble debe tener formato ISO (YYYY-MM-DD)',
    'any.required': 'Fecha de ensamble es requerida'
  }),
  anio_modelo: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required().messages({
    'number.min': 'Año de modelo no puede ser anterior a 1900',
    'number.max': 'Año de modelo no puede ser futuro',
    'any.required': 'Año de modelo es requerido'
  })
});

// Validation middleware
const validateSale = (req, res, next) => {
  const { error } = saleSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  next();
};

module.exports = { validateSale, saleSchema };
