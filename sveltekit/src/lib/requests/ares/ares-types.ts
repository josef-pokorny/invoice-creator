export interface IGovEkonomickeSubjektyReturn {
    ico: string;
    obchodniJmeno: string;
    sidlo: {
        kodStatu: string;
        nazevStatu: string;
        kodKraje: number;
        nazevKraje: string;
        kodOkresu: number;
        nazevOkresu: string;
        kodObce: number;
        nazevObce: string;
        kodSpravnihoObvodu: number;
        nazevSpravnihoObvodu: string;
        kodMestskehoObvodu: number;
        nazevMestskehoObvodu: string;
        kodMestskeCastiObvodu: number;
        kodUlice: number;
        nazevMestskeCastiObvodu: string;
        nazevUlice: string;
        cisloDomovni: number;
        doplnekAdresy: string;
        kodCastiObce: number;
        cisloOrientacni: number;
        cisloOrientacniPismeno: string;
        nazevCastiObce: string;
        kodAdresnihoMista: number;
        psc: 0;
        textovaAdresa: string;
        cisloDoAdresy: string;
        standardizaceAdresy: true;
        pscTxt: string;
        typCisloDomovni: number;
    };
    pravniForma: "393";
    financniUrad: "550";
    datumVzniku: string;
    datumZaniku: string;
    datumAktualizace: string;
    dic: string;
    icoId: "ARES_69625608";
    adresaDorucovaci: {
        radekAdresy1: string;
        radekAdresy2: string;
        radekAdresy3: string;
    };
    seznamRegistraci: {
        stavZdrojeVr: string;
        stavZdrojeRes: string;
        stavZdrojeRzp: string;
        stavZdrojeNrpzs: string;
        stavZdrojeRpsh: string;
        stavZdrojeRcns: string;
        stavZdrojeSzr: string;
        stavZdrojeDph: string;
        stavZdrojeSd: string;
        stavZdrojeIr: string;
        stavZdrojeCeu: string;
        stavZdrojeRs: string;
        stavZdrojeRed: string;
        stavZdrojeMonitor: string;
    };
    primarniZdroj: string;
    dalsiUdaje: [
        {
            obchodniJmeno: [
                {
                    platnostOd: string;
                    platnostDo: string;
                    obchodniJmeno: string;
                    primarniZaznam: true;
                },
            ];
            sidlo: [
                {
                    sidlo: {
                        kodStatu: string;
                        nazevStatu: string;
                        kodKraje: number;
                        nazevKraje: string;
                        kodOkresu: number;
                        nazevOkresu: string;
                        kodObce: number;
                        nazevObce: string;
                        kodSpravnihoObvodu: number;
                        nazevSpravnihoObvodu: string;
                        kodMestskehoObvodu: number;
                        nazevMestskehoObvodu: string;
                        kodMestskeCastiObvodu: number;
                        kodUlice: number;
                        nazevMestskeCastiObvodu: string;
                        nazevUlice: string;
                        cisloDomovni: number;
                        doplnekAdresy: string;
                        kodCastiObce: number;
                        cisloOrientacni: number;
                        cisloOrientacniPismeno: string;
                        nazevCastiObce: string;
                        kodAdresnihoMista: number;
                        psc: number;
                        textovaAdresa: string;
                        cisloDoAdresy: string;
                        standardizaceAdresy: true;
                        pscTxt: string;
                        typCisloDomovni: number;
                    };
                    primarniZaznam: true;
                    platnostOd: string;
                    platnostDo: string;
                },
            ];
            pravniForma: string;
            spisovaZnacka: string;
            datovyZdroj: string;
        },
    ];
    czNace: string[];
    subRegistrSzr: string;
    dicSkDph: string;
}

export interface IGovError {
    kod: string;
    popis: string;
    subKod: string;
}
