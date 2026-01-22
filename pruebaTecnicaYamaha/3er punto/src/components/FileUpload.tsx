import React, { useState } from 'react';
import { uploadSalesFile } from '../services/apiService';

/*
  Este archivo ressuelve el punto número 3, el mismo 
  se encuentra incluido en la estructura de archivos del punto 2
*/

export const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const response = await uploadSalesFile(file);
    setUploading(false);
    alert(response.success ? "Archivo procesado con éxito" : "Error en el archivo");
  };

  return (
    <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Carga de Historia de Ventas (CSV/Plano)</h3>
      <input 
        type="file" 
        accept=".csv, .txt" 
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {file && (
        <button 
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {uploading ? "Procesando..." : `Subir ${file.name}`}
        </button>
      )}
    </div>
  );
};