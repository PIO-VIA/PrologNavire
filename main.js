/**
 * INTERFACE PRINCIPALE DU SYSTÈME EXPERT
 * Gestion des interactions utilisateur et affichage des résultats
 * 
 * Ce fichier contient toute la logique d'interface utilisateur
 * et les fonctions de formatage des résultats Prolog.
 */

// Instance globale du moteur Prolog
let prologEngine;


document.addEventListener('DOMContentLoaded', function() {
    console.log('🚢 Système Expert Prolog initialisé');
    
    prologEngine = new ModernPrologEngine();
    
    initializeAnimations();
    
    setupEventListeners();
    
    console.log('📚 Base de connaissances chargée');
    console.log('✅ Système prêt à analyser les navires');
});

/**
 * Configure les animations d'entrée
 */
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.animated');
    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
        }, index * 200);
    });
}

/**
 * Configure les écouteurs d'événements
 */
function setupEventListeners() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', validateInput);
        input.addEventListener('input', validateInput);
    });
}

/**
 * Valide un champ de saisie
 * @param {Event} event - L'événement de changement
 */
function validateInput(event) {
    const input = event.target;
    const value = input.value;
    
    switch(input.id) {
        case 'shipLength':
            validateNumericRange(input, 50, 400, 'Longueur doit être entre 50 et 400 mètres');
            break;
        case 'shipDraft':
            validateNumericRange(input, 5, 20, 'Tirant d\'eau doit être entre 5 et 20 mètres');
            break;
        case 'containerCount':
            validateNumericRange(input, 100, 20000, 'Nombre de conteneurs doit être entre 100 et 20000');
            break;
        case 'shipName':
            validateRequired(input, 'Le nom du navire est requis');
            break;
    }
}

/**
 * Valide qu'un champ numérique est dans une plage
 * @param {HTMLElement} input - L'élément input
 * @param {number} min - Valeur minimum
 * @param {number} max - Valeur maximum
 * @param {string} message - Message d'erreur
 */
function validateNumericRange(input, min, max, message) {
    const value = parseFloat(input.value);
    if (value < min || value > max) {
        input.style.borderColor = '#dc3545';
        input.title = message;
    } else {
        input.style.borderColor = '#28a745';
        input.title = '';
    }
}

/**
 * Valide qu'un champ requis est rempli
 * @param {HTMLElement} input - L'élément input
 * @param {string} message - Message d'erreur
 */
function validateRequired(input, message) {
    if (!input.value.trim()) {
        input.style.borderColor = '#dc3545';
        input.title = message;
    } else {
        input.style.borderColor = '#28a745';
        input.title = '';
    }
}

/**
 * FONCTION PRINCIPALE - Exécute l'analyse Prolog
 * Cette fonction est appelée par le bouton dans l'interface
 */
function executerRequeteProlog() {
    console.log('🔍 Début de l\'analyse Prolog...');
    
    // Récupérer et valider les données du formulaire
    const donneesNavire = collecterDonneesFormulaire();
    if (!donneesNavire) {
        return; 
    }
    
    // Préparer l'identifiant du navire pour Prolog
    const navireId = donneesNavire.nom.toLowerCase().replace(/\s+/g, '_');
    
    // Nettoyer les anciens faits du navire
    prologEngine.clearNavireFacts(navireId);
    
    prologEngine.assertFacts(navireId, donneesNavire);
    
    const resultatsAnalyse = prologEngine.analyseComplete(navireId);
    const requetesProlog = prologEngine.generatePrologQueries(navireId);
    
    afficherResultatsAnalyse(donneesNavire, navireId, resultatsAnalyse, requetesProlog);
    
    console.log('✅ Analyse terminée');
}

/**
 * Collecte et valide les données du formulaire
 * @returns {Object|null} - Les données du navire ou null si erreur
 */
