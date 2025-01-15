// Funzione per formattare la data
export default function FormatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', options);
};
