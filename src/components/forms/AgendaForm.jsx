// forms/AgendaForm.jsx
import React, { useState, useEffect } from 'react';
import { CheckboxEstados } from '../Atomos/CheckBoxes';

export const FormularioAgenda = ({ onSubmit, onCancel, empresaExistente }) => {
  const [formData, setFormData] = useState({
    nombreEmpresa: '',
    contactoEmpresa: '',
    telefonoEmpresa: '',
    correoEmpresa: '',
    dedicacionEmpresa: '',
    sistemaManjado: '',
    tamañoEmpresa: '',
    desafiosEmpresa: '',
    puntosCriticos: '',
    objetivosEmpresa: '',
    comportamientoCompra: '',
    visita: '',
    importanciaVisita: '',
    proximaVisita: '',
    estado: []
  });

  const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);

  useEffect(() => {
    if (empresaExistente) {
      setFormData({
        ...empresaExistente,
        visita: empresaExistente.visita ? new Date(empresaExistente.visita).toISOString().split('T')[0] : '',
        proximaVisita: empresaExistente.proximaVisita ? new Date(empresaExistente.proximaVisita).toISOString().split('T')[0] : ''
      });
      
      // Si el estado existente es un string, convertirlo a array
      if (typeof empresaExistente.estado === 'string') {
        setEstadosSeleccionados([empresaExistente.estado]);
      } else if (Array.isArray(empresaExistente.estado)) {
        setEstadosSeleccionados(empresaExistente.estado);
      }
    }
  }, [empresaExistente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEstadoChange = (estado) => {
    const nuevosEstados = estadosSeleccionados.includes(estado)
      ? estadosSeleccionados.filter(e => e !== estado)
      : [...estadosSeleccionados, estado];
    
    setEstadosSeleccionados(nuevosEstados);
    setFormData(prev => ({
      ...prev,
      estado: nuevosEstados
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      estado: estadosSeleccionados
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {empresaExistente ? 'Editar Empresa' : 'Nueva Empresa'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de la empresa *
                </label>
                <input
                  type="text"
                  name="nombreEmpresa"
                  value={formData.nombreEmpresa}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contacto *
                </label>
                <input
                  type="text"
                  name="contactoEmpresa"
                  value={formData.contactoEmpresa}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono *
                </label>
                <input
                  type="text"
                  name="telefonoEmpresa"
                  value={formData.telefonoEmpresa}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  name="correoEmpresa"
                  value={formData.correoEmpresa}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dedicación de la empresa *
                </label>
                <input
                  type="text"
                  name="dedicacionEmpresa"
                  value={formData.dedicacionEmpresa}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sistema manejado *
                </label>
                <input
                  type="text"
                  name="sistemaManjado"
                  value={formData.sistemaManjado}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tamaño de la empresa *
                </label>
                <select
                  name="tamañoEmpresa"
                  value={formData.tamañoEmpresa}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Seleccionar tamaño</option>
                  <option value="Pequeña">Pequeña</option>
                  <option value="Mediana">Mediana</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Desafíos de la empresa *
                </label>
                <textarea
                  name="desafiosEmpresa"
                  value={formData.desafiosEmpresa}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Puntos críticos *
                </label>
                <textarea
                  name="puntosCriticos"
                  value={formData.puntosCriticos}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Objetivos de la empresa *
                </label>
                <textarea
                  name="objetivosEmpresa"
                  value={formData.objetivosEmpresa}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comportamiento de compra *
                </label>
                <textarea
                  name="comportamientoCompra"
                  value={formData.comportamientoCompra}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de visita *
                </label>
                <input
                  type="date"
                  name="visita"
                  value={formData.visita}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Importancia de la visita *
                </label>
                <select
                  name="importanciaVisita"
                  value={formData.importanciaVisita}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Seleccionar importancia</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Próxima visita (opcional)
                </label>
                <input
                  type="date"
                  name="proximaVisita"
                  value={formData.proximaVisita}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            {/* Componente de checkboxes para estados */}
            <CheckboxEstados 
              estadosSeleccionados={estadosSeleccionados}
              onEstadoChange={handleEstadoChange}
            />

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
              >
                {empresaExistente ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};