function collecterDonneesFormulaire() {
    const donnees = {
        nom: document.getElementById('shipName').value.trim(),
        longueur: parseInt(document.getElementById('shipLength').value),
        tirant: parseFloat(document.getElementById('shipDraft').value),
        conteneurs: parseInt(document.getElementById('containerCount').value),
        cargo: document.getElementById('cargoType').value,
        meteo: document.getElementById('weather').value
    };
    
    // Validation des données
    if (!donnees.nom) {
        afficherErreur('⚠️ Le nom du navire est requis !');
        return null;
    }
    
    if (isNaN(donnees.longueur) || donnees.longueur < 50 || donnees.longueur > 400) {
        afficherErreur('⚠️ La longueur doit être entre 50 et 400 mètres !');
        return null;
    }
    
    if (isNaN(donnees.tirant) || donnees.tirant < 5 || donnees.tirant > 20) {
        afficherErreur('⚠️ Le tirant d\'eau doit être entre 5 et 20 mètres !');
        return null;
    }
    
    if (isNaN(donnees.conteneurs) || donnees.conteneurs < 100 || donnees.conteneurs > 20000) {
        afficherErreur('⚠️ Le nombre de conteneurs doit être entre 100 et 20000 !');
        return null;
    }
    
    return donnees;
}

/**
 * Affiche un message d'erreur
 * @param {string} message - Le message à afficher
 */
function afficherErreur(message) {
    alert(message);
    console.error(message);
}

/**
 * Affiche les résultats complets de l'analyse
 * @param {Object} donneesNavire - Les données originales du navire
 * @param {string} navireId - L'identifiant Prolog du navire
 * @param {Object} resultats - Les résultats de l'analyse
 * @param {Array} requetes - Les requêtes Prolog formatées
 */
