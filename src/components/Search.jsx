import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState(""); // Stato per il valore della ricerca
    const navigate = useNavigate();

    const handleSearch = () => {
        // Naviga alla pagina dei risultati
        navigate("/results", { state: { searchTerm } });
        // Resetta il valore dell'input
        setSearchTerm("");
    };

    return (
        <div className="p-4 space-y-6 w-full">
            {/* Barra di ricerca */}
            <div className="flex space-x-2 bg-gray-800 px-4 rounded-lg shadow-lg">
                <input
                    type="text"
                    placeholder="Cerca giochi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-1 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-1 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
        </div>
    );
}
