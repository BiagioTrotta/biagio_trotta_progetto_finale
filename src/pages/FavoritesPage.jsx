import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Per la navigazione
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext'; // Usa il contesto di autenticazione
import SpinnerCustom from '../components/SpinnerCustom';

const FavoritesPage = () => {
    const [favoriteGames, setFavoriteGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth(); // Recupera l'utente loggato dal contesto
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
            // Se l'utente non è autenticato, reindirizza alla pagina di login
            navigate('/');
            return;
        }
        const fetchFavorites = async () => {
            try {
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser(); // Ottiene i dati dell'utente

                if (error) throw error;
                if (!user) {
                    console.error("Utente non autenticato");
                    return;
                }

                // Recupera i preferiti usando l'ID dell'utente
                const { data, error: fetchError } = await supabase
                    .from('favorites')
                    .select('*')
                    .eq('user_id', user.id); // Filtra per l'ID utente

                if (fetchError) throw fetchError;

                // Recupera i dettagli dei giochi
                const gamesWithDetails = [];
                for (let game of data) {
                    const gameDetail = await FetchGameDetail(game.game_id); // Passa il game_id
                    gamesWithDetails.push(gameDetail); // Aggiungi i dettagli del gioco
                }

                setFavoriteGames(gamesWithDetails); // Aggiorna lo stato dei giochi con i dettagli
                setLoading(false); // Finito il caricamento
            } catch (error) {
                console.error("Errore nel recuperare i preferiti:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchFavorites();

        // Funzione per ottenere i dettagli del gioco
        const FetchGameDetail = async (game_id) => {
            const response = await fetch(`https://api.rawg.io/api/games/${game_id}?key=${import.meta.env.VITE_API_KEY}`);
            const gameData = await response.json();
            return gameData; // Restituisce i dettagli del gioco
        };
    }, []); // Eseguito solo una volta al montaggio del componente

    // Funzione per rimuovere il gioco dai preferiti
    const removeFromFavorites = async (gameId) => {
        try {
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError) throw authError;
            if (!user) {
                console.error("Utente non autenticato");
                return;
            }

            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('game_id', gameId)
                .eq('user_id', user.id);

            if (error) {
                console.error('Errore durante la rimozione dai preferiti:', error.message);
            } else {
                // Rimuovi il gioco dalla lista dei preferiti localmente
                setFavoriteGames(favoriteGames.filter(game => game.id !== gameId));
            }
        } catch (error) {
            console.error("Errore durante la rimozione dal database:", error);
        }
    };

    if (loading) return <SpinnerCustom />;
    if (error) return <p>Errore: {error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6">I tuoi giochi preferiti</h1>
            {favoriteGames.length === 0 ? (
                <p>Non hai ancora aggiunto giochi preferiti.</p>
            ) : (
                <table className="min-w-full table-auto border-separate border-spacing-2 border border-gray-200 shadow-lg">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-2 text-sm font-medium text-gray-700">Nome</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-700">Generi</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-700">Data di rilascio</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-700">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favoriteGames.map((game) => (
                            <tr key={game.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-800">{game.name || 'Nome non disponibile'}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">
                                    {Array.isArray(game.genres)
                                        ? game.genres.map((genre) => genre.name).join(', ')
                                        : 'N/A'}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-800">{game.released || 'Data non disponibile'}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">
                                    <button
                                        onClick={() => removeFromFavorites(game.id)}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors duration-300"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FavoritesPage;
