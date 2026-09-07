export interface SubjectCurriculum {
  name: string;
  category: 'Sciences & Mathématiques' | 'Technologies & Informatique' | 'Lettres & Langues' | 'Sciences Humaines & Sociales' | 'Arts & Développement';
  gradeLevels: {
    [grade: string]: string[];
  };
  defaultDuration?: string;
}

export const MINESEC_GRADE_LEVELS = [
  {
    cycle: 'Premier Cycle (BEPC / APC)',
    levels: [
      '6ème (Observation)',
      '5ème (Observation)',
      '4ème (Orientation)',
      '3ème (Prépa BEPC)',
    ],
  },
  {
    cycle: 'Second Cycle — Classes de Seconde',
    levels: [
      'Seconde A (Littéraire & Langues)',
      'Seconde C (Scientifique : Maths & Physique)',
      'Seconde SES (Sciences Économiques et Sociales)',
      'Seconde TI (Technologies de l\'Information)',
    ],
  },
  {
    cycle: 'Second Cycle — Classes de Première (Probatoire)',
    levels: [
      'Première A (Lettres & Philosophie)',
      'Première ABI (Bilingue)',
      'Première C (Mathématiques & Sciences Physiques)',
      'Première D (Sciences de la Nature & Chimie)',
      'Première TI (Technologies de l\'Information)',
      'Première SES (Sciences Éco & Sociales)',
    ],
  },
  {
    cycle: 'Second Cycle — Classes de Terminale (Baccalauréat)',
    levels: [
      'Terminale A4 (Lettres & Langues)',
      'Terminale ABI (Bilingue)',
      'Terminale C (Mathématiques & Physiques)',
      'Terminale D (SVT & Chimie)',
      'Terminale TI (Technologies de l\'Information)',
      'Terminale SES (Sciences Éco & Sociales)',
    ],
  },
];

export const MINESEC_STANDARD_DURATIONS = [
  { value: '1 heure', label: '1 heure — Évaluation formative / Début de séquence' },
  { value: '1h30', label: '1h30 — Évaluation séquentielle (Premier Cycle)' },
  { value: '2 heures', label: '2 heures — Évaluation Séquentielle / Harmonisée' },
  { value: '3 heures', label: '3 heures — Épreuve de Probatoire / Baccalauréat' },
  { value: '4 heures', label: '4 heures — Épreuve majeure (Maths C/D, Lettres A, etc.)' },
];

export const MINESEC_EVALUATION_PARADIGM = {
  title: 'Approche Par Compétences avec Entrée par les Situations de Vie (APC)',
  part1: 'Partie 1 : Évaluation des Ressources (Savoirs, Savoir-faire, Définitions, Procédures)',
  part2: 'Partie 2 : Évaluation des Compétences / Agir Compétent (Situation-Problème contextualisée de vie courante, Tâches 1, 2, 3)',
};

