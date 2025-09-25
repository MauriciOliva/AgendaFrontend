import React, { useState, useEffect } from 'react';
import { FormularioAgenda } from '../forms/AgendaForm';
import { useAgendaStore } from '../../hooks/HookAgenda';
import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from '../Atomos/ErrorBoundary';
import { Notificaciones } from '../Atomos/Notifier';
import { HistorialNotificaciones } from '../Atomos/Historial';
import { ExcelGenerator } from '../Atomos/GeneradorExcel';

export const AgendaList = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const {
    agenda,
    isLoading,
    error,
    getAgendas,
    createAgenda,
    updateAgenda,
    deleteAgenda
  } = useAgendaStore();

  useEffect(() => {
    getAgendas();
  }, []);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const handleGuardarEmpresa = async (datosEmpresa) => {
    try {
      if (empresaEditando) {
        await updateAgenda(empresaEditando._id, datosEmpresa);
      } else {
        await createAgenda(datosEmpresa);
      }
      setMostrarFormulario(false);
      setEmpresaEditando(null);
    } catch (error) {
      console.error('Error al guardar empresa:', error);
    }
  };

  const handleEliminarEmpresa = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta empresa?')) {
      try {
        await deleteAgenda(id);
      } catch (error) {
        console.error('Error al eliminar empresa:', error);
      }
    }
  };

  const empresasFiltradas = agenda.filter(empresa =>
    empresa.nombreEmpresa?.toLowerCase().includes(filtro.toLowerCase()) ||
    empresa.contactoEmpresa?.toLowerCase().includes(filtro.toLowerCase()) ||
    empresa.tamañoEmpresa?.toLowerCase().includes(filtro.toLowerCase())
  );

  const formatFecha = (fecha) => {
    if (!fecha) return 'No programada';
    return new Date(fecha).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getColorImportancia = (importancia) => {
    switch (importancia) {
      case 'Alta': return 'bg-red-100 text-red-700 border border-red-300';
      case 'Media': return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'Baja': return 'bg-green-100 text-green-700 border border-green-300';
      default: return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  const getColorTamaño = (tamaño) => {
    switch (tamaño) {
      case 'Grande': return 'bg-purple-100 text-purple-700 border border-purple-300';
      case 'Mediana': return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'Pequeña': return 'bg-green-100 text-green-700 border border-green-300';
      default: return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Cargando empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6">
        <Notificaciones agendas={agenda} />
        <HistorialNotificaciones
          isOpen={mostrarHistorial}
          onClose={() => setMostrarHistorial(false)}
        />

        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-calendar-days text-blue-600"></i>
                  Agenda de Empresas
                </h1>
                <p className="text-gray-500">Gestión de visitas y seguimiento empresarial</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:scale-105 text-white px-4 py-2 rounded-lg font-medium shadow transition"
                  onClick={() => setMostrarHistorial(true)}
                >
                  <i className="fas fa-history mr-2"></i> Historial
                </button>
                <ExcelGenerator empresas={agenda} />
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 text-white px-4 py-2 rounded-lg font-medium shadow transition"
                  onClick={() => setMostrarFormulario(true)}
                >
                  <i className="fas fa-plus mr-2"></i> Nueva Empresa
                </button>
              </div>
            </div>
          </div>

          {/* Buscador y estadísticas */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <label htmlFor="buscar" className="block text-sm font-medium text-gray-600 mb-2">
                Buscar empresa
              </label>
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  id="buscar"
                  placeholder="Buscar por nombre, contacto o tamaño..."
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
                {filtro && (
                  <button
                    onClick={() => setFiltro('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-md p-6 text-white border border-blue-400 text-center">
              <i className="fas fa-building text-3xl mb-2"></i>
              <h3 className="text-2xl font-bold">{agenda.length}</h3>
              <p className="text-blue-100">Empresas en agenda</p>
            </div>
          </div>

          {/* Lista de empresas */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tamaño</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Última Visita</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Próxima Visita</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Importancia</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estados</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {empresasFiltradas.map((empresa) => (
                    <motion.tr
                      key={empresa._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="group hover:bg-blue-50 transition cursor-pointer"
                      onClick={() => setEmpresaSeleccionada(empresa)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {empresa.nombreEmpresa?.charAt(0) || <i className="fas fa-building"></i>}
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">{empresa.nombreEmpresa}</p>
                            <p className="text-xs text-gray-500">{empresa.dedicacionEmpresa}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{empresa.contactoEmpresa}</p>
                        <p className="text-xs text-gray-500">{empresa.telefonoEmpresa}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getColorTamaño(empresa.tamañoEmpresa)}`}>
                          {empresa.tamañoEmpresa}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{formatFecha(empresa.visita)}</td>
                      <td className="px-6 py-4 text-sm">{formatFecha(empresa.proximaVisita)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getColorImportancia(empresa.importanciaVisita)}`}>
                          {empresa.importanciaVisita}
                        </span>
                      </td>
                      <td className="px-6 py-4">
  <div className="flex flex-col items-center justify-center gap-1.5 min-h-[60px]">
    {empresa.estado && empresa.estado.length > 0 ? (
      <div className="flex flex-col gap-1 w-full max-w-[180px] mx-auto">
        {empresa.estado.map((estado, index) => {
          // Asignar colores según el tipo de estado
          let bgColor = "bg-gray-100";
          let textColor = "text-gray-800";
          let borderColor = "border-gray-200";
          let icon = "fas fa-tag";
          
          if (estado.includes("Interesado") || estado.includes("interesado")) {
            bgColor = "bg-green-50";
            textColor = "text-green-700";
            borderColor = "border-green-200";
            icon = "fas fa-thumbs-up";
          } else if (estado.includes("llamar") || estado.includes("Llamar")) {
            bgColor = "bg-blue-50";
            textColor = "text-blue-700";
            borderColor = "border-blue-200";
            icon = "fas fa-phone";
          } else if (estado.includes("visita") || estado.includes("Visita")) {
            bgColor = "bg-purple-50";
            textColor = "text-purple-700";
            borderColor = "border-purple-200";
            icon = "fas fa-calendar-check";
          } else if (estado.includes("Cotización") || estado.includes("cotización")) {
            bgColor = "bg-yellow-50";
            textColor = "text-yellow-700";
            borderColor = "border-yellow-200";
            icon = "fas fa-file-invoice-dollar";
          } else if (estado.includes("Reagendar") || estado.includes("reagendar")) {
            bgColor = "bg-orange-50";
            textColor = "text-orange-700";
            borderColor = "border-orange-200";
            icon = "fas fa-calendar-plus";
          } else if (estado.includes("Correo") || estado.includes("correo")) {
            bgColor = "bg-indigo-50";
            textColor = "text-indigo-700";
            borderColor = "border-indigo-200";
            icon = "fas fa-envelope";
          } else if (estado.includes("seguimiento") || estado.includes("Seguimiento")) {
            bgColor = "bg-cyan-50";
            textColor = "text-cyan-700";
            borderColor = "border-cyan-200";
            icon = "fas fa-clock";
          } else if (estado.includes("Cierre") || estado.includes("cierre")) {
            bgColor = "bg-teal-50";
            textColor = "text-teal-700";
            borderColor = "border-teal-200";
            icon = "fas fa-handshake";
          } else if (estado.includes("Rechazado") || estado.includes("rechazado")) {
            bgColor = "bg-red-50";
            textColor = "text-red-700";
            borderColor = "border-red-200";
            icon = "fas fa-times-circle";
          } else if (estado.includes("Eliminar")) {
            bgColor = "bg-red-100";
            textColor = "text-red-800";
            borderColor = "border-red-300";
            icon = "fas fa-trash";
          }
          
          return (
            <div key={index} className="flex justify-center">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border ${borderColor} shadow-sm w-full justify-center`}
                title={estado}
              >
                <i className={`${icon} text-xs`}></i>
                <span className="truncate">{estado}</span>
              </span>
            </div>
          );
        })}
      </div>
    ) : (
      <span className="text-gray-400 text-xs italic">Sin estados</span>
    )}
  </div>
</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={e => {
                              e.stopPropagation();
                              setEmpresaEditando(empresa);
                              setMostrarFormulario(true);
                            }}
                          >
                            <i className="fas fa-edit">Editar</i>
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 placeholder-neutral-50"
                            onClick={e => {
                              e.stopPropagation();
                              handleEliminarEmpresa(empresa._id);
                            }}
                          >
                            <i className="fas fa-trash">Eliminar</i>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Formulario */}
          {mostrarFormulario && (
            <FormularioAgenda
              onSubmit={handleGuardarEmpresa}
              onCancel={() => {
                setMostrarFormulario(false);
                setEmpresaEditando(null);
              }}
              empresaExistente={empresaEditando}
            />
          )}

          {/* Modal Detalles */}
          <AnimatePresence>
            {empresaSeleccionada && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <i className="fas fa-building text-blue-600"></i>
                      {empresaSeleccionada.nombreEmpresa}
                    </h2>
                    <button
                      onClick={() => setEmpresaSeleccionada(null)}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <p><strong>📞 Contacto:</strong> {empresaSeleccionada.contactoEmpresa}</p>
                      <p><strong>Tel:</strong> {empresaSeleccionada.telefonoEmpresa}</p>
                      <p><strong>Email:</strong> {empresaSeleccionada.correoEmpresa}</p>
                      <p><strong>💻 Sistema:</strong> {empresaSeleccionada.sistemaManjado}</p>
                    </div>
                    <div className="space-y-3">
                      <p><strong>⚡ Desafíos:</strong> {empresaSeleccionada.desafiosEmpresa}</p>
                      <p><strong>❗ Puntos críticos:</strong> {empresaSeleccionada.puntosCriticos}</p>
                      <p><strong>🎯 Objetivos:</strong> {empresaSeleccionada.objetivosEmpresa}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div><strong>Última visita:</strong> {formatFecha(empresaSeleccionada.visita)}</div>
                    <div><strong>Próxima visita:</strong> {formatFecha(empresaSeleccionada.proximaVisita)}</div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      onClick={() => setEmpresaSeleccionada(null)}
                    >
                      Cerrar
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                      onClick={() => {
                        setEmpresaSeleccionada(null);
                        setEmpresaEditando(empresaSeleccionada);
                        setMostrarFormulario(true);
                      }}
                    >
                      Editar
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  );
};
