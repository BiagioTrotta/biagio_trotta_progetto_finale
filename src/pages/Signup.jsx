import { useState } from 'react';
import { InboxIcon as EnvelopeIcon, LockIcon, UserIcon } from 'lucide-react';
import { supabase } from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa il contesto

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const { login } = useAuth(); // Usa il contesto per il login

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setErrorMessage('Le password non corrispondono.');
            return;
        }

        // Registrazione utente con Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    first_name: firstName,
                    last_name: lastName,
                },
            },
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            setSuccessMessage('Registrazione completata! Controlla la tua email per confermare l\'account.');

            // Login automatico
            const { data: loginData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setErrorMessage(signInError.message);
            } else {
                // Usa il contesto per impostare l'utente loggato
                login(loginData.user);

                // Reindirizza alla home dopo il login
                setTimeout(() => {
                    navigate('/');
                }, 2000); // 2 secondi di ritardo
            }
        }
    };


    return (
        <div className="flex-1 bg-gray-100 p-4">
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Sezione immagine */}
                    <div className="md:w-1/3">
                        <img
                            src="https://res.cloudinary.com/doyfjbmhk/image/upload/v1735567274/login_register_tjzjtx.png"
                            alt="Sign up illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Sezione form */}
                    <div className="w-full md:w-2/3 p-6">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Crea un Account</h3>
                        <p className="text-sm text-gray-500 mb-6 text-center">
                            Hai già un account?{' '}
                            <a href="/signin" className="text-blue-600 hover:underline">
                                Accedi qui
                            </a>
                        </p>

                        {/* Messaggio di errore */}
                        {errorMessage && (
                            <p className="text-sm text-red-600 text-center mb-4">{errorMessage}</p>
                        )}

                        {/* Messaggio di successo */}
                        {successMessage && (
                            <p className="text-sm text-green-600 text-center mb-4">{successMessage}</p>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border rounded-md shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Il tuo username"
                                    />
                                    <UserIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome
                                </label>
                                <div className="relative">
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border rounded-md shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Inserisci il tuo nome"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Cognome
                                </label>
                                <div className="relative">
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border rounded-md shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Inserisci il tuo cognome"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border rounded-md shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Inserisci la tua email"
                                    />
                                    <EnvelopeIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border rounded-md shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Crea una password"
                                    />
                                    <LockIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Conferma Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border rounded-md shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ripeti la password"
                                    />
                                    <LockIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Registrati
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
