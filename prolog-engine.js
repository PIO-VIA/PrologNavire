/**
 * MOTEUR PROLOG POUR SYSTÈME EXPERT
 * Planification et Arrivée du Navire - Port de Kribi
 * 
 * Ce fichier contient la logique Prolog simulée pour le système expert
 * de gestion logistique du terminal à conteneurs.
 */

class ModernPrologEngine {
    constructor() {
        this.facts = new Map();
        this.rules = [];
        this.initializeKnowledgeBase();
    }

    /**
     * Initialise la base de connaissances avec les faits et règles du port
     */
    initializeKnowledgeBase() {
        // ====================================
        // FAITS - Caractéristiques du Port de Kribi
        // ====================================
        
        // Quais disponibles
        this.addFact('quai', ['q1', 350, 'prioritaire']);
        this.addFact('quai', ['q2', 280, 'standard']);
        this.addFact('quai', ['q3', 200, 'standard']);
        
        // Ressources portuaires
        this.addFact('profondeur_maximum', [16]);
        this.addFact('portiques_disponibles', [4]);
        this.addFact('capacite_portique', [50]); // EVP par heure
        
        // Zones spécialisées
        this.addFact('zone_electrifiee', ['secteur_a']);
        this.addFact('zone_electrifiee', ['secteur_b']);

        // ====================================
        // RÈGLES D'INFÉRENCE PROLOG
        // ====================================
        
        // R1: Attribution du quai selon la longueur
        // assigner_quai(Navire, q1) :- longueur(Navire, L), L > 300.
        this.addRule('assigner_quai', (navire) => {
            const longueur = this.getFact('longueur', navire);
            if (longueur > 300) return 'q1';
            else if (longueur > 200) return 'q2';
            else return 'q3';
        });
        
        // R2: Vérification des chenaux pour tirant d'eau important
        // verifier_chenaux(Navire) :- tirant_eau(Navire, T), T > 15.
        this.addRule('verifier_chenaux', (navire) => {
            const tirant = this.getFact('tirant_eau', navire);
            return tirant > 15;
        });
        
        // R3: Nombre de portiques requis selon le volume
        // portiques_requis(Navire, P) :- conteneurs(Navire, C), C > 3000, P is min(3, ceil(C/1500)).
        this.addRule('portiques_requis', (navire) => {
            const conteneurs = this.getFact('conteneurs', navire);
            if (conteneurs > 3000) {
                return Math.min(3, Math.ceil(conteneurs / 1500));
            }
            return 1;
        });
        
        // R4: Zone électrifiée pour marchandises réfrigérées
        // zone_electrifiee_requise(Navire) :- type_cargo(Navire, refrigeree).
        this.addRule('zone_electrifiee_requise', (navire) => {
            const typeCargo = this.getFact('type_cargo', navire);
            return typeCargo === 'refrigeree';
        });
        
        // R5: Report d'accostage en cas de météo défavorable
        // reporter_accostage(Navire) :- meteo(Navire, defavorable).
        this.addRule('reporter_accostage', (navire) => {
            const meteo = this.getFact('meteo', navire);
            return meteo === 'defavorable';
        });
        
        // R6: Sécurité renforcée pour marchandises dangereuses
        // securite_renforcee(Navire) :- type_cargo(Navire, dangereuse).
        this.addRule('securite_renforcee', (navire) => {
            const typeCargo = this.getFact('type_cargo', navire);
            return typeCargo === 'dangereuse';
        });

        // Règles dérivées pour l'analyse complète
        this.addRule('duree_dechargement', (navire) => {
            const conteneurs = this.getFact('conteneurs', navire);
            const portiques = this.query('portiques_requis', navire);
            const capacite = this.getFact('capacite_portique');
            return Math.ceil(conteneurs / (portiques * capacite));
        });

        this.addRule('accostage_autorise', (navire) => {
            const reporter = this.query('reporter_accostage', navire);
            const tirant = this.getFact('tirant_eau', navire);
            const profondeurMax = this.getFact('profondeur_maximum');
            const longueur = this.getFact('longueur', navire);
            const quai = this.query('assigner_quai', navire);
            const quaiLongueur = this.getQuaiLongueur(quai);
            
            return !reporter && 
                   tirant <= profondeurMax && 
                   longueur <= quaiLongueur;
        });
    }

    /**
     * Ajoute un fait à la base de connaissances
     * @param {string} predicate - Le prédicat (nom du fait)
     * @param {Array} args - Les arguments du fait
     */
    addFact(predicate, args) {
        if (!this.facts.has(predicate)) {
            this.facts.set(predicate, []);
        }
        this.facts.get(predicate).push(args);
    }

    /**
     * Ajoute une règle à la base de connaissances
     * @param {string} predicate - Le nom de la règle
     * @param {Function} func - La fonction d'évaluation de la règle
     */
    addRule(predicate, func) {
        this.rules.push({ predicate, func });
    }

