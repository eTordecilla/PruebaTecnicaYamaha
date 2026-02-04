import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { salesSchema, SalesFormData } from '../schemas/salesSchema';
import { saveSale } from '../services/apiService';

interface FormState {
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
}

//utilizaremos TailwindCSS para el diseño y React Hook Form para el manejo del estado del formulario.

export const SalesForm = () => {
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    error: null,
    success: null
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isDirty },
    reset,
    trigger
  } = useForm<SalesFormData>({
    resolver: zodResolver(salesSchema),
    mode: 'onChange'
  });

  const onSubmit = useCallback(async (data: SalesFormData) => {
    setFormState({ isSubmitting: true, error: null, success: null });

    try {
      const response = await saveSale(data);
      
      if (response.success) {
        setFormState({ 
          isSubmitting: false, 
          error: null, 
          success: 'Venta registrada exitosamente' 
        });
        reset();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setFormState(prev => ({ ...prev, success: null }));
        }, 5000);
      } else {
        setFormState({ 
          isSubmitting: false, 
          error: response.message || 'Error al registrar la venta',
          success: null 
        });
      }
    } catch (error) {
      setFormState({ 
        isSubmitting: false, 
        error: error instanceof Error ? error.message : 'Error desconocido al guardar',
        success: null 
      });
    }
  }, [reset]);

  const clearNotifications = useCallback(() => {
    setFormState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Registro de Venta - Yamaha</h2>
      
      {/* Notifications */}
      {formState.success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl mr-2">✓</span>
            <span className="font-medium">{formState.success}</span>
          </div>
          <button 
            onClick={clearNotifications}
            className="text-green-700 hover:text-green-900 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}
      
      {formState.error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl mr-2">✗</span>
            <span className="font-medium">{formState.error}</span>
          </div>
          <button 
            onClick={clearNotifications}
            className="text-red-700 hover:text-red-900 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sección Cliente */}
        <div className="col-span-1 md:col-span-2 text-blue-600 font-semibold text-lg border-b border-blue-200 pb-2 mb-4">
          Datos del Cliente
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cédula <span className="text-red-500">*</span>
          </label>
          <input 
            {...register("documento")} 
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.documento ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: 12345678"
          />
          {errors.documento && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.documento.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombres <span className="text-red-500">*</span>
          </label>
          <input 
            {...register("nombres")} 
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.nombres ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: Juan Carlos"
          />
          {errors.nombres && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.nombres.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellidos <span className="text-red-500">*</span>
          </label>
          <input 
            {...register("apellidos")} 
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.apellidos ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: Pérez González"
          />
          {errors.apellidos && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.apellidos.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input 
            type="email"
            {...register("email")} 
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: juan@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Sección Vehículo */}
        <div className="col-span-1 md:col-span-2 text-blue-600 font-semibold text-lg border-b border-blue-200 pb-2 mb-4 mt-4">
          Datos del Vehículo
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Motor <span className="text-red-500">*</span>
          </label>
          <input 
            {...register("motor")} 
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.motor ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: MT071234567"
          />
          {errors.motor && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.motor.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo <span className="text-red-500">*</span>
          </label>
          <select 
            {...register("modelo_id", { valueAsNumber: true })} 
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.modelo_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione un modelo</option>
            <option value="1">MT-07</option>
            <option value="2">YZF-R3</option>
            <option value="3">Ténéré 700</option>
            <option value="4">NMAX</option>
          </select>
          {errors.modelo_id && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.modelo_id.message}
            </p>
          )}
        </div>

        {/* Sección Venta */}
        <div className="col-span-1 md:col-span-2 text-blue-600 font-semibold text-lg border-b border-blue-200 pb-2 mb-4 mt-4">
          Datos de la Transacción
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Factura <span className="text-red-500">*</span>
          </label>
          <input 
            {...register("factura_num")} 
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.factura_num ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: F001-2023"
          />
          {errors.factura_num && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.factura_num.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio <span className="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            step="0.01"
            {...register("precio", { valueAsNumber: true })} 
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.precio ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: 8500000"
          />
          {errors.precio && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.precio.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha <span className="text-red-500">*</span>
          </label>
          <input 
            type="date"
            {...register("fecha")} 
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.fecha ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.fecha && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.fecha.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad <span className="text-red-500">*</span>
          </label>
          <input 
            {...register("ciudad")} 
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.ciudad ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: Bogotá"
          />
          {errors.ciudad && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.ciudad.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tienda <span className="text-red-500">*</span>
          </label>
          <input 
            {...register("tienda")} 
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.tienda ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: Yamaha Centro"
          />
          {errors.tienda && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.tienda.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendedor <span className="text-red-500">*</span>
          </label>
          <input 
            {...register("vendedor")} 
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.vendedor ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: Carlos Rodríguez"
          />
          {errors.vendedor && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.vendedor.message}
            </p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 mt-6 flex gap-3">
          <button 
            type="submit" 
            disabled={formState.isSubmitting || !isValid || !isDirty}
            className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-md transition duration-300 flex items-center justify-center"
          >
            {formState.isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando Venta...
              </>
            ) : (
              'Registrar Venta'
            )}
          </button>
          
          <button 
            type="button"
            onClick={() => reset()}
            disabled={formState.isSubmitting}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-md transition duration-300"
          >
            Limpiar Formulario
          </button>
        </div>
      </form>
    </div>
  );
};