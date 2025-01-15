import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FetchGameDetail from '../lib/FetchGameDetail'; // Funzione per ottenere i dettagli del gioco
import FormatDate from '../lib/FormatDate';
import SpinnerCustom from './SpinnerCustom';
import MessageForm from './MessageForm';

export default function GameDetailPage() {
    const { id } = useParams(); // Ottieni l'ID del gioco dalla URL
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true); // Stato di caricamento
    const [error, setError] = useState(null); // Stato per errori

    useEffect(() => {
        // Recupera i dettagli del gioco usando l'ID
        const fetchGameData = async () => {
            try {
                // Richiesta per ottenere i dettagli del gioco
                await FetchGameDetail(setGameData, id);
                setTimeout(() => setLoading(false), 1000); // Ritardo per simulare il caricamento
            } catch (err) {
                setError('Errore nel recupero dei dettagli del gioco');
                setLoading(false);
            }
        };

        fetchGameData();
    }, [id]); // Effettua il fetch ogni volta che l'ID cambia


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center mx-auto">
                {/* Mostra spinner durante il caricamento */}
                <SpinnerCustom />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-700 text-white">
                <p>{error}</p> {/* Messaggio di errore */}
            </div>
        );
    }

    if (!gameData) {
        return <div className="min-h-screen bg-slate-700">Nessun dato disponibile per questo gioco.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-700">
            {/* Header con nome e dettagli del gioco */}
            <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold">{gameData.name}</h1>
                    <div className="flex items-center space-x-4 mt-2">
                        <span className="px-3 py-1 bg-slate-600 rounded-full text-sm font-semibold">
                            {gameData.platform}
                        </span>
                        <span className="px-3 py-1 bg-slate-500 rounded-full text-sm font-semibold">
                            {gameData.genre}
                        </span>
                    </div>
                </div>
            </header>

            {/* Contenuto principale */}
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Dettagli del gioco e immagine */}
                    <div className="md:col-span-2">
                        <img
                            src={gameData.background_image}
                            alt={gameData.name} // Immagine del gioco con testo alternativo
                            className="w-full h-auto rounded-lg shadow-lg mb-6"
                        />
                        <div className="bg-slate-800 rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-4 text-white">Descrizione</h2>
                            <p className="text-gray-300 mb-6">
                                {gameData.description_raw.length > 250 ? `${gameData.description_raw.slice(0, 750)}...` : gameData.description_raw}
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                                <div>
                                    <h3 className="text-lg font-bold text-white mt-4">Sviluppatori</h3>
                                    <ul className="space-y-2">
                                        {gameData.developers && gameData.developers.length > 0 ? (
                                            gameData.developers.map((developer, index) => (
                                                <li key={index} className="flex items-center text-gray-300">
                                                    <svg
                                                        className="w-4 h-6 text-green-500 mr-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M5 13l4 4L19 7"
                                                        ></path>
                                                    </svg>
                                                    <span className='text-sm'>{developer.name}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-gray-500">Nessun sviluppatore disponibile.</li>
                                        )}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-white mt-4">Negozi</h3>
                                    <ul className="grid grid-cols-2 gap-4">
                                        {gameData.stores && gameData.stores.length > 0 ? (
                                            gameData.stores.map((storeItem, index) => (
                                                <li key={index} className="flex items-center text-gray-300">
                                                    {storeItem.url ? (
                                                        <a
                                                            href={storeItem.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:underline"
                                                        >
                                                            <svg
                                                                className="w-6 h-6 text-amber-500 mr-2"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M5 13l4 4L19 7"
                                                                ></path>
                                                            </svg>
                                                            {storeItem.store.name}
                                                        </a>
                                                    ) : (
                                                        <span>
                                                            <svg
                                                                className="w-4 h-6 text-amber-500 mr-2"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M5 13l4 4L19 7"
                                                                ></path>
                                                            </svg>
                                                            <span className='text-sm'>{storeItem.store.name}</span>
                                                        </span>
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-gray-500">Nessun negozio disponibile.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className="flex flex-col w-full space-y-8 mt-20">
                                {/* Sezione Data di Uscita */}
                                <div className="w-full text-white">
                                    <span className="font-semibold">Data di uscita:</span> {FormatDate(gameData.released)}
                                </div>

                                {/* Sezione Messaggi */}
                                <MessageForm gameData={gameData} />

                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-slate-800 rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-4 text-white">Info principali</h2>

                            {/* Elenco dei generi */}
                            <div>
                                <h3 className="text-md font-bold text-white mt-4">Generi</h3>
                                <ul className="grid grid-cols-2 gap-4">
                                    {gameData.genres && gameData.genres.length > 0 ? (
                                        gameData.genres.map((item, index) => (
                                            <li key={index} className="flex items-center text-gray-300 whitespace-nowrap">
                                                <svg
                                                    className="w-4 h-6 flex-shrink-0 text-blue-500 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    ></path>
                                                </svg>
                                                <span className="whitespace-nowrap text-sm">{item.name}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500 col-span-2">Nessun genere disponibile.</li>
                                    )}
                                </ul>
                            </div>

                            {/* Elenco delle piattaforme */}
                            <div>
                                <h3 className="text-md font-bold text-white mt-4">Piattaforme</h3>
                                <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2"> {/* Due colonne su schermi grandi */}
                                    {gameData.platforms && gameData.platforms.length > 0 ? (
                                        gameData.platforms.map((item, index) => (
                                            <li key={index} className="flex items-center text-gray-300 whitespace-nowrap">
                                                <svg
                                                    className="w-4 h-6 flex-shrink-0 text-blue-500 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    ></path>
                                                </svg>
                                                <span className="whitespace-nowrap text-sm">{item.platform.name}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500 col-span-2">Nessuna piattaforma disponibile.</li>
                                    )}
                                </ul>
                            </div>


                        </div>

                        {/* Link al sito ufficiale */}
                        <div className="mt-6">
                            <a
                                href={gameData.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-white hover:bg-blue-500 text-slate-700 font-bold py-3 px-4 rounded-lg shadow-md border border-slate-300 transition-colors duration-300 text-center block"
                            >
                                Vai al sito
                            </a>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
