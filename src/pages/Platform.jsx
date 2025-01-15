import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import CardCustom from '../components/CardCustom';
import SpinnerCustom from '../components/SpinnerCustom';
import FetchGamesFilter from '../lib/FetchGamesFilter';
import FetchStoresPlatformsGenres from '../lib/FetchStoresPlatformsGenres';

const Platform = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [platformName, setPlatformName] = useState('');
    const [platforms, setPlatforms] = useState([]);
    const observer = useRef();
    const { platformId } = useParams();

    // Fetch dei giochi
    const fetchGames = () => {
        if (platformId) {
            setLoading(true);
            FetchGamesFilter(setGames, 'platforms', platformId, page).finally(() => setLoading(false));
        } else {
            setError("Platform ID non trovato.");
            setLoading(false);
        }
    };

    // Fetch piattaforme
    useEffect(() => {
        FetchStoresPlatformsGenres('platforms', setPlatforms);
    }, []);

    // Imposta il nome della piattaforma
    useEffect(() => {
        if (platforms.length > 0 && platformId) {
            const platform = platforms.find((p) => p.id === parseInt(platformId));
            if (platform) {
                setPlatformName(platform.name);
            } else {
                setPlatformName('Piattaforma non trovata');
            }
        }
    }, [platforms, platformId]);

    // Reset dei giochi e della pagina quando cambia la piattaforma
    useEffect(() => {
        setGames([]); // Cancella i giochi precedenti
        setPage(1);   // Imposta la pagina alla 1
        fetchGames(); // Fetch dei nuovi giochi
        window.scrollTo(0, 0); // Torna all'inizio della pagina
    }, [platformId]); // Quando cambia platformId, viene eseguito questo effetto

    // Fetch dei giochi quando cambia pagina
    useEffect(() => {
        if (page > 1) {
            fetchGames();
        }
    }, [page]);

    const lastGameElementRef = (node) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    };

    if (loading && page === 1) return (
        <div className="flex items-center justify-center min-h-screen mx-auto">
            <SpinnerCustom />
        </div>
    );

    if (error) return <p className="text-center">Errore: {error}</p>;

    return (
        <>
            <div className="flex-1 bg-gray-100 p-4">
                <h2 className="text-2xl font-semibold mb-4">Giochi per {platformName}</h2>
                {games.length === 0 && !loading ? (
                    <p className="text-center text-xl">Nessun gioco disponibile per questa piattaforma.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {games.map((game, index) => (
                            <div
                                key={game.id}
                                ref={games.length === index + 1 ? lastGameElementRef : null}
                            >
                                <CardCustom
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
                            </div>
                        ))}
                    </div>
                )}
                {loading && page > 1 && (
                    <div className="flex items-center justify-center my-4">
                        <SpinnerCustom />
                    </div>
                )}
            </div>
        </>
    );
};

export default Platform;
