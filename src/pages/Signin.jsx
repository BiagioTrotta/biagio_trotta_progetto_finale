import { useState } from 'react';
import { InboxIcon as EnvelopeIcon, LockOpenIcon as LockClosedIcon } from 'lucide-react';
import { supabase } from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa il contesto

export default function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Stato per il messaggio di successo
    const navigate = useNavigate(); // Hook per la navigazione
    const { login } = useAuth(); // Usa il contesto per accedere alla funzione login

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset messaggio errore
        setSuccessMessage(''); // Reset messaggio successo
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                setErrorMessage(error.message);
            } else {
                setSuccessMessage('Login successful'); // Messaggio successo

                // Aggiorna il contesto con i dettagli dell'utente
                login(data.user); // Passa l'utente effettivo

                // Naviga alla home dopo 2 secondi
                setTimeout(() => {
                    navigate('/');
                }, 2000); // 2 secondi di ritardo
            }
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.');
        }
    };


    return (
        <>
            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-4">
                <div className="min-h-screen flex items-center justify-center p-4">
                    {/* Sezione principale */}
                    <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Sezione immagine */}
                        <div className="md:w-1/3">
                            <img
                                src="https://res.cloudinary.com/doyfjbmhk/image/upload/v1735567274/login_register_tjzjtx.png"
                                alt="Sign in illustration"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Sezione form */}
                        <div className="w-full md:w-2/3 p-6">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Sign in</h3>
                            <p className="text-sm text-gray-500 mb-6 text-center">
                                Don't have an account?{' '}
                                <a href="/signup" className="text-blue-600 hover:underline">
                                    Register here
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
                                            placeholder="Enter your email"
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
                                            placeholder="Enter your password"
                                        />
                                        <LockClosedIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                                            Remember me
                                        </label>
                                    </div>
                                    <div>
                                        <a href="#" className="text-sm text-blue-600 hover:underline">
                                            Forgot Password?
                                        </a>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Sign in
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
