import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import Search from "./Search";
import { useAuth } from '../context/AuthContext';
import FetchStoresPlatformsGenres from '../lib/FetchStoresPlatformsGenres';

export default function NavbarCustom() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { isAuthenticated, user, login, logout } = useAuth();
    const [username, setUsername] = useState(null);

    const [isStoresDropdownOpen, setIsStoresDropdownOpen] = useState(false);
    const [isPlatformsDropdownOpen, setIsPlatformsDropdownOpen] = useState(false);
    const [isGenresDropdownOpen, setIsGenresDropdownOpen] = useState(false);
    const [stores, setStores] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [genres, setGenres] = useState([]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                login(user);

                // Recupera lo username associato
                const { data, error } = await supabase
                    .from("profiles")
                    .select("username")
                    .eq("id", user.id)
                    .single(); // Single perché ci aspettiamo un solo risultato
                if (error) {
                    console.error("Errore nel recupero dello username:", error.message);
                } else if (data) {
                    setUsername(data.username);
                }
            } else {
                logout();
            }
        };

        getUser();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [login, logout]);

    useEffect(() => {
        FetchStoresPlatformsGenres('genres', setGenres);
        FetchStoresPlatformsGenres('platforms', setPlatforms);
        FetchStoresPlatformsGenres('stores', setStores);
    }, []);

    const toggleStoresDropdown = () => {
        setIsStoresDropdownOpen((prevState) => !prevState);
    };

    const togglePlatformsDropdown = () => {
        setIsPlatformsDropdownOpen((prevState) => !prevState);
    };

    const toggleGenresDropdown = () => {
        setIsGenresDropdownOpen((prevState) => !prevState);
    };

    // Funzione per chiudere il menu quando viene cliccato un link
    const handleLinkClick = () => {
        setIsMenuOpen(false); // Chiudi il menu
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
    };

    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between flex-wrap sm:flex-nowrap">

                    <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-between flex-wrap sm:flex-nowrap">
                        <div className="inset-y-0 left-0 flex items-center sm:hidden">
                            <button
                                type="button"
                                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded={isMenuOpen ? "true" : "false"}
                                onClick={toggleMenu}
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg
                                    className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                                <svg
                                    className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex shrink-0 items-center">
                            <Link to="/">
                                <img
                                    className="h-8 w-auto"
                                    src='/logo.svg'
                                    alt="Your Company"
                                />
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block w-full">
                            <div className="flex items-center space-x-4 justify-center">
                                <Search />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">

                            {isAuthenticated && user ? (
                                <>
                                    <Link to="/profile" className="flex items-center text-indigo-400 hover:text-indigo-600">
                                        {/* Icona (opzionale) */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c4.418 0 8-1.343 8-3s-3.582-3-8-3-8 1.343-8 3 3.582 3 8 3zM12 6c2.21 0 4-1.79 4-4S14.21 0 12 0 8 1.79 8 4s1.79 4 4 4zM2 20c0-2.21 3.582-4 8-4s8 1.79 8 4H2z" />
                                        </svg>
                                        <span className="font-semibold">
                                            {(username || user.email).length > 10 ? `${username?.slice(0, 10)}...` : username || user.email}
                                        </span>

                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-500"
                                    >
                                        <Link to="/"><i className="fa-solid fa-right-from-bracket"></i></Link>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signin"
                                        className="px-4 py-1 bg-purple-700 text-white rounded-lg hover:bg-purple-600"
                                    >
                                        Accedi
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-1 bg-indigo-700 text-white rounded-lg hover:bg-indigo-600"
                                    >
                                        Registrati
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>


                </div>
            </div>

            <div
                className={`absolute top-16 left-0 w-full bg-gray-800 sm:hidden z-50 ${isMenuOpen ? "block" : "hidden"}`}
                id="mobile-menu"
            >
                <div className="px-2 pt-2 pb-3 space-y-1 z-10">
                    <div className="flex items-center space-x-4 justify-center">
                        <Search />
                    </div>
                    {isAuthenticated && user ? (
                        <Link to="/favorites" className="flex items-center px-4 py-2 text-sm font-medium rounded hover:bg-gray-700 text-white w-full justify-center">
                            I miei preferiti  <i className="fa-regular fa-star ms-1"></i>
                        </Link>
                    ) : null}
                    <div className="relative">
                        <button
                            className="block w-full text-left rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white text-center"
                            onClick={toggleStoresDropdown}
                        >
                            Top Stores
                            <i className="fa-solid fa-caret-down ms-2"></i>
                        </button>
                        {isStoresDropdownOpen && (
                            <ul className="mt-2 space-y-1 pl-4 text-center">
                                {stores.map((store) => (
                                    <li key={store.id}>
                                        <Link
                                            to={`/store/${store.id}`}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                            onClick={handleLinkClick} // Chiude il menu al click
                                        >
                                            {store.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            className="block w-full text-left rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white text-center"
                            onClick={togglePlatformsDropdown}
                        >
                            Platforms
                            <i className="fa-solid fa-caret-down ms-2"></i>
                        </button>
                        {isPlatformsDropdownOpen && (
                            <ul className="mt-2 space-y-1 pl-4 text-center">
                                {platforms.map((platform) => (
                                    <li key={platform.id}>
                                        <Link
                                            to={`/platform/${platform.id}`}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                            onClick={handleLinkClick} // Chiude il menu al click
                                        >
                                            {platform.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            className="block w-full text-left rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white text-center"
                            onClick={toggleGenresDropdown}
                        >
                            Genres
                            <i className="fa-solid fa-caret-down ms-2"></i>
                        </button>
                        {isGenresDropdownOpen && (
                            <ul className="mt-2 space-y-1 pl-4 text-center">
                                {genres.map((genre) => (
                                    <li key={genre.id}>
                                        <Link
                                            to={`/genre/${genre.id}`}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                            onClick={handleLinkClick} // Chiude il menu al click
                                        >
                                            {genre.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