export const CURRICULUM_DATABASE: SubjectCurriculum[] = [
  // ==========================================
  // 1. SCIENCES & MATHÉMATIQUES
  // ==========================================
  {
    name: 'Mathématiques (MINESEC APC)',
    category: 'Sciences & Mathématiques',
    gradeLevels: {
      '6ème (Observation)': [
        'Travaux Numériques : Nombres entiers naturels, fractions décimales et opérations de base',
        'Travaux Numériques : Nombres décimaux arithmétiques, comparaison et proportionnalité (prix, pourcentages)',
        'Travaux Géométriques : Droites, segments, demi-droites et positions relatives (perpendiculaires, parallèles)',
        'Travaux Géométriques : Cercles, triangles, rectangles et calcul de périmètres et d\'aires',
        'Situation de vie : Gestion du budget familial et partage de parcelles de terrain',
      ],
      '5ème (Observation)': [
        'Travaux Numériques : Nombres décimaux relatifs, repérage et opérations (+, -)',
        'Travaux Numériques : Fractions, simplification et calculs de quotients',
        'Travaux Géométriques : Triangles, inégalité triangulaire et somme des angles',
        'Travaux Géométriques : Symétrie centrale, parallélogrammes et losanges',
        'Statistiques élémentaires : Tableaux d\'effectifs et diagrammes en bâtons',
        'Situation de vie : Aménagement d\'un espace vert et prévisions de récoltes',
      ],
      '4ème (Orientation)': [
        'Travaux Numériques : Nombres rationnels et puissances de 10 (notation scientifique)',
        'Travaux Numériques : Calcul littéral (développement, factorisation simple, équations du 1er degré)',
        'Travaux Géométriques : Théorème de Pythagore et calcul des longueurs dans le triangle rectangle',
        'Travaux Géométriques : Triangles rectangles et cercle circonscrit, cosinus d\'un angle aigu',
        'Statistiques : Moyenne pondérée et fréquences',
        'Situation de vie : Construction d\'une toiture et sécurisation d\'un bâtiment',
      ],
      '3ème (Prépa BEPC)': [
        'Travaux Numériques : Nombres réels, racines carrées et calculs avec radicaux',
        'Travaux Numériques : Équations et inéquations du 1er degré dans R, systèmes de 2 équations à 2 inconnues',
        'Travaux Numériques : Fonctions affines et fonctions linéaires (modélisation et lectures graphiques)',
        'Travaux Géométriques : Propriété de Thalès dans le triangle et applications',
        'Travaux Géométriques : Trigonométrie (sinus, cosinus, tangente) et relations métriques',
        'Travaux Géométriques : Vecteurs du plan, repérage orthonormé et distances',
        'Statistiques : Classes, médianes et diagrammes circulaires',
        'Situation de vie : Devis de construction, raccordement électrique et gestion de transport',
      ],
      'Seconde C (Scientifique : Maths & Physique)': [
        'Ensembles, logique mathématique et calcul dans R (intervalles, valeur absolue)',
        'Polynômes du second degré, factorisation et tableau de signes',
        'Fonctions numériques : Domaine de définition, parité, périodicité et variations',
        'Trigonométrie : Cercle trigonométrique, mesures en radians, cos(x) et sin(x)',
        'Géométrie vectorielle et barycentres de points pondérés',
        'Droites du plan, équations cartésiennes et produit scalaire',
        'Statistiques et probabilités élémentaires',
      ],
      'Seconde A (Littéraire & Langues)': [
        'Calculs numériques et algébriques : Pourcentages, indices et équations du premier degré',
        'Systèmes linéaires de 2 équations à 2 inconnues et applications économiques',
        'Fonctions numériques usuelles (affines, second degré simple) et interprétation de graphiques',
        'Statistiques descriptives : Séries statistiques, moyenne, médiane et écart-type',
      ],
      'Première C (Mathématiques & Sciences Physiques)': [
        'Barycentres de 2, 3 et 4 points dans le plan et l\'espace, lignes de niveau',
        'Trigonométrie circulaire : Formules d\'addition, de duplication et équations trigonométriques',
        'Produit scalaire dans le plan et configurations géométriques',
        'Limites de fonctions et continuité en un point',
        'Dérivation : Nombre dérivé, tangentes, règles de calcul et extrema locaux',
        'Étude complète et représentation graphique de fonctions rationnelles et irrationnelles',
        'Suites numériques : Suites arithmétiques, géométriques et limites de suites',
        'Dénombrement et combinatoire : Arrangements, permutations et combinaisons',
        'Transformations du plan : Homothéties, rotations et translations',
      ],
      'Première D (Sciences de la Nature & Chimie)': [
        'Équations et inéquations du second degré dans R, discriminant et somme/produit des racines',
        'Limites et continuité de fonctions numériques',
        'Dérivation de fonctions et applications à l\'étude des variations',
        'Fonctions rationnelles simples et lectures graphiques',
        'Statistiques à deux variables : Nuage de points, point moyen et droite d\'ajustement',
        'Dénombrement et calcul de probabilités simples',
        'Barycentres de points pondérés et applications',
      ],
      'Première A (Lettres & Philosophie)': [
        'Équations et systèmes linéaires appliqués à la gestion et au commerce',
        'Dérivation simple et tableau de variation de fonctions de degré 2 et 3',
        'Statistiques descriptives et probabilités dans la vie quotidienne',
        'Suites arithmétiques et calculs d\'intérêts simples/composés',
      ],
      'Première TI (Technologies de l\'Information)': [
        'Logique booléenne, tables de vérité et algèbre de Boole',
        'Arithmétique modulaire, systèmes de numération (Binaire, Hexadécimal) et conversion',
        'Suites numériques et modélisation algorithmique',
        'Fonctions numériques, limites, dérivées et applications graphiques',
        'Dénombrement, graphes et combinatoire pour l\'informatique',
      ],
      'Terminale C (Mathématiques & Physiques)': [
        'Arithmétique dans Z : Division euclidienne, PGCD, PPCM, algorithme d\'Euclide, théorème de Bézout et Gauss, congruences',
        'Nombres complexes : Forme algébrique, trigonométrique, exponentielle et applications à la géométrie (similitudes directes)',
        'Limites, continuité et Théorème des Valeurs Intermédiaires (TVI)',
        'Dérivation, convexité, fonctions réciproques et branches infinies',
        'Fonction logarithme népérien (ln) et fonction exponentielle népérienne (exp)',
        'Fonctions puissances et équations différentielles linéaires y\' + ay = 0 et y\'\' + w^2 y = 0',
        'Calcul intégral, primitives, intégration par parties et calcul d\'aires et volumes',
        'Suites numériques : Récurrence, suites adjacentes et théorème de convergence monotone',
        'Probabilités : Probabilités conditionnelles, variables aléatoires, loi binomiale et loi de Poisson',
        'Espaces vectoriels réels et applications linéaires (dimension finie, matrices)',
        'Géométrie de l\'espace : Droites, plans, produit scalaire et produit vectoriel',
      ],
      'Terminale D (SVT & Chimie)': [
        'Nombres complexes : Calculs sous forme algébrique et géométrique, résolution d\'équations du 2nd degré',
        'Fonctions logarithmes népériens (ln) et fonctions exponentielles (exp) : Étude et tracés',
        'Calcul intégral, primitives et calculs d\'aires',
        'Équations différentielles simples issues de la physique et de la biologie',
        'Suites numériques : Suites arithmétiques et géométriques, convergence',
        'Statistiques à deux variables : Ajustement linéaire (méthode des moindres carrés) et coefficient de corrélation linéaire',
        'Probabilités conditionnelles, variables aléatoires et loi binomiale',
      ],
      'Terminale A4 (Lettres & Langues)': [
        'Fonctions logarithmes népériens et exponentielles : Propriétés et lectures graphiques',
        'Calculs de taux d\'évolution, croissance exponentielle et applications socio-économiques',
        'Statistiques à une et deux variables : Séries chronologiques et prévisions',
        'Probabilités et arbres pondérés pour la prise de décision',
      ],
      'Terminale TI (Technologies de l\'Information)': [
        'Arithmétique et cryptographie : Congruences, chiffrement RSA et clés publiques/privées',
        'Nombres complexes et traitement numérique du signal',
        'Graphes et théorie des réseaux : Algorithmes de Dijkstra et de parcours',
        'Fonctions exponentielles, logarithmes et complexité algorithmique (grand O)',
        'Probabilités et variables aléatoires discrètes',
      ],
    },
    defaultDuration: '3 heures',
  },

  // ==========================================
  // 2. PHYSIQUE, CHIMIE & TECHNOLOGIE (PCT)
  // ==========================================
  {
    name: 'Physique, Chimie et Technologie (PCT / MINESEC)',
    category: 'Sciences & Mathématiques',
    gradeLevels: {
      '4ème (Orientation)': [
        'Chimie : Matière, molécules, atomes et symboles chimiques',
        'Chimie : L\'eau dans notre environnement, électrolyse et synthèse de l\'eau',
        'Chimie : Combustion du carbone, du méthane et du fer (notion de réaction chimique)',
        'Physique : Poids et masse d\'un corps (P = m x g)',
        'Physique : Énergie électrique, intensité, tension et loi d\'Ohm (U = R x I)',
        'Technologie : Schématisation de circuits électriques domestiques et sécurité',
      ],
      '3ème (Prépa BEPC)': [
        'Chimie : Solutions aqueuses acides et basiques, notion de pH et sécurité au laboratoire',
        'Chimie : Les métaux usuels (Fer, Aluminium, Cuivre, Zinc) et action des acides sur les métaux',
        'Chimie : Oxydoréduction par voie sèche et par voie humide',
        'Physique : Énergie mécanique : Énergie cinétique, énergie de position et conservation',
        'Physique : Travail et puissance mécanique d\'une force (W = F x L, P = W / t)',
        'Physique : Optique : Propagation rectiligne de la lumière, réflexion et réfraction',
        'Physique : Puissance et énergie électrique consommée (E = P x t, compteur électrique et facture ENEO)',
        'Technologie : Moteurs électriques simples et entretien des appareils',
      ],
      'Seconde C (Scientifique : Maths & Physique)': [
        'Chimie : Structure de l\'atome, classification périodique de Mendeleïev et liaisons chimiques',
        'Chimie : Quantité de matière, la mole (n = m/M, n = C x V) et concentration molaire',
        'Chimie : Équation-bilan d\'une réaction chimique et tableau d\'avancement',
        'Physique : Mouvements et forces : Vecteur vitesse, principe d\'inertie et équilibre d\'un solide',
        'Physique : Gravitation universelle et pesanteur',
        'Physique : Travail d\'une force constante et énergie cinétique',
        'Physique : Électrostatique : Loi de Coulomb et champ électrostatique',
        'Physique : Optique géométrique : Lois de Snell-Descartes et réflexion totale',
      ],
      'Première C (Mathématiques & Sciences Physiques)': [
        'Chimie : Chimie organique : Alcanes, alcènes, alcynes et réactions d\'addition/substitution',
        'Chimie : Alcools, aldéhydes, cétones, acides carboxyliques et dosage acido-basique',
        'Chimie : Oxydoréduction en solution aqueuse et potentiels d\'oxydoréduction',
        'Physique : Travail et puissance mécanique, théorème de l\'énergie cinétique (TEC)',
        'Physique : Énergie potentielle de pesanteur, énergie mécanique et forces conservatives/dissipatives',
        'Physique : Calorimétrie, transferts thermiques et changements d\'état',
        'Physique : Champ magnétique, force de Laplace et applications (moteurs, haut-parleurs)',
        'Physique : Induction électromagnétique, loi de Lenz-Faraday et auto-induction',
        'Physique : Lentilles minces convergentes et divergentes (formule de Descartes, grandissement)',
      ],
      'Première D (Sciences de la Nature & Chimie)': [
        'Chimie : Les hydrocarbures saturés et insaturés, formules semi-développées et isomérie',
        'Chimie : Composés oxygénés (alcools, aldéhydes, cétones, acides) et caractérisation',
        'Chimie : Dosage volumétrique acido-basique avec indicateurs colorés',
        'Physique : Énergie mécanique et théorème de l\'énergie cinétique',
        'Physique : Calorimétrie et échanges de chaleur',
        'Physique : Champ magnétique créé par les courants (solénoïde, fil rectiligne) et force de Laplace',
        'Physique : Optique : Les lentilles minces, l\'œil et les instruments d\'optique (loupe, microscope)',
      ],
      'Terminale C (Mathématiques & Physiques)': [
        'Chimie : Cinétique chimique : Facteurs cinétiques, vitesse de réaction et temps de demi-réaction',
        'Chimie : Équilibres chimiques : Constante d\'équilibre K, quotient de réaction Qr et loi de Le Chatelier',
        'Chimie : Acides forts, acides faibles, pKa, constante d\'acidité et solutions tampons',
        'Chimie : Estérification et hydrolyse des esters (cinétique et équilibre)',
        'Physique : Cinématique du point matériel : Vecteurs position, vitesse et accélération en coordonnées cartésiennes et polaires',
        'Physique : Dynamique : Les trois lois de Newton et mouvement dans un champ de pesanteur uniforme (balistique)',
        'Physique : Mouvement d\'une particule chargée dans un champ électrostatique et magnétique uniforme (spectrographe de masse, cyclotron)',
        'Physique : Mouvement des planètes et satellites : Lois de Kepler et vitesse de satellisation',
        'Physique : Systèmes oscillants mécaniques (pendule élastique, pendule pesant) et amortissement',
        'Physique : Circuits électriques oscillants RLC, résonance d\'intensité et impédance',
        'Physique : Ondes mécaniques progressives et ondes lumineuses (interférences et diffraction)',
        'Physique : Physique nucléaire : Radioactivité alpha, bêta, gamma, décroissance radioactive, défaut de masse et énergie de liaison',
      ],
      'Terminale D (SVT & Chimie)': [
        'Chimie : Cinétique chimique et catalyse',
        'Chimie : Solutions aqueuses acido-basiques, pH, produit ionique de l\'eau, pKa et dosage pH-métrique',
        'Chimie : Chimie organique : Esters, savons, amines et acides alpha-aminés',
        'Physique : Lois de Newton et mouvement des projectiles dans le champ de pesanteur',
        'Physique : Mouvement des satellites terrestres',
        'Physique : Mouvement de particules chargées dans les champs uniformes',
        'Physique : Circuits oscillants RLC et phénomènes d\'induction',
        'Physique : Radioactivité, réactions nucléaires de fission et fusion, et médecine nucléaire',
      ],
    },
    defaultDuration: '3 heures',
  },

  // ==========================================
  // 3. SCIENCES DE LA VIE ET DE LA TERRE (SVT)
  // ==========================================
  {
    name: 'Sciences de la Vie et de la Terre (SVT / MINESEC)',
    category: 'Sciences & Mathématiques',
    gradeLevels: {
      '6ème (Observation)': [
        'Le monde vivant : Les êtres vivants et leur environnement local au Cameroun',
        'Nutrition et régimes alimentaires des animaux et de l\'Homme',
        'Reproduction des plantes à fleurs et des animaux',
        'Hygiène et santé : Prévention du paludisme, de la fièvre typhoïde et des maladies diarrhéiques',
      ],
      '5ème (Observation)': [
        'Respiration et occupation des milieux de vie (terrestre, aquatique)',
        'La digestion chez l\'Homme et l\'absorption des nutriments',
        'La circulation sanguine et les appareils cardiovasculaires',
        'Géologie : Les roches sédimentaires, l\'érosion et la formation des paysages camerounais',
      ],
      '4ème (Orientation)': [
        'La reproduction humaine : Puberté, fonctionnement des appareils génitaux et contraception',
        'Géodynamique interne de la Terre : Séismes, volcanisme et tectonique des plaques',
        'Le volcanisme au Mont Cameroun et risques géologiques en Afrique centrale',
        'Le système nerveux : Organes de sens, transmission des messages nerveux et hygiène de vie',
      ],
      '3ème (Prépa BEPC)': [
        'Immunologie : Le système immunitaire, les microbes, la phagocytose, les anticorps et le VIH/SIDA',
        'Génétique humaine : Chromosomes, ADN, caryotype, transmission des caractères et anomalies chromosomiques',
        'Agronomie et environnement : Amélioration de la production végétale et animale au Cameroun',
        'Dégradation et protection des sols et des écosystèmes forestiers du bassin du Congo',
      ],
      'Seconde C (Scientifique : Maths & Physique)': [
        'La cellule : Unité structurale et fonctionnelle du vivant (microscopie, ultrastructure)',
        'La molécule d\'ADN et le code génétique',
        'Écologie : Flux de matière et d\'énergie dans les écosystèmes tropicaux',
        'Géodynamique externe : Altération des roches et formation des latérites',
      ],
      'Première D (Sciences de la Nature & Chimie)': [
        'La cellule et les échanges cellulaires : Osmose, diffusion libre et transport actif',
        'Les enzymes : Propriétés catalytiques et facteurs influençant la cinétique enzymatique',
        'La reproduction humaine : Gamétogenèse (spermatogenèse, ovogenèse), cycles sexuels féminins et régulation hormonale',
        'Immunologie : Réponse immunitaire innée et adaptative (lymphocytes T et B), coopération cellulaire',
        'Pétrologie magmatique et métamorphique : Cristallisation des magmas et structures',
      ],
      'Terminale D (SVT & Chimie)': [
        'Génétique mendélienne et moléculaire : Monohybridisme, dihybridisme, brassages inter et intrachromosomiques (crossing-over)',
        'Génétique humaine : Analyse des arbres généalogiques (pedigrees), transmission des maladies héréditaires (drépanocytose, hémophilie)',
        'Activité nerveuse et musculaire : Potentiel de repos, potentiel d\'action, transmission synaptique et contraction musculaire',
        'Nutrition carbonée : Photosynthèse, phase photochimique, cycle de Calvin et photorespiration',
        'Respiration cellulaire et fermentations : Glycolyse, cycle de Krebs, chaîne respiratoire et bilan énergétique en ATP',
        'Géologie historique et stratigraphie : Datation relative, fossiles stratigraphiques et crise biologique Crétacé-Paléogène',
        'Tectonique globale : Marqueurs de la subduction, de la collision continentale et orogenèses',
      ],
      'Terminale C (Mathématiques & Physiques)': [
        'Génétique moléculaire, réplication, transcription et traduction de l\'ADN',
        'Énergétique cellulaire : Métabolisme de l\'ATP',
        'Le système immunitaire et la réponse immunitaire humorale et cellulaire',
        'Tectonique des plaques et dynamique des fonds océaniques',
      ],
    },
    defaultDuration: '3 heures',
  },

  // ==========================================
  // 4. INFORMATIQUE & TIC (MINESEC)
  // ==========================================
  {
    name: 'Informatique (MINESEC TIC & TI)',
    category: 'Technologies & Informatique',
    gradeLevels: {
      '6ème (Observation)': [
        'Découverte de l\'ordinateur : Unité centrale, périphériques d\'entrée et de sortie',
        'Le système d\'exploitation : Bureau, fenêtres, dossiers et fichiers',
        'Initiation au traitement de texte (saisie, mise en forme, sauvegarde)',
        'Notions de base sur Internet et sécurité informatique élémentaire',
      ],
      '5ème (Observation)': [
        'Organisation et gestion des données dans un support de stockage',
        'Traitement de texte avancé : Tableaux, images, mise en page',
        'Présentation assistée par ordinateur (PAO / Diaporama)',
        'Navigation Web, recherche documentaire et courriers électroniques',
      ],
      '4ème (Orientation)': [
        'Le tableur : Interface, saisie de données, formules simples (+, -, *, /) et fonctions (SOMME, MOYENNE)',
        'Représentation de l\'information : Le codage binaire, octets et multiples',
        'Initiation aux algorithmes : Notion d\'instructions séquentielles et organigrammes',
        'Sécurité et éthique sur les réseaux sociaux au Cameroun',
      ],
      '3ème (Prépa BEPC)': [
        'Architecture matérielle : Carte mère, processeur (CPU), mémoires (RAM, ROM), bus',
        'Algorithmique de base : Variables, types de données, structures alternatives (Si...Alors...Sinon) et itératives (Pour, Tant que)',
        'Réseaux informatiques : Définition, typologie (LAN, MAN, WAN), topologie (étoile, bus, anneau) et équipements (Switch, Routeur)',
        'Maintenance de premier niveau : Antivirus, défragmentation, nettoyage disque',
        'Production de documents numériques complexes (Tableur avec graphiques et publipostage)',
      ],
      'Seconde TI (Technologies de l\'Information)': [
        'Systèmes de numération : Binaire, Octal, Décimal, Hexadécimal et conversions',
        'Algorithmique : Démarche de résolution d\'un problème, structures de contrôle et tableaux à une dimension',
        'Initiation à la programmation en langage C ou Python',
        'Architecture des ordinateurs et installation de systèmes d\'exploitation',
        'Bases de la création de pages Web statiques en HTML5 et CSS3',
      ],
      'Première TI (Technologies de l\'Information)': [
        'Algorithmique avancée : Sous-programmes (fonctions et procédures), passage de paramètres',
        'Programmation en langage C : Tableaux, chaînes de caractères et pointeurs',
        'Développement Web : JavaScript côté client et formulaires interactifs',
        'Bases de données relationnelles : Modèle Entité-Association (MCD) et schéma relationnel (MLD)',
        'Réseaux informatiques : Modèle OSI, modèle TCP/IP, adressage IPv4 et masques de sous-réseau',
      ],
      'Terminale TI (Technologies de l\'Information)': [
        'Structures de données dynamiques : Piles, files et listes simplement/doublement chaînées',
        'Bases de données relationnelles et requêtes SQL complètes (DDL, DML, DQL : SELECT avec jointures, GROUP BY, INSERT, UPDATE, DELETE)',
        'Développement Web dynamique : PHP et interaction avec bases de données MySQL',
        'Programmation Orientée Objet (POO) : Classes, objets, encapsulation, héritage et polymorphisme',
        'Sécurité des systèmes et réseaux : Cryptographie, pare-feu, attaques courantes et cybercriminalité (législation camerounaise)',
        'Gestion de projet informatique : Cahier des charges et diagrammes UML (Cas d\'utilisation, Classes, Séquences)',
      ],
      'Terminale A4 (Lettres & Langues)': [
        'Bureautique avancée et traitement collaboratif de documents',
        'Recherche experte d\'information, vérification des sources et fake news',
        'Protection des données personnelles et identité numérique',
      ],
      'Terminale C / D (Scientifique)': [
        'Algorithmique et modélisation en Python : Fonctions, listes, boucles et calcul numérique',
        'Bases de données et requêtes SQL d\'interrogation',
        'Réseaux locaux, protocoles Internet et sécurité des données',
      ],
    },
    defaultDuration: '2 heures',
  },

  // ==========================================
  // 5. FRANÇAIS & LETTRES (MINESEC)
  // ==========================================
  {
    name: 'Français (MINESEC APC)',
    category: 'Lettres & Langues',
    gradeLevels: {
      '6ème (Observation)': [
        'Grammaire : Les classes grammaticales (noms, déterminants, adjectifs, pronoms)',
        'Grammaire : La phrase simple, phrase verbale et non verbale, types et formes de phrases',
        'Conjugaison : Le présent, le passé composé, l\'imparfait et le futur simple de l\'indicatif',
        'Orthographe : Accords dans le groupe nominal, accord sujet-verbe',
        'Lecture méthodique : Récits africains, contes, fables et mythes',
        'Production d\'écrits : Rédiger un texte narratif simple ou un dialogue',
      ],
      '5ème (Observation)': [
        'Grammaire : Les expansions du nom (adjectif épithète, complément du nom, proposition subordonnée relative)',
        'Conjugaison : Le passé simple et l\'imparfait dans le récit',
        'Vocabulaire : Synonymes, antonymes, polysémie et champs lexicaux',
        'Lecture méthodique : Le roman d\'aventures et la description de portraits et de paysages',
        'Production d\'écrits : Récit intégrant des passages descriptifs et dialogues',
      ],
      '4ème (Orientation)': [
        'Grammaire : Les propositions subordonnées complétives et circonstancielles (temps, cause, conséquence)',
        'Conjugaison : Le conditionnel présent, le subjonctif présent et la concordance des temps',
        'Figures de style : Métaphore, comparaison, personnification, anaphore, hyperbole',
        'Lecture méthodique : Le théâtre (comédie et tragédie) et la poésie lyrique',
        'Production d\'écrits : Rédiger une lettre ouverte ou un texte explicatif/argumentatif',
      ],
      '3ème (Prépa BEPC)': [
        'Texte d\'étude : Lecture suivie et dirigée d\'œuvres africaines et universelles au programme',
        'Questions de compréhension : Thème, thèse, tonalités (pathétique, satirique, lyrique) et visée de l\'auteur',
        'Maniement de la langue : Analyse logique de phrases complexes, voix passive, discours direct/indirect',
        'Dictée et questions d\'orthographe grammaticale',
        'Sujet de rédaction (APC) : Essai argumentatif ou sujet d\'imagination contextualisé (Situation de vie)',
      ],
      'Seconde A (Littéraire & Langues)': [
        'Initiation aux genres littéraires : Le roman, la poésie, le théâtre et l\'essai',
        'Méthodologie du Commentaire composé : Lecture linéaire, repérage des axes de lecture et rédaction',
        'Méthodologie de la Dissertation littéraire : Analyse du sujet, problématique et plan dialectique',
        'Étude d\'œuvres intégrales camerounaises et francophones',
      ],
      'Première A (Lettres & Philosophie)': [
        'Le théâtre négro-africain et le théâtre classique : Fonctions esthétiques, politiques et cathartiques',
        'La poésie négro-africaine (la Négritude) et la poésie moderne : Césaire, Senghor, Damas, etc.',
        'Pratique de l\'épreuve de Français au Probatoire : Contraction de texte & Discussion, Commentaire composé, Dissertation',
        'Maniement de la langue : Énonciation, polyphonie, connecteurs logiques et argumentation',
      ],
      'Terminale A4 (Lettres & Langues)': [
        'Le roman africain francophone contemporain : Thèmes de la désillusion, de l\'immigration, du pouvoir et de la condition féminine',
        'La littérature universelle et comparée : Grands courants littéraires (Romantisme, Réalisme, Existentialisme)',
        'Méthodologie experte de la Dissertation littéraire et du Commentaire composé au Baccalauréat',
        'Contraction de texte et synthèse de documents d\'actualité',
      ],
    },
    defaultDuration: '3 heures',
  },

  // ==========================================
  // 6. PHILOSOPHIE (MINESEC)
  // ==========================================
  {
    name: 'Philosophie (MINESEC)',
    category: 'Lettres & Langues',
    gradeLevels: {
      'Terminale A4 (Lettres & Langues)': [
        'L\'homme et le monde : Nature et culture, la conscience, l\'inconscient et le désir',
        'La connaissance et la vérité : Langage, raison, vérité, science et méthode',
        'L\'action humaine et les valeurs : Liberté, devoir moral, justice, droit et bonheur',
        'La politique et la société : L\'État, le pouvoir, la démocratie, la paix et la citoyenneté en Afrique',
        'La philosophie africaine : Débats sur l\'existence, les tendances (ethnophilosophie, critique, idéologique, herméneutique) et les défis de l\'émancipation',
        'Méthodologie du Baccalauréat : Dissertation philosophique (type I & II) et Commentaire de texte philosophique',
      ],
      'Terminale C / D / TI (Scientifique & Technique)': [
        'La science et la technique : Objectivité scientifique, hypothèses, expérimentation, limites éthiques et bioéthique',
        'L\'État, le pouvoir et la liberté individuelle',
        'La philosophie africaine et le développement scientifique et technologique de l\'Afrique',
        'Méthodologie de la Dissertation philosophique et de l\'Explication de texte philosophique pour scientifiques',
      ],
      'Première A (Lettres & Philosophie)': [
        'Initiation à la pensée philosophique : Origines de la philosophie, mythe et raison',
        'Les grandes figures de la philosophie antique et moderne (Socrate, Platon, Descartes, Kant)',
        'La logique formelle : Notions de concept, jugement, raisonnement et syllogisme',
      ],
    },
    defaultDuration: '4 heures',
  },

  // ==========================================
  // 7. HISTOIRE - GÉOGRAPHIE - CITOYENNETÉ (ECM)
  // ==========================================
  {
    name: 'Histoire - Géographie - ECM (MINESEC)',
    category: 'Sciences Humaines & Sociales',
    gradeLevels: {
      '6ème (Observation)': [
        'Histoire : Les sources de l\'Histoire, la Préhistoire et les débuts de l\'Humanité en Afrique',
        'Histoire : L\'Égypte antique : Civilisation, religion, architecture et héritage',
        'Géographie : La Terre dans l\'Univers, forme, dimensions et mouvements de la Terre',
        'Géographie : Les reliefs, les climats et les grands paysages du globe',
        'ECM : La famille, l\'école, l\'état civil et le respect des biens publics au Cameroun',
      ],
      '5ème (Observation)': [
        'Histoire : Les grands empires médiévaux africains (Ghana, Mali, Songhaï, Kanem-Bornou)',
        'Histoire : Les contacts de l\'Afrique avec le monde arabo-musulman et l\'Europe',
        'Géographie : L\'Afrique physique : Reliefs, hydrographie, climats et végétation',
        'Géographie : La population africaine : Dynamique démographique et répartition',
        'ECM : La commune, la municipalité, l\'hygiène et la salubrité publique au Cameroun',
      ],
      '4ème (Orientation)': [
        'Histoire : La traite négrière atlantique et ses conséquences démographiques et économiques pour l\'Afrique',
        'Histoire : Les révolutions du XVIIIe siècle et les explorations européennes en Afrique',
        'Géographie : Les activités économiques en Afrique : Agriculture, élevage, mines et industrie',
        'ECM : Les institutions démocratiques du Cameroun, la Constitution et les symboles nationaux (Drapeau, Hymne, Devise)',
      ],
      '3ème (Prépa BEPC)': [
        'Histoire : L\'impérialisme européen et la colonisation de l\'Afrique (Conférence de Berlin 1884-1885)',
        'Histoire : Le Cameroun sous protectorat allemand (1884-1916) et la Première Guerre mondiale',
        'Histoire : Le Cameroun sous mandat puis tutelle franco-britannique (1916-1960)',
        'Histoire : La Seconde Guerre mondiale et l\'éveil du nationalisme africain (UPC et figures historiques : Ruben Um Nyobè, etc.)',
        'Géographie : Le Cameroun : Milieu physique (reliefs, climats, végétation, hydrographie)',
        'Géographie : La population et l\'urbanisation au Cameroun (Douala, Yaoundé, villes secondaires)',
        'ECM : Les droits de l\'Homme, la lutte contre la corruption, l\'intégration nationale et le vivre-ensemble',
      ],
      'Première A / C / D (Probatoire)': [
        'Histoire : L\'entre-deux-guerres, la crise de 1929 et la montée des totalitarismes',
        'Histoire : La Seconde Guerre mondiale : Causes, déroulement et conséquences géopolitiques',
        'Histoire : L\'accès du Cameroun à l\'indépendance et à la réunification (1960-1961)',
        'Géographie : Les grands ensembles biogéographiques du monde',
        'Géographie : L\'agriculture camerounaise : Systèmes traditionnels, plantations agro-industrielles et sécurité alimentaire',
        'ECM : Le système électoral au Cameroun (ELECAM), la décentralisation et les collectivités territoriales',
      ],
      'Terminale A4 / C / D (Baccalauréat)': [
        'Histoire : La Guerre froide : Affrontements Est-Ouest, crises majeures (Berlin, Cuba, Vietnam) et chute du mur de Berlin',
        'Histoire : La décolonisation en Asie et en Afrique (guerres de libération, panafricanisme)',
        'Histoire : Le Cameroun de 1960 à nos jours : Construction de l\'État unitaire, multipartisme et défis contemporains',
        'Géographie : La mondialisation et les flux économiques mondiaux',
        'Géographie : Les puissances économiques : États-Unis, Union Européenne, Chine et pays émergents',
        'Géographie : Le Cameroun dans son espace sous-régional (CEMAC) et ses atouts de développement',
        'ECM : La citoyenneté responsable, la gouvernance démocratique, la préservation de la paix et le règlement des conflits',
      ],
    },
    defaultDuration: '2 heures',
  },

  // ==========================================
  // 8. ANGLAIS (MINESEC BILINGUISME)
  // ==========================================
  {
    name: 'Anglais / English Language (MINESEC)',
    category: 'Lettres & Langues',
    gradeLevels: {
      '6ème (Observation)': [
        'Module 1: Personal Identification, Family and Daily Routine in Cameroon',
        'Module 2: School Life, Classroom Objects and Friends',
        'Grammar & Vocabulary: Simple Present, pronouns, possessive adjectives, numbers',
        'Reading comprehension & Short guided writing (Introduction of oneself)',
      ],
      '3ème (Prépa BEPC)': [
        'Module 1: Health, Hygiene, Pandemics (Malaria, Cholera) and Healthy Living',
        'Module 2: Technology, Mobile Phones and Media in Modern Life',
        'Grammar: Present Perfect vs Simple Past, passive voice, modal verbs, conditionals (Type 1 & 2)',
        'Reading Comprehension & Composition (Formal/Informal letter, dialogue, narrative essay)',
      ],
      'Première A / C / D (Probatoire)': [
        'Module 1: Citizenship, Human Rights, Gender Equality and Youth Empowerment',
        'Module 2: Environmental Protection, Climate Change and Deforestation in Central Africa',
        'Grammar & Vocabulary: Reported Speech, Relative Clauses, Phrasal verbs, Connectors',
        'Reading Comprehension & Essay Writing (Argumentative essay, Speech, Article)',
      ],
      'Terminale A4 / C / D / TI (Baccalauréat)': [
        'Module 1: Science, Technological Innovations, Artificial Intelligence and Ethics',
        'Module 2: Globalization, Economic Integration, Unemployment and Entrepreneurship in Africa',
        'Module 3: Culture, Heritage, National Integration and Peaceful Coexistence',
        'Grammar: Advanced Conditionals (Type 3 & Inversion), Gerunds and Infinitives, Complex structures',
        'Section 1: Grammar & Vocabulary (Cloze text, Transformations)',
        'Section 2: Reading Comprehension on Current Socio-Economic Issues',
        'Section 3: Essay Writing with Strict Word Count and Structural Guidelines',
      ],
    },
    defaultDuration: '2 heures',
  },

  // ==========================================
  // 9. SCIENCES ÉCONOMIQUES & SOCIALES (SES)
  // ==========================================
  {
    name: 'Sciences Économiques et Sociales (SES / Économie)',
    category: 'Sciences Humaines & Sociales',
    gradeLevels: {
      'Seconde SES (Sciences Économiques et Sociales)': [
        'La production et la combinaison des facteurs de production (travail, capital)',
        'Les revenus, la consommation et l\'épargne des ménages',
        'Les marchés, la formation des prix et la monnaie',
      ],
      'Première SES (Sciences Éco & Sociales)': [
        'Le fonctionnement des marchés concurrentiels et imparfaits (monopoles, oligopoles)',
        'La création monétaire, le rôle des banques commerciales et de la BEAC',
        'La socialisation, les groupes sociaux et la stratification sociale',
        'La protection sociale et la gestion des risques au Cameroun',
      ],
      'Terminale SES (Sciences Éco & Sociales)': [
        'La croissance économique, le PIB et les facteurs de développement en Afrique',
        'L\'inflation, le chômage et les politiques économiques conjoncturelles et structurelles',
        'Le commerce international, la balance des paiements et le rôle de la zone Franc (FCFA)',
        'La mondialisation financière et les stratégies de développement du Cameroun (SND30)',
      ],
    },
    defaultDuration: '3 heures',
  },

  // ==========================================
  // 10. ESPAGNOL & ALLEMAND (LV2)
  // ==========================================
  {
    name: 'Langue Vivante 2 : Espagnol (MINESEC)',
    category: 'Lettres & Langues',
    gradeLevels: {
      '4ème (Orientation)': [
        'Unidad 1: Presentación personal, el alfabeto, números y saludos',
        'Unidad 2: La familia, la casa y la descripción física/carácter',
        'Gramática: Verbos SER, ESTAR, TENER, presente de indicativo regular',
      ],
      '3ème (Prépa BEPC)': [
        'Unidad 1: La vida cotidiana, la escuela y la alimentación',
        'Unidad 2: Fiestas, tradiciones del mundo hispánico y de Camerún',
        'Gramática: Pretérito indefinido, pretérito perfecto, perífrasis verbales (IR A + infinitivo)',
      ],
      'Première A (Lettres & Philosophie)': [
        'Tema 1: Juventud, educación y nuevas tecnologías',
        'Tema 2: El medio ambiente y la conservación de la naturaleza',
        'Comprensión de lectura, gramática, traducción (versión) y expresión escrita',
      ],
      'Terminale A4 (Lettres & Langues)': [
        'Tema 1: Problemas socioeconómicos del mundo contemporáneo (pobreza, emigración)',
        'Tema 2: Literatura hispánica e hispanoamericana (García Márquez, Cervantes)',
        'Épreuve type Baccalauréat : Texte d\'étude, questions, grammaire et expression écrite',
      ],
    },
    defaultDuration: '2 heures',
  },
  {
    name: 'Langue Vivante 2 : Allemand (MINESEC)',
    category: 'Lettres & Langues',
    gradeLevels: {
      '4ème (Orientation)': [
        'Thema 1: Sich vorstellen, Begrüßungen, Zahlen und das Alphabet',
        'Thema 2: Meine Familie, mein Haus und meine Hobbys',
        'Grammatik: Präsens regelmäßiger und unregelmäßiger Verben, die Artikel (der, die, das)',
      ],
      '3ème (Prépa BEPC)': [
        'Thema 1: In der Schule, der Tagesablauf und Mahlzeiten',
        'Thema 2: Gesundheit, Sport und Freizeitaktivitäten in Kamerun und Deutschland',
        'Grammatik: Perfekt, Modalverben (können, müssen, wollen), Akkusativ und Dativ',
      ],
      'Première A (Lettres & Philosophie)': [
        'Thema 1: Jugend, Ausbildung und Berufe der Zukunft',
        'Thema 2: Umwelt, Natur und Reisen',
        'Textverständnis, Grammatikübungen und Aufsatz',
      ],
      'Terminale A4 (Lettres & Langues)': [
        'Thema 1: Gesellschaftliche Herausforderungen, Migration und Globalisierung',
        'Thema 2: Kultur, deutsch-kamerunische Partnerschaft und Literatur',
        'Baccalauréat-Prüfung : Leseverstehen, Grammatik und schriftlicher Ausdruck',
      ],
    },
    defaultDuration: '2 heures',
  },
];

