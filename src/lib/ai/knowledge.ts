export const NOTEBOOK_LM_RULES = `
GLOBAL ADS BRAIN & RULES:
=========================

[MODULE: ADS_LAYOUT_MAP]
1. MCC (Verwaltungskonto): Oberste Ebene für mehrere Konten. 
2. Einzelkonto: Währung/Zeitzone hier festgelegt (nicht mehr änderbar).
3. Conversions: Messung > Ziele.
4. Gebotsstrategien: Tools > Budgets und Gebote.
5. Standortoptionen: "Präsenz: Nutzer, die sich gerade in deiner Zielregion befinden" wählen, nicht "Interesse".
-------------------------

[MODULE: ADS_TECH_VALIDATION]
1. Responsive Suchanzeigen (RSA): 
   - Headlines: Max. 30 Zeichen. (Bis zu 15 Titel)
   - Descriptions: Max. 90 Zeichen. (Bis zu 4)
2. PMax:
   - Kurze Titel: Max. 30 Zeichen.
   - Lange Titel: Max. 90 Zeichen.
   - Bilder: Mindestens 1x Quer, 1x Quadrat, 1x Hochformat.
   - Video: Mindestens 1 Video erforderlich.
3. Editorial Standards:
   - KEINE wiederholten Satzzeichen ("!!!").
   - KEINE Gimmicky Capitalization ("G.R.A.T.I.S").
-------------------------

[MODULE: ADS_BRAIN]
1. Power Pair: Broad Match + Smart Bidding + RSAs.
2. Performance Max: Optimiert auf grenzwertigen ROI über alle Kanäle.
3. Struktur: Konsolidierte Struktur ist besser für KI-Lernen.
4. Lernphase: Neue PMax benötigen ca. 6 Wochen ohne große Änderungen.
-------------------------

[MODULE: ADS_ERROR_PROTOCOL]
1. AUTH_ERROR: Prüfe .env und 2FA in UI.
2. FEED_ERROR: Feeds verfallen nach 30 Tagen. Labels müssen exakt übereinstimmen.
3. DISAPPROVED: Meistens URL-Fehler, Editorial-Verstöße (Satzzeichen) oder Overlay-Text auf Bildern.
-------------------------

[MODULE: ADS_BRAND_VOICE]
1. Der Sucher: Lösungsorientiert, direkt.
2. RSA-Modular: Headlines dürfen nie voneinander abhängen (KI mischt wild).
3. Verbotene Wörter: "Klicke hier", Gimmick-Zeichen, "Revolutionär".
-------------------------

[MODULE: ADS_KPI_LOGIC]
1. Ad Strength: Mindestens "Durchschnittlich". Alles "Schlechte" ersetzen.
2. Status "Eingeschränkt durch Budget": Nicht blind erhöhen, ggf. tCPA senken oder Portfolio nutzen.
3. Schonfrist: Keine Beurteilung von PMax unter 6 Wochen.
-------------------------
`;

/**
 * Holt das "Global Brain" Wissen lokal ohne externe API-Calls.
 * Ersetzt den vorherigen Firestore-Fetch per Projektvorgabe.
 */
export async function getExpertKnowledge(): Promise<string> {
    return NOTEBOOK_LM_RULES;
}
