import React, { useEffect, useState } from "react";
import CardCustom from '../components/CardCustom';
import SpinnerCustom from '../components/SpinnerCustom';
import { useLocation } from "react-router-dom";



export default function Results() {
    const { state } = useLocation();
    const searchTerm = state?.searchTerm || "";
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const searchGames = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}games?key=${import.meta.env.VITE_API_KEY}&search=${searchTerm}`
                );
                const data = await response.json();
                setResults(data.results || []);
                setIsLoading(false);
            } catch (error) {
                console.error("Errore durante la ricerca:", error);
            }
        };

        if (searchTerm) {
            searchGames();
        }
    }, [searchTerm]);

    return (
        <div className="flex-1 bg-gray-100 p-4">
            <h2 className="text-2xl font-semibold mb-4">
                Risultati per: <span className="italic">{searchTerm}</span>
            </h2>

            {/* Mostra lo spinner quando i dati sono in fase di caricamento */}
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <SpinnerCustom />
                </div>
            ) : results.length === 0 ? (
                <p className="text-center text-xl">Nessun risultato trovato per "{searchTerm}".</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {results.map((game) => (
                        <CardCustom
                            key={game.id}
                            gameId={game.id}
                            name={game.name}
                            background_image={game.background_image}
                            parent_platforms={game.parent_platforms}
                            genres={game.genres}
                            released={game.released}
                            rating={game.rating}
                            metacritic={game.metacritic}
                            reviews_count={game.reviews_count}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
