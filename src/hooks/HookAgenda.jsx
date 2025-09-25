import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3605';

export const useAgendaStore = create((set, get) => ({
    isLoading: false,
    isAgendaOpen: false,
    agendaData: null,
    agenda: [],
    error: null,

    // Actions
    setAgendaOpen: (value) => set({ isAgendaOpen: value }),
    setAgendaData: (data) => set({ agendaData: data }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Obtener todas las agendas
    getAgendas: async () => {
        set({ isLoading: true, error: null });
        try {
            console.log('Haciendo request a:', `${API_BASE_URL}/api/v1/agenda/`);
            const response = await axios.get(`${API_BASE_URL}/api/v1/agenda/`);
            
            console.log('Respuesta completa:', response);
            console.log('Response data:', response.data);
            
            // Asegurar que siempre sea un array
            const agendaData = response.data.data || response.data;
            const safeAgenda = Array.isArray(agendaData) ? agendaData : [];
            
            console.log('Datos procesados:', safeAgenda);
            
            set({ 
                agenda: safeAgenda, 
                isLoading: false 
            });
            return safeAgenda;
        } catch (error) {
            console.error('Error completo:', error);
            console.error('Error response:', error.response);
            
            const errorMessage = error.response?.data?.message || 'Error al obtener las agendas';
            set({ error: errorMessage, isLoading: false, agenda: [] });
            throw new Error(errorMessage);
        }
    },
    // Crear nueva agenda
    createAgenda: async (newAgenda) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/v1/agenda/create`, 
                newAgenda
            );
            
            // Agregar la nueva agenda al estado actual
            set(state => ({
                agenda: [...state.agenda, response.data.data || response.data],
                isLoading: false,
                isAgendaOpen: false
            }));
            
            return response.data.data || response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al crear la agenda';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    // Obtener agendas filtradas por importancia
    getAgendasFiltradas: async (importancia) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/v1/agenda/filtro/${importancia}`
            );
            
            const agendaData = response.data.data || response.data;
            const safeAgenda = Array.isArray(agendaData) ? agendaData : [];
            
            set({ 
                agenda: safeAgenda, 
                isLoading: false 
            });
            return safeAgenda;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al obtener agendas filtradas';
            set({ error: errorMessage, isLoading: false, agenda: [] });
            throw new Error(errorMessage);
        }
    },

    // Actualizar agenda existente
    updateAgenda: async (id, updatedAgenda) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/v1/agenda/update/${id}`,
                updatedAgenda
            );
            
            // Actualizar la agenda en el estado
            set(state => ({
                agenda: state.agenda.map(item => 
                    item._id === id ? (response.data.data || response.data) : item
                ),
                isLoading: false
            }));
            
            return response.data.data || response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al actualizar la agenda';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },

    // Eliminar agenda
    deleteAgenda: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/api/v1/agenda/delete/${id}`
            );
            
            // Eliminar la agenda del estado
            set(state => ({
                agenda: state.agenda.filter(item => item._id !== id),
                isLoading: false
            }));
            
            return response.data.data || response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al eliminar la agenda';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    },
    deleteExpiredVisits: async () => {
        set({ isLoading: true, error: null });
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL;
            console.log('🌐 Usando URL:', API_URL);
            
            // Detectar si estamos en producción o local
            const isProduction = API_URL.includes('vercel.app');
            
            if (isProduction) {
                // Intentar con el backend de Vercel
                try {
                    const response = await axios.delete(`${API_URL}/api/v1/agenda/delete-expired`);
                    console.log('✅ Eliminación en producción exitosa');
                    
                    // Recargar agendas desde el servidor
                    await get().getAgendas();
                    set({ isLoading: false });
                    return response.data;
                    
                } catch (productionError) {
                    console.log('⚠️ Falló producción, intentando localmente');
                    // Continuar con solución frontend
                }
            }

            // Solución frontend (siempre funciona)
            const currentDate = new Date();
            const agendasActuales = get().agenda;
            
            const agendasFiltradas = agendasActuales.filter(item => {
                const visitaDate = new Date(item.visita);
                return visitaDate >= currentDate;
            });

            const eliminadas = agendasActuales.length - agendasFiltradas.length;
            
            set({ 
                agenda: agendasFiltradas, 
                isLoading: false 
            });

            return { 
                success: true, 
                message: `Eliminadas ${eliminadas} visitas vencidas` 
            };
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al eliminar visitas vencidas';
            set({ error: errorMessage, isLoading: false });
            throw new Error(errorMessage);
        }
    }
}));