// components/HistorialNotificaciones.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export  const HistorialNotificaciones = ({ isOpen, onClose }) => {
    const [historial, setHistorial] = useState([]);

    useEffect(() => {
        // Cargar historial desde localStorage
        const savedHistorial = localStorage.getItem('historialNotificaciones');
        if (savedHistorial) {
            setHistorial(JSON.parse(savedHistorial));
        }
    }, [isOpen]);

    const clearHistorial = () => {
        localStorage.removeItem('historialNotificaciones');
        setHistorial([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
                {/* Header */}
                <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <i className="fas fa-history"></i>
                        Historial de Notificaciones
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={clearHistorial}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                            title="Limpiar historial"
                        >
                            <i className="fas fa-trash mr-2"></i>
                            Limpiar
                        </button>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 text-2xl"
                            title="Cerrar"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <AnimatePresence>
                        {historial.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <i className="fas fa-bell-slash text-4xl mb-4"></i>
                                <p>No hay notificaciones en el historial</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {historial.map((notif, index) => (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-gray-50 rounded-lg p-4 border-l-4 shadow-sm"
                                        style={{
                                            borderLeftColor: 
                                                notif.tipo === 'error' ? '#ef4444' :
                                                notif.tipo === 'warning' ? '#f59e0b' :
                                                '#3b82f6'
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium">{notif.mensaje}</p>
                                                <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-4">
                                                    <span>
                                                        <i className="fas fa-building mr-1"></i>
                                                        {notif.empresa}
                                                    </span>
                                                    <span>
                                                        <i className="fas fa-calendar mr-1"></i>
                                                        {new Date(notif.fecha).toLocaleDateString('es-GT')}
                                                    </span>
                                                    <span>
                                                        <i className="fas fa-clock mr-1"></i>
                                                        {new Date(notif.fecha).toLocaleTimeString('es-GT')}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                notif.tipo === 'error' ? 'bg-red-100 text-red-800' :
                                                notif.tipo === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {notif.tipo}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                        Total: {historial.length} notificaciones
                    </span>
                    <button
                        onClick={onClose}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Cerrar
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

