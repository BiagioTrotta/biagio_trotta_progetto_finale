import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameImageEffect from './GameImageEffect';
import { supabase } from '../config/supabaseClient'; // Verifica il percorso corretto
import { useAuth } from '../context/AuthContext';

export default function CardCustom({
    gameId,
    name,
    background_image,
    parent_platforms = [],
    genres = [],
    released,
    rating,
    metacritic,
    reviews_count,
}) {
    const { isAuthenticated, user } = useAuth();
    const [showMorePlatforms, setShowMorePlatforms] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const displayedPlatforms = parent_platforms.slice(0, 3);
    const remainingPlatforms = parent_platforms.length - 3;

    // Mostra o nasconde le piattaforme aggiuntive
    const handleShowMoreClick = () => {
        setShowMorePlatforms((prevState) => !prevState);
    };

    // Formatta la data di rilascio
    const releaseDate = new Date(released);
    const formattedDate = releaseDate.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    // Controlla se il gioco è già nei preferiti
    const checkIfFavorite = async () => {
        if (user) {
            const { data, error } = await supabase
                .from('favorites')
                .select('*')
                .eq('game_id', gameId)
                .eq('user_id', user.id);

            if (error) {
                console.error('Errore nel recuperare i preferiti:', error.message);
                return;
            }
            setIsFavorite(data.length > 0);
        }
    };

    useEffect(() => {
        checkIfFavorite();
    }, [user, gameId]);

    // Aggiunge o rimuove il gioco dai preferiti
    const toggleFavorite = async () => {
        if (!user) {
            console.error('Utente non autenticato');
            return;
        }

        if (isFavorite) {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('game_id', gameId)
                .eq('user_id', user.id);

            if (error) {
                console.error('Errore durante la rimozione dai preferiti:', error.message);
            } else {
                setIsFavorite(false);
            }
        } else {
            const { error } = await supabase
                .from('favorites')
                .insert([{ game_id: gameId, user_id: user.id }]);

            if (error) {
                console.error('Errore durante l\'aggiunta ai preferiti:', error.message);
            } else {
                setIsFavorite(true);
            }
        }
    };

    return (
        <div className="mx-auto w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105">
            <div className="relative">
                {/* Immagine del gioco con effetto */}
                <GameImageEffect image={background_image} alt={name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-3xl lg:text-2xl md:text-xl font-bold text-white mb-2 drop-shadow-lg">
                        {name}
                    </h2>
                    {/* Piattaforme supportate */}
                    <div className="flex flex-wrap items-center gap-2 mb-2 justify-start">
                        {displayedPlatforms.map((platform, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full mb-1 min-w-[50px] text-center"
                            >
                                {platform.platform.name}
                            </span>
                        ))}
                        {showMorePlatforms &&
                            parent_platforms.slice(3).map((platform, index) => (
                                <span
                                    key={index + 3}
                                    className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full mb-1 min-w-[50px] text-center"
                                >
                                    {platform.platform.name}
                                </span>
                            ))}
                        {remainingPlatforms > 0 && !showMorePlatforms && (
                            <button
                                onClick={handleShowMoreClick}
                                className="px-2 py-1 bg-transparent border border-gray-500 text-gray-300 text-xs font-semibold rounded-full mb-1 min-w-[50px] text-center"
                            >
                                +{remainingPlatforms} altri
                            </button>
                        )}
                        {showMorePlatforms && (
                            <button
                                onClick={handleShowMoreClick}
                                className="px-2 py-1 bg-transparent border border-gray-500 text-gray-300 text-xs font-semibold rounded-full mb-1 min-w-[50px] text-center"
                            >
                                Mostra meno
                            </button>
                        )}
                    </div>
                    {/* Generi */}
                    <div className="flex flex-wrap items-center space-x-2">
                        <span className="px-2 py-1 bg-transparent border border-gray-500 text-gray-300 text-xs font-semibold rounded-full">
                            {genres.map((genre, index) => genre.name).join(', ') || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <div
                    className="text-gray-300 text-sm mb-6 overflow-hidden"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {/* Informazioni sul gioco */}
                    <div>
                        <p className="text-gray-300 text-sm flex items-center">
                            <i className="fas fa-star text-yellow-400 mr-1"></i> {rating} / 5
                        </p>
                        {metacritic && (
                            <p className="text-gray-300 text-sm flex items-center">
                                <i className="fab fa-apple text-green-400 mr-1"></i> Metacritic: {metacritic}
                            </p>
                        )}
                        <p className="text-gray-300 text-sm flex items-center">
                            <i className="fas fa-comments text-blue-400 mr-1"></i> Recensioni: {reviews_count}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-start justify-between space-y-2">
                    {/* Data di rilascio */}
                    <div className="flex items-center text-xs text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span>{formattedDate}</span>
                    </div>

                    {/* Pulsanti */}
                    <div className="flex items-center gap-2">
                        <Link
                            to={`/game/${gameId}`}
                            className="px-2 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors duration-300"
                        >
                            Scopri di più
                        </Link>
                        {isAuthenticated && user && (
                            <button
                                onClick={toggleFavorite}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300
        ${isFavorite ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                            >
                                <i className={`${isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}`}></i>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
