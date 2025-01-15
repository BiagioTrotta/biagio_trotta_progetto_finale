# Proposta di Consegna

## Descrizione
Ho sviluppato una piattaforma che consente agli utenti di scoprire e gestire giochi preferiti. Gli utenti possono sfogliare una lista di giochi, visualizzarne i dettagli, registrarsi e creare una lista personalizzata di giochi preferiti. Il progetto utilizza React, Supabase per l'autenticazione e il backend, e Tailwind CSS per lo stile.

## API
Ho utilizzato le seguenti API:
- **RAWG API**: [https://api.rawg.io](https://api.rawg.io) (per recuperare i dettagli dei giochi).
- **Supabase**: [https://supabase.com](https://supabase.com) (per autenticazione e gestione del backend).

## Stile
Ho utilizzato **Tailwind CSS** per garantire uno stile moderno e responsivo.

## Pagine
1. **Home Page**: Elenco dei giochi con funzionalità di ricerca e filtro.
2. **Pagina Dettaglio Gioco**: Informazioni dettagliate su un gioco selezionato.
3. **Pagina Registrazione/Login**: Permette agli utenti di registrarsi e accedere.
4. **Pagina Preferiti**: Mostra la lista personalizzata di giochi preferiti per un utente autenticato.

## User Interactions
### Utente non autenticato:
1. Può scorrere tra la lista dei giochi disponibili.
2. Può filtrare i giochi per nome o genere.
3. Può visualizzare i dettagli dei giochi.
4. Può registrarsi e accedere alla piattaforma.


### Utente autenticato:
1. Può aggiungere giochi alla lista dei preferiti.
2. Può rimuovere giochi dalla lista dei preferiti.
3. Può accedere alla pagina "Preferiti" per gestire la propria lista personalizzata.
4. Può visualizzare la propria pagina "Profilo".
5. Può inviare e ricevere messaggi attraverso la funzionalità di chat in tempo reale.

## Context
Ho definito i seguenti dati nel contesto dell'applicazione:
1. **AuthContext**:
   - Gestisce l'autenticazione degli utenti utilizzando Supabase.
   - Include informazioni sull'utente autenticato, funzioni di login/logout e registrazione.

## Deployment
L'applicazione non è ancora stata pubblicata.