function afficherResultatsAnalyse(donneesNavire, navireId, resultats, requetes) {
    let contenuHTML = '';
    
    // En-tête avec informations du navire
    contenuHTML += genererEnTeteNavire(donneesNavire);
    
    // Section assertion des faits
    contenuHTML += genererSectionAssertions(navireId, donneesNavire);
    
    // Section exécution des règles
    contenuHTML += genererSectionRegles(requetes);
    
    // Analyse finale et recommandations
    contenuHTML += genererAnalyseFinale(donneesNavire, resultats);
    
    // Afficher le contenu et faire défiler vers les résultats
    document.getElementById('contenuResultats').innerHTML = contenuHTML;
    document.getElementById('resultats').classList.remove('hidden');
    document.getElementById('resultats').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Génère l'en-tête avec les informations du navire
 * @param {Object} donnees - Les données du navire
 * @returns {string} - Le HTML généré
 */
function genererEnTeteNavire(donnees) {
    return `
        <div class="analysis-card">
            <h3>🚢 Analyse du navire: ${donnees.nom}</h3>
            <p><strong>Spécifications:</strong> ${donnees.longueur}m × ${donnees.tirant}m de tirant d'eau × ${donnees.conteneurs} EVP</p>
            <p><strong>Type de cargaison:</strong> ${formaterTypeCargo(donnees.cargo)}</p>
            <p><strong>Conditions météo:</strong> ${formaterMeteo(donnees.meteo)}</p>
        </div>
    `;
}

/**
 * Génère la section d'assertion des faits
 * @param {string} navireId - L'identifiant du navire
 * @param {Object} donnees - Les données du navire
 * @returns {string} - Le HTML généré
 */
function genererSectionAssertions(navireId, donnees) {
    return `
        <div class="query-section">
            <div class="query-header">
                📋 Assertion des faits dans la base de connaissances
            </div>
            <div class="query-item">
                <div class="query-text">?- assert(longueur(${navireId}, ${donnees.longueur})).</div>
                <div class="result-true">✅ true.</div>
            </div>
            <div class="query-item">
                <div class="query-text">?- assert(tirant_eau(${navireId}, ${donnees.tirant})).</div>
                <div class="result-true">✅ true.</div>
            </div>
            <div class="query-item">
                <div class="query-text">?- assert(conteneurs(${navireId}, ${donnees.conteneurs})).</div>
                <div class="result-true">✅ true.</div>
            </div>
            <div class="query-item">
                <div class="query-text">?- assert(type_cargo(${navireId}, ${donnees.cargo})).</div>
                <div class="result-true">✅ true.</div>
            </div>
            <div class="query-item">
                <div class="query-text">?- assert(meteo(${navireId}, ${donnees.meteo})).</div>
                <div class="result-true">✅ true.</div>
            </div>
        </div>
    `;
}

/**
 * Génère la section d'exécution des règles
 * @param {Array} requetes - Les requêtes Prolog
 * @returns {string} - Le HTML généré
 */
function genererSectionRegles(requetes) {
    let html = `
        <div class="query-section">
            <div class="query-header">
                ⚡ Exécution des règles d'inférence
            </div>
    `;
    
    requetes.forEach(requete => {
        const classeCSS = determinerClasseResultat(requete.type);
        const icone = determinerIconeResultat(requete.type, requete.result);
        
        html += `
            <div class="query-item">
                <div class="query-text">${requete.query}</div>
                <div class="${classeCSS}">
                    ${icone} ${requete.result}
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

/**
 * Génère l'analyse finale avec recommandations
 * @param {Object} donnees - Les données du navire
 * @param {Object} resultats - Les résultats de l'analyse
 * @returns {string} - Le HTML généré
 */
function genererAnalyseFinale(donnees, resultats) {
    let html = '';
    
    // Décision finale
    if (resultats.autorise) {
        html += genererCarteSucces(donnees, resultats);
    } else {
        html += genererCarteEchec(donnees, resultats);
    }
    
    // Recommandations spéciales
    if (resultats.electrifiee) {
        html += genererRecommandationElectrique();
    }
    
    if (resultats.securite) {
        html += genererRecommandationSecurite();
    }
    
    return html;
}

/**
 * Génère une carte de succès pour l'accostage autorisé
 * @param {Object} donnees - Les données du navire
 * @param {Object} resultats - Les résultats
 * @returns {string} - Le HTML généré
 */
function genererCarteSucces(donnees, resultats) {
    const quaiLongueur = prologEngine.getQuaiLongueur(resultats.quai);
    
    return `
        <div class="analysis-card">
            <h3>✅ DÉCISION FINALE: ACCOSTAGE AUTORISÉ</h3>
            <p><strong>Quai assigné:</strong> ${resultats.quai.toUpperCase()} (${quaiLongueur}m)</p>
            <p><strong>Portiques alloués:</strong> ${resultats.portiques} sur 4 disponibles</p>
            <p><strong>Durée estimée:</strong> ${resultats.duree} heures</p>
            <p><strong>Capacité traitement:</strong> ${resultats.portiques * 50} EVP/heure</p>
            <p><strong>Taux d'utilisation:</strong> ${Math.round((resultats.portiques/4)*100)}% des portiques</p>
        </div>
    `;
}

/**
 * Génère une carte d'échec pour l'accostage refusé
 * @param {Object} donnees - Les données du navire
 * @param {Object} resultats - Les résultats
 * @returns {string} - Le HTML généré
 */
function genererCarteEchec(donnees, resultats) {
    let html = `
        <div class="warning-card">
            <h3>❌ DÉCISION FINALE: ACCOSTAGE REFUSÉ</h3>
            <p><strong>Raisons du refus:</strong></p>
            <ul>
    `;
    
    if (resultats.reporter) {
        html += `<li>Conditions météorologiques défavorables</li>`;
    }
    
    const profondeurMax = prologEngine.getFact('profondeur_maximum');
    if (donnees.tirant > profondeurMax) {
        html += `<li>Tirant d'eau trop important (${donnees.tirant}m > ${profondeurMax}m)</li>`;
    }
    
    const quaiLongueur = prologEngine.getQuaiLongueur(resultats.quai);
    if (donnees.longueur > quaiLongueur) {
        html += `<li>Navire trop long pour le quai assigné (${donnees.longueur}m > ${quaiLongueur}m)</li>`;
    }
    
    html += `
            </ul>
            <p><strong>Actions recommandées:</strong> Attendre l'amélioration des conditions ou modifier les spécifications.</p>
        </div>
    `;
    
    return html;
}

/**
 * Génère une recommandation pour zone électrifiée
 * @returns {string} - Le HTML généré
 */
function genererRecommandationElectrique() {
    return `
        <div class="info-card">
            <h3>⚡ RECOMMANDATION SPÉCIALE</h3>
            <p><strong>Marchandise réfrigérée détectée</strong></p>
            <p>Attribution zone électrifiée requise (Secteur A ou B)</p>
            <p>Vérifier la disponibilité des prises électriques et la capacité du réseau.</p>
        </div>
    `;
}

/**
 * Génère une recommandation de sécurité
 * @returns {string} - Le HTML généré
 */
function genererRecommandationSecurite() {
    return `
        <div class="warning-card">
            <h3>🚨 PROCÉDURES DE SÉCURITÉ RENFORCÉES</h3>
            <p><strong>Marchandise dangereuse détectée</strong></p>
            <p>Activation obligatoire des protocoles suivants :</p>
            <ul>
                <li>Notification immédiate des autorités portuaires</li>
                <li>Équipes de sécurité spécialisées sur site</li>
                <li>Vérification des certificats de conformité</li>
                <li>Procédures d'urgence en standby</li>
            </ul>
        </div>
    `;
}

/**
 * FONCTIONS UTILITAIRES
 */

/**
 * Détermine la classe CSS selon le type de résultat
 * @param {string} type - Le type de résultat
 * @returns {string} - La classe CSS
 */
function determinerClasseResultat(type) {
    switch(type) {
        case 'success': return 'result-true';
        case 'warning': return 'result-true';
        case 'danger': return 'result-false';
        case 'false': return 'result-false';
        case 'value': return 'result-value';
        default: return 'result-value';
    }
}

/**
 * Détermine l'icône selon le type et résultat
 * @param {string} type - Le type de résultat
 * @param {string} result - Le résultat
 * @returns {string} - L'icône appropriée
 */
function determinerIconeResultat(type, result) {
    if (result.includes('true')) {
        return type === 'warning' ? '⚠️' : '✅';
    }
    if (result.includes('false')) {
        return type === 'danger' ? '❌' : '✅';
    }
    if (result.includes('q1') || result.includes('Q1')) return '📍';
    if (result.includes('q2') || result.includes('Q2')) return '📍';
    if (result.includes('q3') || result.includes('Q3')) return '📍';
    if (result.includes('portiques')) return '🏗️';
    if (result.includes('heures')) return '⏱️';
    return 'ℹ️';
}

/**
 * Formate le type de cargo pour l'affichage
 * @param {string} cargo - Le type de cargo
 * @returns {string} - Le type formaté
 */
function formaterTypeCargo(cargo) {
    const types = {
        'generale': 'Marchandise générale',
        'refrigeree': 'Marchandise réfrigérée ❄️',
        'dangereuse': 'Marchandise dangereuse ⚠️',
        'mixte': 'Cargaison mixte'
    };
    return types[cargo] || cargo;
}

/**
 * Formate la météo pour l'affichage
 * @param {string} meteo - Les conditions météo
 * @returns {string} - La météo formatée
 */
function formaterMeteo(meteo) {
    const conditions = {
        'favorable': 'Favorable ☀️',
        'moyenne': 'Moyenne ⛅',
        'defavorable': 'Défavorable 🌧️'
    };
    return conditions[meteo] || meteo;
}

// Log de fin de chargement
console.log('📋 Interface principale chargée');
console.log('🎯 Prêt pour l\'analyse des navires');