export function getCurriculumBySubject(subjectName: string): SubjectCurriculum | undefined {
  if (!subjectName) return undefined;
  const clean = subjectName.toLowerCase().trim();
  return CURRICULUM_DATABASE.find(
    (c) => c.name.toLowerCase().includes(clean) || clean.includes(c.name.toLowerCase().split(' ')[0])
  );
}

export function getChapterSuggestions(subjectName: string, gradeLevel: string): string[] {
  const curriculum = getCurriculumBySubject(subjectName);
  if (!curriculum) return [];

  // Exact match
  if (curriculum.gradeLevels[gradeLevel]) {
    return curriculum.gradeLevels[gradeLevel];
  }

  // Partial match on grade level
  const matchedKey = Object.keys(curriculum.gradeLevels).find(
    (k) => gradeLevel.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(gradeLevel.toLowerCase())
  );

  if (matchedKey) {
    return curriculum.gradeLevels[matchedKey];
  }

  // Fallback: search key matching cycle (e.g. "3ème", "Terminale", "6ème")
  const shortLevel = gradeLevel.split(' ')[0];
  const shortMatch = Object.keys(curriculum.gradeLevels).find((k) => k.startsWith(shortLevel));
  if (shortMatch) {
    return curriculum.gradeLevels[shortMatch];
  }

  // Flattened
  return Object.values(curriculum.gradeLevels).flat();
}
