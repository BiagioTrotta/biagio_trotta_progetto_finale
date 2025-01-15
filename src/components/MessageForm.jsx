import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import { format } from 'date-fns';

const MessageForm = ({ gameData }) => {
    const { id } = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { isAuthenticated, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false); // Stato per il caricamento

    // Funzione per caricare i messaggi e gli username
    const loadMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('Messages')
                .select('content, profile_id, profiles(username), created_at')
                .eq('game_id', gameData.id);

            if (error) {
                console.error('Errore nel recupero dei messaggi:', error);
            } else {
                setMessages(data);
            }
        } catch (error) {
            console.error('Errore di connessione al database Supabase:', error);
        }
    };

    useEffect(() => {
        if (gameData?.id) {
            loadMessages();
        }
    }, [gameData?.id]);

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Attiva stato di caricamento
        // Sanitize input: rimuovi eventuali tag HTML e caratteri indesiderati
        const sanitizedMessage = message.replace(/<[^>]*>/g, '').trim(); // Rimuove i tag HTML

        if (user && user.id && gameData?.id && sanitizedMessage) {
            const newMessage = {
                profile_id: user.id,
                content: sanitizedMessage,
                game_id: gameData.id,
            };

            try {
                const { data, error } = await supabase
                    .from('Messages')
                    .insert([newMessage]);

                if (error) {
                    console.error('Errore nell\'inserimento del messaggio:', error);
                } else {
                    loadMessages();
                    setMessage('');
                }
            } catch (error) {
                console.error('Errore di connessione al database Supabase:', error);
            } finally {
                setIsLoading(false); // Disattiva stato di caricamento
            }
        } else {
            console.log('Devi essere autenticato e il messaggio non può essere vuoto');
            setIsLoading(false);
        }
    };

    if (!isAuthenticated || !user) {
        return <p className="text-red-500">Per inviare un messaggio devi essere autenticato.</p>;
    }

    return (
        <section className="bg-slate-800 p-6 rounded-lg shadow-lg w-full mx-auto max-w-3xl">
            <h2 className="text-3xl font-semibold text-white mb-6">Commenti</h2>

            <form onSubmit={handleMessageSubmit} className="mb-6 space-y-4">
                <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                        Scrivi un commento
                    </label>
                    <textarea
                        id="message"
                        rows="4"
                        maxLength="150"
                        className="mt-1 block w-full px-3 py-2 bg-slate-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Scrivi il tuo commento..."
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                        {message.length}/150
                    </div>
                </div>
                <button
                    type="submit"
                    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Invio in corso...' : 'Invia messaggio'}
                </button>
            </form>

            {/* Elenco messaggi con scroll */}
            <ul className="space-y-4 max-h-72 overflow-y-auto dropdown-scroll">
                {messages
                    .slice()
                    .reverse() // Inverte l'ordine dei messaggi
                    .map((message, index) => (
                        <li key={index} className="bg-slate-700 p-4 rounded-lg shadow-md hover:bg-slate-600 transition-all">
                            <p className="text-gray-300">
                                <span className="font-semibold text-white">{message.profiles?.username || 'Anonimo'}:</span> <span className='message-content'>{message.content}</span>
                            </p>
                            {/* Aggiungi la data di creazione */}
                            <p className="text-xs text-gray-400 mt-2">
                                {message.created_at ? format(new Date(message.created_at), 'dd/MM/yyyy HH:mm') : 'Data non disponibile'}
                            </p>
                        </li>
                    ))}
            </ul>
        </section>
    );
};

export default MessageForm;
