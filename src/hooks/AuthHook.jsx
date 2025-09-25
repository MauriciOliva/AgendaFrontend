import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// ✅ Función única para obtener la URL base
const getApiBaseUrl = () => {
    if (import.meta.env.MODE === 'development') {
        return import.meta.env.VITE_API_BASE_URL || 'http://localhost:2600';
    }
    return import.meta.env.VITE_API_BASE_URL || 'https://agenda-backend-silk.vercel.app';
};

const API_BASE_URL = getApiBaseUrl();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('🌐 API Base URL:', API_BASE_URL); // Para debugging
        
        axios.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.warn('Error de autenticación, haciendo logout');
                    logout();
                }
                return Promise.reject(error);
            }
        );
    }, []);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                const user = JSON.parse(userData);
                
                if (token && typeof token === 'string' && token.split('.').length === 3) {
                    setUser(user);
                } else {
                    console.warn('Token con formato inválido');
                    logout();
                }
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            console.log('🔐 Intentando login en:', `${API_BASE_URL}/api/v1/auth/login`);
            
            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
                username,
                password
            });

            const data = response.data;

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                
                return {
                    success: true,
                    user: data.user,
                    token: data.token,
                    message: data.message
                };
            } else {
                throw new Error(data.message || 'Error desconocido');
            }
        } catch (error) {
            console.error('❌ Error en login:', error);
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                'Error al iniciar sesión'
            );
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login'; // Redirigir forzosamente
        return { success: true, message: 'Sesión cerrada correctamente' };
    };

    const value = {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};