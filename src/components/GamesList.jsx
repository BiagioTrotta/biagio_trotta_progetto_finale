import React, { useEffect, useState, useRef } from 'react';
import CardCustom from '../components/CardCustom';
import SpinnerCustom from '../components/SpinnerCustom';
import FetchGamesFilter from '../lib/FetchGamesFilter';


const GamesList = ({ type, id, title }) => {
    // Stati per gestire i dati, il caricamento, gli errori e la paginazione
    const [games, setGames] = useState([]); // Elenco dei giochi da visualizzare
    const [loading, setLoading] = useState(true); // Stato di caricamento
    const [error, setError] = useState(null); // Stato per gestire errori
    const [page, setPage] = useState(1); // Pagina corrente per la paginazione
    const observer = useRef(); // Riferimento per l'osservazione dell'ultimo elemento (infinite scroll)

    // Funzione per recuperare i giochi dal backend utilizzando i parametri `type`, `id` e `page`
    const fetchGames = () => {
        if (id) {
            setLoading(true); // Imposta lo stato di caricamento a `true`
            FetchGamesFilter(setGames, type, id, page) // Chiamata alla funzione per ottenere i giochi
                .finally(() => setLoading(false)); // Imposta lo stato di caricamento a `false` una volta completata la fetch
        } else {
            // Se `id` non è valido, imposta un errore
            setError(`${type} ID non trovato.`);
            setLoading(false);
        }
    };

    // Effetto per aggiornare i giochi quando cambia il parametro `id`
    useEffect(() => {
        setGames([]); // Resetta i giochi quando cambia `id`
        setPage(1); // Resetta la pagina a 1
        fetchGames(); // Effettua una nuova fetch
        window.scrollTo(0, 0); // Scorre all'inizio della pagina
    }, [id]); // Dipende da `id`, viene eseguito ogni volta che cambia

    // Effetto per recuperare i giochi quando cambia la pagina
    useEffect(() => {
        if (page > 1) {
            fetchGames(); // Recupera i dati della nuova pagina
        }
    }, [page]); // Dipende da `page`, viene eseguito ogni volta che cambia

    // Funzione per l'osservazione dell'ultimo elemento (infinite scroll)
    const lastGameElementRef = (node) => {
        if (loading) return; // Se è in corso un caricamento, non fa nulla

        if (observer.current) observer.current.disconnect(); // Disconnette il vecchio osservatore

        observer.current = new IntersectionObserver((entries) => {
            // Controlla se l'ultimo elemento è visibile
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1); // Incrementa la pagina
            }
        });

        if (node) observer.current.observe(node); // Avvia l'osservazione per il nuovo nodo
    };

    // Mostra uno spinner durante il caricamento iniziale (solo alla prima pagina)
    if (loading && page === 1) return (
        <div className="flex items-center justify-center min-h-screen mx-auto">
            <SpinnerCustom />
        </div>
    );

    // Mostra un messaggio di errore se presente
    if (error) return <p className="text-center">Errore: {error}</p>;

    // Ritorna il layout principale della lista di giochi
    return (
        <div className="flex-1 bg-gray-100 p-4">
            {/* Titolo dinamico passato come prop */}
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            {/* Mostra un messaggio se non ci sono giochi */}
            {games.length === 0 && !loading ? (
                <p className="text-center text-xl">Nessun gioco disponibile per questo {type}.</p>
            ) : (
                // Griglia responsiva per mostrare i giochi
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {games.map((game, index) => (
                        <div
                            key={game.id}
                            ref={games.length === index + 1 ? lastGameElementRef : null} // Riferimento per l'ultimo elemento
                        >
                            {/* Componente riutilizzabile per la card di ogni gioco */}
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
            {/* Spinner per il caricamento delle pagine successive */}
            {loading && page > 1 && (
                <div className="flex items-center justify-center my-4">
                    <SpinnerCustom />
                </div>
            )}
        </div>
    );
};

export default GamesList;
