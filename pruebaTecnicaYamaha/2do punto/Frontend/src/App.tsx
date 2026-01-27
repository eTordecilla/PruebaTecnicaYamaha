// src/App.tsx
import { SalesForm } from './components/SalesForm';
import { FileUpload } from './components/FileUpload';

function App() {
  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Sistema de Fidelización Yamaha
        </h1>
        
        {/* Renderizamos el formulario de venta */}
        <section>
          <SalesForm />
        </section>

        {/* Renderizamos la carga de archivos */}
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <FileUpload />
        </section>
      </div>
    </div>
  );
}

export default App;