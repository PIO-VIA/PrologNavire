# 🚢 Système Expert Prolog - Port de Kribi


![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Prolog](https://img.shields.io/badge/Prolog-Expert%20System-red.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![License](https://img.shields.io/badge/license-Academic-green.svg)

**Intelligence Artificielle pour la Planification Portuaire**

[🚀 Demo Live](https://prolog-navire.vercel.app/) 

---

## 📋 Description

Ce projet implémente un **système expert basé sur Prolog** pour automatiser la planification et la gestion de l'arrivée des navires au **Port Autonome de Kribi** (Cameroun). Le système simule le processus de décision des experts portuaires en appliquant des règles logiques pour optimiser l'attribution des ressources et garantir la sécurité des opérations.

### 🎯 Objectifs
- ✅ **Automatiser** l'analyse et la planification de l'accostage des navires
- ✅ **Optimiser** l'attribution des quais et des ressources portuaires  
- ✅ **Garantir** la sécurité selon les contraintes physiques et météorologiques
- ✅ **Démontrer** l'application pratique de l'IA en logistique portuaire

## 🛠️ Technologies Utilisées


| Technologie | Usage | Version |
|-------------|-------|---------|
| 🧠 **Prolog** | Logique d'inférence | Simulé |
| ⚡ **JavaScript** | Moteur d'exécution | ES6+ |
| 🎨 **CSS3** | Design moderne | - |
| 📱 **HTML5** | Interface utilisateur | - |
| 🚀 **Responsive** | Multi-plateforme | - |


## ⚡ Installation

### Prérequis
- 🌐 Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- 📁 Aucune installation supplémentaire requise

### 🚀 Installation Rapide

```bash
# Cloner le repository
git clone https://github.com/votre-username/systeme-expert-kribi.git

# Aller dans le dossier
cd systeme-expert-kribi

# Ouvrir dans le navigateur
open index.html
# ou double-cliquer sur index.html
```

### 📁 Structure du Projet

```
systeme-expert-kribi/
├──  index.html              # Page d'accueil avec présentation
├──  page.html               # Système expert principal
├──  styles.css               # Styles et design moderne
├──  prolog-engine.js          # Moteur Prolog et base de connaissances
├──  main.js                   # Interface JavaScript et interactions
└──  README.md                # Documentation (ce fichier)
```

## 🎯 Fonctionnalités

### 🧠 Intelligence Artificielle
- **Moteur d'inférence Prolog** simulé en JavaScript
- **Base de connaissances** avec faits et règles du port
- **Raisonnement automatique** selon 6 règles expertes (R1-R6)

### ⚓ Gestion Portuaire
- **Attribution automatique des quais** selon la taille du navire
- **Calcul intelligent des portiques** nécessaires
- **Estimation des durées** de déchargement
- **Vérification des contraintes** de sécurité

### 🛡️ Sécurité et Contraintes
- **Vérification tirant d'eau** vs profondeur maximum
- **Contrôle météorologique** (report si défavorable)
- **Gestion marchandises dangereuses** (procédures spéciales)
- **Zones électrifiées** pour marchandises réfrigérées

### 🎨 Interface Moderne
- **Design responsive** pour mobile et desktop
- **Menu hamburger** sur mobile
- **Animations fluides** et effets visuels
- **Requêtes Prolog** affichées en temps réel

## 🧠 Règles d'Inférence Prolog

Le système expert implémente 6 règles principales :

### R1 : Attribution du Quai
```prolog
assigner_quai(Navire, q1) :- longueur(Navire, L), L > 300.
assigner_quai(Navire, q2) :- longueur(Navire, L), L =< 300, L > 200.
assigner_quai(Navire, q3) :- longueur(Navire, L), L =< 200.
```

### R2 : Vérification des Chenaux
```prolog
verifier_chenaux(Navire) :- tirant_eau(Navire, T), T > 15.
```

### R3 : Portiques Requis
```prolog
portiques_requis(Navire, P) :- 
    conteneurs(Navire, C), C > 3000, 
    P is min(3, ceil(C/1500)).
```

### R4 : Zone Électrifiée
```prolog
zone_electrifiee_requise(Navire) :- type_cargo(Navire, refrigeree).
```

### R5 : Report d'Accostage
```prolog
reporter_accostage(Navire) :- meteo(Navire, defavorable).
```

### R6 : Sécurité Renforcée
```prolog
securite_renforcee(Navire) :- type_cargo(Navire, dangereuse).
```

## 🚀 Utilisation

### 1. 🏠 Page d'Accueil
1. Ouvrez `index.html` dans votre navigateur
2. Explorez la présentation du projet
3. Cliquez sur **"🚀 Commencer l'Analyse"**

### 2. 🚢 Système Expert
1. Remplissez le formulaire avec les données du navire :
   - **Nom du navire**
   - **Longueur** (50-400m)
   - **Tirant d'eau** (5-20m)
   - **Nombre de conteneurs** (100-20000 EVP)
   - **Type de marchandise**
   - **Conditions météorologiques**

2. Cliquez sur **"🔍 EXÉCUTER L'ANALYSE PROLOG"**

3. Observez les résultats :
   - ✅ **Requêtes Prolog** exécutées en temps réel
   - 📊 **Décision d'accostage** (autorisé/refusé)
   - 🏗️ **Attribution des ressources** (quais, portiques)
   - ⚠️ **Recommandations spéciales** et alertes

## 📸 Aperçu

### 🏠 Page d'Accueil
- Design moderne avec gradients et animations
- Présentation complète du projet
- Navigation responsive avec menu hamburger

### 🚢 Système Expert
- Interface utilisateur intuitive
- Affichage des requêtes Prolog authentiques
- Résultats colorés selon le type (succès/erreur/info)
- Recommandations détaillées

## 📊 Exemples d'Utilisation

### Exemple 1 : Porte-conteneurs Standard ✅
```
Navire: MSC Kristina
Longueur: 320m
Conteneurs: 3500 EVP
Météo: Favorable

Résultat: ✅ ACCOSTAGE AUTORISÉ
- Quai Q1 (350m)
- 3 portiques requis
- Durée: 24 heures
```

### Exemple 2 : Conditions Défavorables ❌
```
Navire: Maersk Storm
Longueur: 280m
Météo: Défavorable

Résultat: ❌ ACCOSTAGE REFUSÉ
- Raison: Conditions météorologiques
- Action: Attendre amélioration
```

### Exemple 3 : Marchandise Spéciale ⚡
```
Navire: CMA CGM Ice
Cargo: Marchandise réfrigérée
Longueur: 250m

Résultat: ✅ ACCOSTAGE AUTORISÉ
- Quai Q2 (280m)
- Zone électrifiée requise (Secteur A/B)
```

## 🔧 Architecture Technique

### 🧠 ModernPrologEngine
```javascript
class ModernPrologEngine {
    constructor() {
        this.facts = new Map();     // Base de faits
        this.rules = [];            // Base de règles
    }
    
    // Méthodes principales
    addFact(predicate, args)        // Ajouter un fait
    addRule(predicate, func)        // Ajouter une règle
    query(predicate, navire)        // Exécuter une requête
    analyseComplete(navire)         // Analyse complète
}
```

### 📊 Base de Connaissances
- **Faits du Port** : Quais, portiques, profondeur maximum
- **Règles d'Inférence** : 6 règles expertes (R1-R6)
- **Moteur de Requêtes** : Exécution et formatage des résultats

## 🌟 Fonctionnalités Avancées

- 🎨 **Design Glassmorphism** avec effets de transparence
- 📱 **Menu hamburger responsive** pour mobile
- ⚡ **Animations fluides** et effets de transition
- 🔍 **Validation en temps réel** des formulaires
- 📊 **Visualisation des requêtes Prolog** authentiques
- 🎯 **Système de recommandations** intelligent

## 🚧 Améliorations Futures

- [ ] 🤖 Intégration avec des systèmes TOS réels
- [ ] 📈 Algorithmes d'optimisation avancés
- [ ] 🌐 API REST pour intégration externe
- [ ] 📊 Tableaux de bord analytiques
- [ ] 🔄 Base de données pour historique
- [ ] 🎯 Machine Learning pour prédictions



### 🎯 Objectifs Pédagogiques
- Modélisation de connaissances expertes
- Implémentation d'un moteur d'inférence
- Application de l'IA à des problèmes réels
- Développement d'interfaces modernes


## 🙏 Remerciements

- 🏫 **ENSP Yaoundé** pour le cadre pédagogique
- 🏭 **Port Autonome de Kribi** pour le contexte réel
- 👨‍🏫 **Équipe enseignante** pour l'encadrement
- 🌍 **Communauté open source** pour les technologies

## 📞 Contact

Pour toute question ou suggestion :

-  **Email** : [piodjiele@gmail.com]

---

