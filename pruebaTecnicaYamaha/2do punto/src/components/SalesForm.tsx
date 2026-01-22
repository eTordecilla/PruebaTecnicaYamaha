import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { salesSchema, SalesFormData } from '../schemas/salesSchema';
import { saveSale } from '../services/apiService';

//utilizaremos TailwindCSS para el diseño y React Hook Form para el manejo del estado del formulario.

export const SalesForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SalesFormData>({
    resolver: zodResolver(salesSchema)
  });

  const onSubmit = async (data: SalesFormData) => {
    try {
      await saveSale(data);
      alert("Venta registrada exitosamente");
    } catch (error) {
      console.error("Error al guardar", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Registro de Venta - Yamaha</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sección Cliente */}
        <div className="col-span-1 md:col-span-2 text-blue-600 font-semibold">Datos del Cliente</div>
        
        <div>
          <label className="block text-sm font-medium">Cédula</label>
          <input {...register("documento")} className={`w-full p-2 border rounded ${errors.documento ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.documento && <p className="text-red-500 text-xs mt-1">{errors.documento.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input {...register("email")} className="w-full p-2 border border-gray-300 rounded" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Sección Venta */}
        <div className="col-span-1 md:col-span-2 text-blue-600 font-semibold mt-4">Datos de la Transacción</div>

        <div>
          <label className="block text-sm font-medium">Número de Factura</label>
          <input {...register("factura_num")} className="w-full p-2 border border-gray-300 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Precio</label>
          <input type="number" {...register("precio", { valueAsNumber: true })} className="w-full p-2 border border-gray-300 rounded" />
        </div>

        <button type="submit" className="col-span-1 md:col-span-2 mt-6 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-transition duration-300">
          Registrar Venta
        </button>
      </form>
    </div>
  );
};