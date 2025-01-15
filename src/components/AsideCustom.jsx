import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FetchStoresPlatformsGenres from '../lib/FetchStoresPlatformsGenres';
import { useAuth } from '../context/AuthContext';

export default function AsideCustom() {
    const [isStoresDropdownOpen, setIsStoresDropdownOpen] = useState(false);
    const [isPlatformsDropdownOpen, setIsPlatformsDropdownOpen] = useState(false);
    const [isGenresDropdownOpen, setIsGenresDropdownOpen] = useState(false);
    const [stores, setStores] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [genres, setGenres] = useState([]);
    const { isAuthenticated, user, login, logout } = useAuth();

    useEffect(() => {
        // Fetch dati per generi, piattaforme e store
        FetchStoresPlatformsGenres('genres', setGenres);
        FetchStoresPlatformsGenres('platforms', setPlatforms);
        FetchStoresPlatformsGenres('stores', setStores);
    }, []);

    // Gestione apertura/chiusura dei dropdown
    const toggleStoresDropdown = () => {
        setIsStoresDropdownOpen((prevState) => !prevState);
    };

    const togglePlatformsDropdown = () => {
        setIsPlatformsDropdownOpen((prevState) => !prevState);
    };

    const toggleGenresDropdown = () => {
        setIsGenresDropdownOpen((prevState) => !prevState);
    };

    // Chiudi tutti i dropdown
    const closeDropdown = () => {
        setIsStoresDropdownOpen(false);
        setIsPlatformsDropdownOpen(false);
        setIsGenresDropdownOpen(false);
    };

    return (
        <aside className="w-48 lg:w-56 xl:w-64 bg-gray-800 text-gray-200 min-h-screen sticky top-0">
            <div className="p-4 border-b border-gray-700">
                <h1 className="text-lg rounded-md px-2 py-2 font-medium text-white">
                    Dashboard
                </h1>
            </div>
            <nav className="mt-4">
                {/* Link ai preferiti se l'utente è autenticato */}
                {isAuthenticated && user ? (
                    <Link to="/favorites" className="flex items-center px-4 py-2 text-sm font-medium rounded hover:bg-gray-700 hover:text-white w-full">
                        <i className="fa-regular fa-star me-3"></i> I miei preferiti
                    </Link>
                ) : null}

                <ul className="space-y-2">
                    {/* Dropdown Store */}
                    <li className="relative">
                        <button
                            className="flex items-center px-4 py-2 text-sm font-medium rounded hover:bg-gray-700 hover:text-white w-full"
                            onClick={toggleStoresDropdown}
                        >
                            <i className="fa-solid fa-shop me-3"></i>
                            Top Stores
                            <i className="fa-solid fa-caret-down ms-3"></i>
                        </button>
                        {isStoresDropdownOpen && (
                            <div className="mt-2 w-full bg-gray-800 text-gray-200 rounded shadow-lg z-10">
                                {stores.length === 0 ? (
                                    <p className="p-2 text-center">Nessuno store disponibile</p>
                                ) : (
                                    <ul className="space-y-1 max-h-60 overflow-y-auto dropdown-scroll">
                                        {stores.map((store) => (
                                            <li key={store.id}>
                                                <Link
                                                    to={`/store/${store.id}`}
                                                    className="block px-4 py-2 text-sm rounded hover:bg-gray-700"
                                                    onClick={closeDropdown}
                                                >
                                                    {store.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </li>

                    {/* Dropdown Piattaforme */}
                    <li className="relative">
                        <button
                            className="flex items-center px-4 py-2 text-sm font-medium rounded hover:bg-gray-700 hover:text-white w-full"
                            onClick={togglePlatformsDropdown}
                        >
                            <i className="fa-solid fa-layer-group me-3"></i>
                            Platforms
                            <i className="fa-solid fa-caret-down ms-3"></i>
                        </button>
                        {isPlatformsDropdownOpen && (
                            <div className="mt-2 w-full bg-gray-800 text-gray-200 rounded shadow-lg z-10">
                                {platforms.length === 0 ? (
                                    <p className="p-2 text-center">Nessuna piattaforma disponibile</p>
                                ) : (
                                    <ul className="space-y-1 max-h-60 overflow-y-auto dropdown-scroll">
                                        {platforms.map((platform) => (
                                            <li key={platform.id}>
                                                <Link
                                                    to={`/platform/${platform.id}`}
                                                    className="block px-4 py-2 text-sm rounded hover:bg-gray-700"
                                                    onClick={closeDropdown}
                                                >
                                                    {platform.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </li>

                    {/* Dropdown Generi */}
                    <li className="relative">
                        <button
                            className="flex items-center px-4 py-2 text-sm font-medium rounded hover:bg-gray-700 hover:text-white w-full"
                            onClick={toggleGenresDropdown}
                        >
                            <i className="fa-solid fa-tags me-3"></i>
                            Genres
                            <i className="fa-solid fa-caret-down ms-3"></i>
                        </button>
                        {isGenresDropdownOpen && (
                            <div className="mt-2 w-full bg-gray-800 text-gray-200 rounded shadow-lg z-10">
                                {genres.length === 0 ? (
                                    <p className="p-2 text-center">Nessun genere disponibile</p>
                                ) : (
                                    <ul className="space-y-1 max-h-60 overflow-y-auto dropdown-scroll">
                                        {genres.map((genre) => (
                                            <li key={genre.id}>
                                                <Link
                                                    to={`/genre/${genre.id}`}
                                                    className="block px-4 py-2 text-sm rounded hover:bg-gray-700"
                                                    onClick={closeDropdown}
                                                >
                                                    {genre.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
