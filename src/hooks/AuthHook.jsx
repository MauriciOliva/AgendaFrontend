import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const getApiBaseUrl = () => {
    const url = import.meta.env.VITE_API_BASE_URL || 'https://agenda-backend-silk.vercel.app';
    console.log('🔗 URL Base configurada:', url);
    return url;
};

const API_BASE_URL = getApiBaseUrl();
console.log('🌐 API_BASE_URL final:', API_BASE_URL);

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
            // ✅ URL hardcodeada para evitar typos
            const loginUrl = `${API_BASE_URL}/api/v1/auth/login`;
            console.log('🔐 Intentando login en:', loginUrl);
            
            const response = await axios.post(loginUrl, {
                username,
                password
            }, {
                timeout: 10000, // 10 segundos timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Login exitoso, respuesta:', response.data);
            
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
            console.error('❌ Error completo en login:', error);
            console.error('❌ URL intentada:', error.config?.url);
            console.error('❌ Método:', error.config?.method);
            console.error('❌ Código de estado:', error.response?.status);
            console.error('❌ Datos de error:', error.response?.data);
            
            // Mensaje de error más específico
            let errorMessage = 'Error al iniciar sesión';
            
            if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Error de conexión. Verifica tu internet.';
            } else if (error.response?.status === 404) {
                errorMessage = 'Endpoint no encontrado. Verifica la URL.';
            } else if (error.response?.status === 500) {
                errorMessage = 'Error interno del servidor.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            throw new Error(errorMessage);
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