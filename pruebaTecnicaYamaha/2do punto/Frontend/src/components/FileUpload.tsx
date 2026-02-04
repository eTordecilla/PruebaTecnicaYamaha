import React, { useState, useCallback } from 'react';
import { uploadSalesFile } from '../services/apiService';

/*
  Este archivo ressuelve el punto número 3
  El archivo con la lógica de procesamiento en sql se encuentra en la carpeta 3er punto
*/

interface FileUploadState {
  file: File | null;
  uploading: boolean;
  error: string | null;
  success: string | null;
  uploadProgress: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['text/csv', 'text/plain', 'application/csv'];

export const FileUpload: React.FC = () => {
  const [state, setState] = useState<FileUploadState>({
    file: null,
    uploading: false,
    error: null,
    success: null,
    uploadProgress: 0
  });

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(csv|txt)$/i)) {
      return 'Solo se permiten archivos CSV o TXT';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'El archivo no puede ser mayor a 10MB';
    }
    
    return null;
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      setState(prev => ({ ...prev, file: null, error: null, success: null }));
      return;
    }

    const validationError = validateFile(selectedFile);
    
    setState(prev => ({
      ...prev,
      file: selectedFile,
      error: validationError,
      success: validationError ? null : prev.success
    }));
  }, [validateFile]);

  const handleUpload = useCallback(async () => {
    if (!state.file || state.error) return;

    setState(prev => ({
      ...prev,
      uploading: true,
      error: null,
      success: null,
      uploadProgress: 0
    }));

    try {
      const response = await uploadSalesFile(state.file, (progress) => {
        setState(prev => ({ ...prev, uploadProgress: progress }));
      });

      if (response.success) {
        const fileName = state.file?.name || 'archivo';
        setState(prev => ({
          ...prev,
          uploading: false,
          success: `Archivo "${fileName}" procesado con éxito. ${response.message || ''}`,
          file: null,
          uploadProgress: 100
        }));
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setState(prev => ({
          ...prev,
          uploading: false,
          error: response.message || 'Error al procesar el archivo',
          uploadProgress: 0
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        uploading: false,
        error: error instanceof Error ? error.message : 'Error desconocido al subir el archivo',
        uploadProgress: 0
      }));
    }
  }, [state.file, state.error]);

  const resetState = useCallback(() => {
    setState({
      file: null,
      uploading: false,
      error: null,
      success: null,
      uploadProgress: 0
    });
  }, []);

  return (
    <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Carga de Historia de Ventas (CSV/Plano)</h3>
      
      {state.success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <p className="font-medium">✓ {state.success}</p>
        </div>
      )}
      
      {state.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-medium">✗ {state.error}</p>
        </div>
      )}
      
      <input 
        type="file" 
        accept=".csv,.txt" 
        onChange={handleFileChange}
        disabled={state.uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
      />
      
      {state.file && !state.error && (
        <div className="mt-4 space-y-3">
          <div className="text-sm text-gray-600">
            <p><strong>Archivo:</strong> {state.file.name}</p>
            <p><strong>Tamaño:</strong> {(state.file.size / 1024).toFixed(2)} KB</p>
          </div>
          
          {state.uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${state.uploadProgress}%` }}
              />
            </div>
          )}
          
          <div className="flex gap-2 justify-center">
            <button 
              onClick={handleUpload}
              disabled={state.uploading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {state.uploading ? `Procesando... ${state.uploadProgress}%` : `Subir ${state.file.name}`}
            </button>
            
            {!state.uploading && (
              <button 
                onClick={resetState}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};