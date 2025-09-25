import { AgendaList } from "../components/template/Agenda";
import { useAuth } from "../hooks/AuthHook";

export const AgendaPage = () => {

  const { logout } = useAuth();
    const handleLogout = () => {
      if (window.confirm('¿Deseas cerrar sesión?')) {
      logout();
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-50">
            <AgendaList />
            
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={handleLogout}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded shadow"
                    title="Cerrar sesión"
                >
                    Salir
                </button>
            </div>
        </div>
  );
}