import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        avatar_url: '',
    });
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    const placeholderAvatar = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';

    useEffect(() => {
        const session = supabase.auth.getSession();
        session
            .then(({ data: { session } }) => {
                if (!session) {
                    navigate('/');
                } else {
                    setUser(session.user);
                }
            })
            .catch((error) => {
                console.error('Errore durante il recupero della sessione:', error);
                navigate('/');
            });
    }, [navigate]);

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Errore durante il caricamento del profilo:', error);
                } else {
                    setFormData({
                        username: data.username || '',
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        avatar_url: data.avatar_url || '',
                    });
                }
                setLoading(false);
            };

            fetchProfile();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        const { error } = await supabase
            .from('profiles')
            .update({
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name,
                avatar_url: formData.avatar_url,
            })
            .eq('id', user.id);

        if (error) {
            toast.error('Errore durante l\'aggiornamento del profilo');
            console.error('Errore durante l\'aggiornamento del profilo:', error);
        } else {
            toast.success('Profilo aggiornato con successo!');
        }

        setIsUpdating(false);
    };

    if (loading) {
        return <p className="text-center text-gray-500">Caricamento in corso...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Profilo</h1>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
                <img
                    src={formData.avatar_url || placeholderAvatar}
                    alt="User avatar"
                    className="w-32 h-32 rounded-full border border-gray-300 shadow-md"
                />
                <p className="text-sm text-gray-600 mt-2">
                    {formData.avatar_url ? 'Avatar personale' : 'Avatar di default'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Username:
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Nome:
                    </label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Cognome:
                    </label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Avatar URL:
                    </label>
                    <input
                        type="text"
                        name="avatar_url"
                        value={formData.avatar_url}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isUpdating}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                              ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {isUpdating ? 'Salvataggio...' : 'Salva'}
                </button>
            </form>

            {/* Toast Container */}
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
}