    /**
     * Récupère un fait de la base de connaissances
     * @param {string} predicate - Le prédicat recherché
     * @param {*} arg - L'argument optionnel pour filtrer
     * @returns {*} - La valeur du fait ou null
     */
    getFact(predicate, arg = null) {
        const facts = this.facts.get(predicate);
        if (!facts) return null;
        
        if (arg === null) {
            return facts[0] ? facts[0][0] : null;
        }
        
        const fact = facts.find(f => f[0] === arg);
        return fact ? fact[1] : null;
    }

    /**
     * Exécute une requête (règle) sur un navire
     * @param {string} predicate - Le nom de la règle
     * @param {string} navire - L'identifiant du navire
     * @returns {*} - Le résultat de la règle
     */
    query(predicate, navire) {
        const rule = this.rules.find(r => r.predicate === predicate);
        if (rule) {
            return rule.func(navire);
        }
        return null;
    }

    /**
     * Ajoute les faits d'un navire à la base de connaissances
     * @param {string} navire - L'identifiant du navire
     * @param {Object} data - Les données du navire
     */
    assertFacts(navire, data) {
        this.addFact('longueur', [navire, data.longueur]);
        this.addFact('tirant_eau', [navire, data.tirant]);
        this.addFact('conteneurs', [navire, data.conteneurs]);
        this.addFact('type_cargo', [navire, data.cargo]);
        this.addFact('meteo', [navire, data.meteo]);
    }

    /**
     * Utilitaire pour récupérer la longueur d'un quai
     * @param {string} quai - L'identifiant du quai
     * @returns {number} - La longueur du quai
     */
    getQuaiLongueur(quai) {
        const quais = this.facts.get('quai');
        const quaiInfo = quais.find(q => q[0] === quai);
        return quaiInfo ? quaiInfo[1] : 0;
    }

    /**
     * Exécute une analyse complète d'un navire
     * @param {string} navire - L'identifiant du navire
     * @returns {Object} - Résultats complets de l'analyse
     */
    analyseComplete(navire) {
        return {
            quai: this.query('assigner_quai', navire),
            chenaux: this.query('verifier_chenaux', navire),
            portiques: this.query('portiques_requis', navire),
            electrifiee: this.query('zone_electrifiee_requise', navire),
            reporter: this.query('reporter_accostage', navire),
            securite: this.query('securite_renforcee', navire),
            duree: this.query('duree_dechargement', navire),
            autorise: this.query('accostage_autorise', navire)
        };
    }

    /**
     * Génère les requêtes Prolog formatées pour l'affichage
     * @param {string} navire - L'identifiant du navire
     * @returns {Array} - Liste des requêtes formatées
     */
    generatePrologQueries(navire) {
        const queries = [];
        const results = this.analyseComplete(navire);

        // Requêtes principales
        queries.push({
            query: `?- assigner_quai(${navire}, Quai).`,
            result: `Quai = ${results.quai.toUpperCase()}`,
            type: 'value'
        });

        queries.push({
            query: `?- verifier_chenaux(${navire}).`,
            result: results.chenaux ? 'true' : 'false',
            type: results.chenaux ? 'warning' : 'success'
        });

        queries.push({
            query: `?- portiques_requis(${navire}, P).`,
            result: `P = ${results.portiques}`,
            type: 'value'
        });

        queries.push({
            query: `?- zone_electrifiee_requise(${navire}).`,
            result: results.electrifiee ? 'true' : 'false',
            type: results.electrifiee ? 'success' : 'false'
        });

        queries.push({
            query: `?- reporter_accostage(${navire}).`,
            result: results.reporter ? 'true' : 'false',
            type: results.reporter ? 'warning' : 'success'
        });

        queries.push({
            query: `?- securite_renforcee(${navire}).`,
            result: results.securite ? 'true' : 'false',
            type: results.securite ? 'warning' : 'false'
        });

        queries.push({
            query: `?- duree_dechargement(${navire}, Duree).`,
            result: `Duree = ${results.duree} heures`,
            type: 'value'
        });

        queries.push({
            query: `?- accostage_autorise(${navire}).`,
            result: results.autorise ? 'true' : 'false',
            type: results.autorise ? 'success' : 'danger'
        });

        return queries;
    }

    /**
     * Réinitialise les faits d'un navire spécifique
     * @param {string} navire - L'identifiant du navire
     */
    clearNavireFacts(navire) {
        const predicates = ['longueur', 'tirant_eau', 'conteneurs', 'type_cargo', 'meteo'];
        predicates.forEach(predicate => {
            const facts = this.facts.get(predicate);
            if (facts) {
                this.facts.set(predicate, facts.filter(f => f[0] !== navire));
            }
        });
    }
}

// Export pour utilisation dans d'autres fichiers
// (Commenté car nous sommes dans un environnement navigateur)
// module.exports = ModernPrologEngine;