// components/CheckboxEstados.jsx
import React from 'react';

export const CheckboxEstados = ({ estadosSeleccionados, onEstadoChange }) => {
  const opcionesEstados = [
    'Acepto visita',
    'Reagendar Visita',
    'Volver a llamar',
    'Enviar Correo',
    'Cliente Interesado',
    'Fecha de seguimiento',
    'Cotizacion Enviada',
    'Cierre de Venta'
  ];

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Estados de la visita
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {opcionesEstados.map((estado) => (
          <div key={estado} className="flex items-center">
            <input
              type="checkbox"
              id={`estado-${estado}`}
              checked={estadosSeleccionados.includes(estado)}
              onChange={() => onEstadoChange(estado)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={`estado-${estado}`}
              className="ml-2 block text-sm text-gray-700"
            >
              {estado}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};