import React from "react";

interface ErrorModalProps {
    abierto: boolean;
    mensaje: string;
    cerrarModal: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ abierto, mensaje, cerrarModal }) => {
    if (!abierto) return null; // No renderiza nada si no está abierto

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            onClick={cerrarModal} // clic fuera cierra el modal
        >
            <div
                className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6"
                onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic dentro
            >
                <h2 className="text-lg font-bold text-red-600 mb-4">Error</h2>
                <p className="mb-4">{mensaje}</p>
                <button
                    onClick={cerrarModal}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;
