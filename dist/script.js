document.getElementById('indemniteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const salaire = parseFloat(document.getElementById('salaire').value);
    const dateEmbauche = new Date(document.getElementById('dateEmbauche').value);
    const dateRupture = new Date(document.getElementById('dateRupture').value);
    const categorie = document.getElementById('categorie').value;
    const tempsPartiel = document.getElementById('tempsPartiel').value ? parseFloat(document.getElementById('tempsPartiel').value) / 100 : 1;

    const mensualite = salaire * 12 / 13;
    const ancienneteTotal = (dateRupture - dateEmbauche) / (1000 * 60 * 60 * 24 * 365.25);
    const ancienneteAvant2002 = Math.max(0, Math.min(ancienneteTotal, (new Date('2002-01-01') - dateEmbauche) / (1000 * 60 * 60 * 24 * 365.25)));
    const ancienneteApres2002 = Math.max(0, ancienneteTotal - ancienneteAvant2002);

    const semestreAvant2002 = Math.floor(ancienneteAvant2002 * 2);
    const semestreApres2002 = Math.floor(ancienneteApres2002 * 2);

    let indemnite = (semestreAvant2002 * 0.5 * (13/14.5) + semestreApres2002 * 0.2) * mensualite;

    // Application du plafond
    let plafond;
    if (dateEmbauche <= new Date('1999-12-31')) {
        plafond = categorie === 'cadre' ? 24 * (13/14.5) * mensualite : 18 * (13/14.5) * mensualite;
    } else {
        plafond = 15 * mensualite;
    }

    indemnite = Math.min(indemnite, plafond);

    // Ajustement pour le temps partiel
    indemnite *= tempsPartiel;

    document.getElementById('resultat').innerHTML = `
        <h2>Résultat du calcul</h2>
        <p>Indemnité de licenciement : ${indemnite.toFixed(2)} €</p>
        <p>Détails du calcul :</p>
        <ul>
            <li>Mensualité de base : ${mensualite.toFixed(2)} €</li>
            <li>Ancienneté totale : ${ancienneteTotal.toFixed(2)} ans</li>
            <li>Ancienneté avant 2002 : ${ancienneteAvant2002.toFixed(2)} ans</li>
            <li>Ancienneté après 2002 : ${ancienneteApres2002.toFixed(2)} ans</li>
            <li>Semestres avant 2002 : ${semestreAvant2002}</li>
            <li>Semestres après 2002 : ${semestreApres2002}</li>
            <li>Plafond appliqué : ${plafond.toFixed(2)} €</li>
            <li>Coefficient temps partiel : ${tempsPartiel}</li>
        </ul>
    `;
});