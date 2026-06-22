export type RuoloAziendale = 'Med' | 'Inf' | 'Amm'

export interface Personale{
    id: string;
    
    anagrafica: {
    nome: string;
    cognome: string;
    dataNascita: string;
    codiceFiscale: string;
    sesso: string;
    };
    
    registrazione: {
        username: string;
        password: string;
        occupazione: RuoloAziendale;
    };


}