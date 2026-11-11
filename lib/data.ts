export const subjectData = [
  {
    name: "Commerce",
    code: "COM",
    color: "#FF6B6B",
    progress: 45,
    topics: 18,
    icon: "briefcase",
  },
  {
    name: "Agricultural Science",
    code: "AGRIC",
    color: "#4CAF50",
    progress: 60,
    topics: 22,
    icon: "bulb",
  },
  {
    name: "Biology",
    code: "BIO",
    color: "#8B5CF6",
    progress: 55,
    topics: 36,
    icon: "sparkles",
  },
  {
    name: "Chemistry",
    code: "CHE",
    color: "#10B981",
    progress: 78,
    topics: 28,
    icon: "target",
  },
  {
    name: "Christain Religious Studies",
    code: "CRS",
    color: "#FF9800",
    progress: 40,
    topics: 20,
    icon: "book",
  },
  {
    name: "Economics",
    code: "ECO",
    color: "#9C27B0",
    progress: 52,
    topics: 25,
    icon: "briefcase",
  },
  {
    name: "Government",
    code: "GOV",
    color: "#2196F3",
    progress: 48,
    topics: 30,
    icon: "university",
  },
  {
    name: "Geography",
    code: "GEO",
    color: "#00BCD4",
    progress: 58,
    topics: 32,
    icon: "school",
  },
  {
    name: "Physics",
    code: "PHY",
    color: "#3E6AE1",
    progress: 65,
    topics: 24,
    icon: "lightning",
  },
  {
    name: "Use of English",
    code: "ENG",
    color: "#F44336",
    progress: 85,
    topics: 40,
    icon: "book",
  },
  {
    name: "Principle of Account",
    code: "ACCT",
    color: "#607D8B",
    progress: 38,
    topics: 26,
    icon: "briefcase",
  },
  {
    name: "Mathematics",
    code: "MATH",
    color: "#FF4D4D",
    progress: 42,
    topics: 32,
    icon: "target",
  },
  {
    name: "Literature In English",
    code: "LIT",
    color: "#E91E63",
    progress: 70,
    topics: 35,
    icon: "book",
  },
];

interface SyllabusTopic {
  Topic: string;
  subTopic: string[];
}

type syllabusListType = {
  [key: string]: SyllabusTopic[];  
};


export const syllabusList: syllabusListType = {
  COM: [],
  AGRIC: [],
  BIO: [],
  CHE: [
    {
      Topic: "Separation of Mixtures and Purification of Chemical Substances",
      subTopic: [
        "Elements, compounds and mixtures",
        "Chemical and physical changes",
        "Pure and impure substances",
        "Boiling, density, freezing and melting points",
        "Separation processes: Evaporation, simple and fractional distillation, sublimation, re-crystallization, paper and column chromatography, simple and fractional crystallization, magnetization, decantation, filtration and centrifugation",
      ],
    },
    {
      Topic: "Chemical Combination",
      subTopic: [
        "Laws of definite, multiple and reciprocal proportions",
        "Law of conservation of matter",
        "Chemical symbols, formulae, equations and their uses",
        "Relative atomic mass based on 12C=12",
        "The mole concept and stoichiometry of reactions",
      ],
    },
    {
      Topic: "Kinetic Theory of Matter and Gas Laws",
      subTopic: [
        "Phenomena to support the kinetic theory of matter using melting, vapourization, boiling, freezing, condensation",
        "The laws of Boyle, Charles, Avogadro, Gay-Lussac, Graham and Dalton (law of partial pressure), molar volume and atomicity of gases",
        "The ideal gas equation (PV = nRT)",
        "The relationship between vapour density of gases and the relative molecular mass",
        "Ideal and real gases",
      ],
    },
    {
      Topic: "Atomic Structure and Bonding",
      subTopic: [
        "The concept of atoms, molecules and ions, the works of Dalton, Millikan, Rutherford, Moseley, Thompson and Bohr",
        "Atomic structure, the four quantum numbers, the principles that govern the arrangement of atoms into orbitals",
        "Electron configuration, atomic number, mass number and isotopes",
        "Shapes of s and p orbitals",
      ],
    },
    {
      Topic: "Periodic Table and Periodicity of Elements",
      subTopic: [
        "Presentation of the periodic table with a view to recognizing families of elements",
        "Variation of properties: ionization energy, ionic radii, electron affinity, electronegativity, electrical and thermal conductivities",
      ],
    },
    {
      Topic: "Chemical Bonding",
      subTopic: [
        "Electrovalency and covalency",
        "Hydrogen bonding and metallic bonding as special types of electrovalency and covalency",
        "Coordinate bond as a type of covalent bond",
        "Shapes of simple molecules: linear, non-linear, tetrahedral, and pyramidal",
      ],
    },
    {
      Topic: "Nuclear Chemistry",
      subTopic: [
        "Radioactivity – Types, properties and detection of radiations",
        "Natural and artificial radioactivity",
        "Nuclear stability and radioactive decay",
        "Nuclear reactions: Nuclear fusion and fission",
      ],
    },
    {
      Topic: "Solubility",
      subTopic: [
        "Unsaturated, saturated and supersaturated solutions",
        "Solubility curves and simple deductions from them",
        "True and false solutions (Suspensions and colloids)",
      ],
    },
    {
      Topic: "Environmental Pollution",
      subTopic: [
        "Air pollution: Examples of air pollutants such as H2S, CO, SO2, oxides of nitrogen, chlorofluorocarbons",
        "Water pollution: Sewage and oil pollution",
        "Soil pollution: Oil spillage, biodegradable and non-biodegradable pollutants",
      ],
    },
    {
      Topic: "Acids, Bases and Salts",
      subTopic: [
        "General characteristics, properties and uses of acids, bases and salts",
        "Acid/base indicators, basicity of acids",
        "Qualitative comparison of the conductance of molar solutions of strong and weak acids and bases",
        "pH and pOH scale",
      ],
    },
    {
      Topic: "Oxidation and Reduction - Redox",
      subTopic: [
        "Oxidation in terms of the addition of oxygen",
        "Reduction as removal of oxygen with the aid of hydrogen",
        "Oxidation and reduction in terms of electron transfer",
        "Use of oxidation numbers in balancing redox reactions",
      ],
    },
    {
      Topic: "Electrolysis",
      subTopic: [
        "Electrolytes and non-electrolytes",
        "Faraday’s laws of electrolysis",
        "Electrolysis of dilute H2SO4, aqueous CuSO4, CuCl2 solution, dilute and concentrated NaCl solutions",
        "Corrosion as an electrolytic process, cathodic protection of metals",
      ],
    },
    {
      Topic: "Energy Changes",
      subTopic: [
        "Energy changes (∆H) accompanying physical and chemical changes",
        "Endothermic (+∆H) and exothermic (-∆H) reactions",
        "Entropy as an order-disorder phenomenon",
        "Spontaneity of reactions: ∆G0= 0 as a criterion for equilibrium",
      ],
    },
    {
      Topic: "Rates of Chemical Reaction",
      subTopic: [
        "Factors affecting the rate of chemical reactions: Temperature, concentration/pressure, surface area, catalyst",
        "Activation energy and Arrhenius’ law",
        "Reaction rate curves",
      ],
    },
    {
      Topic: "Chemical Equilibria",
      subTopic: [
        "Reversible reactions and factors governing the equilibrium position",
        "Le Chatelier’s principle and its industrial applications",
      ],
    },
    {
      Topic: "Non-metals and their Compounds",
      subTopic: [
        "Hydrogen: Commercial production, laboratory preparation, properties and uses",
        "Halogens: Chlorine as a representative halogen",
        "Oxygen and Sulphur",
        "Nitrogen and its compounds: Ammonia, Trioxonitrate (V) acid, and the nitrogen cycle",
        "Carbon and its compounds",
      ],
    },
    {
      Topic: "Metals and their Compounds",
      subTopic: [
        "General properties of metals",
        "Alkali metals: Sodium, Sodium hydroxide, Sodium trioxocarbonate",
        "Alkaline-earth metals: Calcium, Magnesium",
        "Aluminium: Purification of bauxite, electrolytic extraction",
        "Iron and its compounds",
      ],
    },
    {
      Topic: "Organic Compounds",
      subTopic: [
        "Introduction to the tetravalency of carbon, general formula, IUPAC nomenclature",
        "Alkanes, Alkenes, Alkynes",
        "Aromatic hydrocarbons",
        "Alcohols, Aldehydes, Ketones, Carboxylic acids, Amines, and Carbohydrates",
      ],
    },
    {
      Topic: "Chemistry and Industry",
      subTopic: [
        "Chemical industries: Types, raw materials and relevance",
        "Biotechnology",
      ],
    },
    {
      Topic: "Astronomical Chemistry",
      subTopic: [
        "Solar system, planets, satellite and the composition of the earth",
        "Atmosphere, lithosphere and hydrosphere",
      ],
    },
  ],
  CRS: [
    {
      Topic: "The Sovereignty of God",
      subTopic: ["God as Creator and Controller of the Universe"],
    },
    {
      Topic: "The Covenant",
      subTopic: [
        "The flood and God’s covenant with Noah",
        "God’s covenant with Abraham",
        "God’s covenant with Israel",
        "The New Covenant",
      ],
    },
    {
      Topic: "Leadership Qualities",
      subTopic: [
        "Joseph",
        "Moses",
        "Joshua",
        "Judges (Deborah, Gideon, Samson)",
      ],
    },
    {
      Topic: "Divine Providence, Guidance and Protection",
      subTopic: ["Guidance", "Protection", "Provision"],
    },
    {
      Topic: "Parental Responsibility",
      subTopic: ["Eli and Samuel", "David", "Asa"],
    },
    {
      Topic: "Obedience and Disobedience",
      subTopic: ["Obedience and Rewards", "Disobedience and Consequences"],
    },
    {
      Topic: "A Man After God’s Own Heart",
      subTopic: [
        "Early life of David",
        "David’s submission to the will of God",
        "David’s repentance and forgiveness",
      ],
    },
    {
      Topic: "Decision Making",
      subTopic: [
        "Reliance on a medium",
        "Wisdom of Solomon",
        "Unwise policies of Solomon and Rehoboam",
      ],
    },
    {
      Topic: "Greed and Its Effects",
      subTopic: ["Ahab", "Gehazi"],
    },
    {
      Topic: "The Supremacy of God",
      subTopic: ["Religious tension and God’s power on Mount Carmel"],
    },
    {
      Topic: "Religious Reforms in Judah",
      subTopic: ["Cleansing of the Temple", "Renewal of the Covenant"],
    },
    {
      Topic: "Concern for Judah",
      subTopic: [
        "Fall of Jerusalem",
        "Condition of Judah",
        "Response to the state of Judah",
      ],
    },
    {
      Topic: "Faith, Courage and Protection",
      subTopic: ["Daniel", "Shadrach, Meshach and Abednego"],
    },
    {
      Topic: "God’s Message to Nineveh",
      subTopic: ["Jonah and his message"],
    },
    {
      Topic: "Social Justice, True Religion and Divine Love",
      subTopic: [
        "Social justice and true religion",
        "Divine love and human response",
      ],
    },
    {
      Topic: "Holiness and Divine Call",
      subTopic: ["Call of Isaiah", "Call of Ezekiel", "Call of Jeremiah"],
    },
    {
      Topic: "Punishment and Hope",
      subTopic: ["Punishment of Israel", "Hope and restoration"],
    },
    {
      Topic: "The Birth and Early Life of Jesus",
      subTopic: ["John the forerunner", "Birth and boyhood of Jesus"],
    },
    {
      Topic: "The Baptism and Temptation of Jesus",
      subTopic: ["Baptism of Jesus", "Temptation of Jesus"],
    },
    {
      Topic: "Discipleship",
      subTopic: ["Call of the first disciples", "Demands of discipleship"],
    },
    {
      Topic: "Miracles",
      subTopic: [
        "Nature miracles",
        "Miracles of resuscitation",
        "Healing miracles",
        "Exorcism",
      ],
    },
    {
      Topic: "The Parables",
      subTopic: [
        "Parables of the Kingdom",
        "Parables about love of God",
        "Parables about love for one another",
        "Parables about wealth",
        "Parables on prayer",
      ],
    },
    {
      Topic: "Sermon on the Mount",
      subTopic: ["Teachings and demands of the Kingdom"],
    },
    {
      Topic: "Mission of the Disciples",
      subTopic: ["Mission of the Twelve", "Mission of the Seventy"],
    },
    {
      Topic: "The Great Confession",
      subTopic: ["Peter’s confession"],
    },
    {
      Topic: "The Transfiguration",
      subTopic: ["Events and significance of the Transfiguration"],
    },
    {
      Topic: "The Triumphal Entry and Cleansing of the Temple",
      subTopic: ["Triumphal Entry", "Cleansing of the Temple"],
    },
    {
      Topic: "The Last Supper",
      subTopic: ["Institution and significance of the Last Supper"],
    },
    {
      Topic: "Trials and Death of Jesus",
      subTopic: [
        "Trials before the High Priest",
        "Trial before Pilate",
        "Trial before Herod",
        "Crucifixion and burial",
      ],
    },
    {
      Topic: "Resurrection, Appearances and Ascension",
      subTopic: ["Resurrection", "Appearances", "Ascension"],
    },
    {
      Topic: "Jesus’ Teachings About Himself",
      subTopic: [
        "Bread of Life and Living Water",
        "Light of the World",
        "The Door, the Lamb and the Good Shepherd",
        "The True Vine",
        "The Resurrection",
      ],
    },
    {
      Topic: "Love",
      subTopic: ["God’s love for man", "Love for one another"],
    },
    {
      Topic: "Fellowship in the Early Church",
      subTopic: ["Communal living", "Problems and solutions"],
    },
    {
      Topic: "The Holy Spirit and the Mission of the Church",
      subTopic: ["Pentecost", "Mission of the Church"],
    },
    {
      Topic: "Opposition to the Gospel Message",
      subTopic: [
        "Arrest of Peter and John",
        "Martyrdom of Stephen",
        "Persecution by Saul",
        "Persecution of Paul",
      ],
    },
    {
      Topic: "Mission to the Gentiles",
      subTopic: [
        "Conversion of Saul",
        "Conversion of Cornelius",
        "Mission of Paul",
        "Council of Jerusalem",
      ],
    },
    {
      Topic: "Justification by Faith",
      subTopic: ["Meaning", "Conditions", "Fruits"],
    },
    {
      Topic: "The Law and Grace",
      subTopic: ["Purpose of the Law", "Significance of Grace"],
    },
    {
      Topic: "New Life in Christ",
      subTopic: ["Old life", "New life", "Benefits"],
    },
    {
      Topic: "Christians as Joint Heirs with Christ",
      subTopic: ["Meaning", "Benefits"],
    },
    {
      Topic: "Humility",
      subTopic: ["Meaning", "Requirements", "Rewards"],
    },
    {
      Topic: "Forgiveness",
      subTopic: ["Paul’s teaching", "Benefits"],
    },
    {
      Topic: "Spiritual Gifts",
      subTopic: ["Types", "Benefits", "Difference between gifts and talents"],
    },
    {
      Topic: "Christian Giving",
      subTopic: ["Concept", "Importance"],
    },
    {
      Topic: "Civic Responsibility",
      subTopic: ["Obedience to authority", "Good citizenship"],
    },
    {
      Topic: "Dignity of Labour",
      subTopic: ["Meaning", "Benefits"],
    },
    {
      Topic: "Second Coming of Christ",
      subTopic: ["Signs", "Preparation"],
    },
    {
      Topic: "Impartiality",
      subTopic: ["Meaning", "Causes", "Consequences"],
    },
    {
      Topic: "Effective Prayer",
      subTopic: ["Requirements", "Types", "Importance"],
    },
    {
      Topic: "Christian Living in the Community",
      subTopic: [
        "Interpersonal relationships",
        "Living among non-Christians",
        "Attitude to persecution",
        "Christian family life",
      ],
    },
    {
      Topic: "Corruption",
      subTopic: ["Meaning", "Causes", "Effects", "Ways of curbing corruption"],
    },
    {
      Topic: "Sexual Immorality",
      subTopic: ["Prostitution", "Adultery and fornication", "Homosexuality"],
    },
  ],
  MATH: [
    {
      Topic: "Number bases/Modular Arithmetic",
      subTopic: [
        "operations in different number bases from 2 to 10",
        "conversion from one base to another including fractional parts",
        "modular arithmetic",
      ],
    },
    {
      Topic: "Fractions, Decimals, Approximations and Percentages",
      subTopic: [
        "fractions and decimals",
        "significant figures",
        "decimal places",
        "percentage errors",
        "simple interest",
        "profit and loss percent",
        "ratio, proportion and rate",
        "shares and valued added tax (VAT)",
      ],
    },
    {
      Topic: "Indices, Logarithms and Surds",
      subTopic: [
        "laws of indices",
        "equations involving indices",
        "standard form",
        "laws of logarithm",
        "logarithm of any positive number to a given base",
        "change of bases in logarithm and application",
        "relationship between indices and logarithm",
        "Surds",
      ],
    },
    {
      Topic: "Sets",
      subTopic: [
        "types of sets",
        "algebra of sets",
        "Venn diagrams and their applications",
      ],
    },
    {
      Topic: "Polynomials",
      subTopic: [
        "change of subject of formula",
        "addition, subtraction, multiplication and division of polynomials",
        "factorization of polynomials of degree not exceeding 3",
        "roots of polynomials not exceeding degree 3",
        "factor and remainder theorems",
        "simultaneous equations including one linear one quadratic",
        "graphs of polynomials of degree not greater than 3",
      ],
    },
    {
      Topic: "Variation",
      subTopic: [
        "direct",
        "inverse",
        "joint",
        "partial",
        "percentage increase and decrease",
      ],
    },
    {
      Topic: "Inequalities",
      subTopic: [
        "analytical and graphical solutions of linear inequalities",
        "quadratic inequalities with integral roots only",
      ],
    },
    {
      Topic: "Progression",
      subTopic: ["nth term of a progression", "sum of A.P.and G.P."],
    },
    {
      Topic: "Binary Operations",
      subTopic: [
        "properties of closure, commutativity, associativity and distributivity",
        "identity and inverse elements (simple cases only)",
      ],
    },
    {
      Topic: "Matrices and Determinants",
      subTopic: [
        "algebra of matrices not exceeding 3x3",
        "determinants of matrices not exceeding 3x3",
        "inverses of 2x2 matrices",
      ],
    },
    {
      Topic: "Euclidean Geometry",
      subTopic: [
        "Properties of angles and lines",
        "Polygons: triangles, quadrilaterals and general polygons",
        "Circles: angle properties, cyclic quadrilaterals and intersecting chords",
        "construction",
      ],
    },
    {
      Topic: "Mensuration",
      subTopic: [
        "lengths and areas of plane geometrical figures",
        "lengths of arcs and chords of a circle",
        "Perimeters and areas of sectors and segments of circles",
        "surface areas and volumes of simple solids and composite figures",
        "the earth as a sphere: longitudes and latitudes",
      ],
    },
    {
      Topic: "Loci",
      subTopic: [
        "locus in 2 dimensions based on geometric principles relating to lines and curves",
      ],
    },
    {
      Topic: "Coordinate Geometry",
      subTopic: [
        "midpoint and gradient of a line segment",
        "distance between two points",
        "parallel and perpendicular lines",
        "equations of straight lines",
      ],
    },
    {
      Topic: "Trigonometry",
      subTopic: [
        "trigonometric ratios of angles",
        "angles of elevation and depression",
        "bearings",
        "areas and solutions of triangle",
        "graphs of sine and cosine",
        "sine and cosine formulae",
      ],
    },
    {
      Topic: "Differentiation",
      subTopic: [
        "limit of a function",
        "differentiation of explicit algebraic and simple trigonometrical functions - sine, cosine and tangent",
      ],
    },
    {
      Topic: "Application of differentiation",
      subTopic: [],
    },
    {
      Topic: "Integration",
      subTopic: [
        "integration of explicit algebraic and simple trigonometric functions",
        "area under the curve",
      ],
    },
    {
      Topic: "Representation of data",
      subTopic: [
        "frequency distribution",
        "histogram, bar chart and pie chart",
      ],
    },
    {
      Topic: "Measures of Location",
      subTopic: [
        "mean, mode and median of ungrouped and grouped data (simple cases only)",
        "cumulative frequency",
      ],
    },
    {
      Topic: "Measures of Dispersion",
      subTopic: ["range, mean deviation, variance and standard deviation"],
    },
    {
      Topic: "Permutation and Combination",
      subTopic: [
        "Linear and circular arrangements",
        "Arrangements involving repeated objects",
      ],
    },
    {
      Topic: "Probability",
      subTopic: [
        "experimental probability (tossing of coin, throwing of a dice etc)",
        "Addition and multiplication of probabilities (mutual and independent cases)",
      ],
    },
  ],
  LIT: [],
  ACCT: [],
  ENG: [],
  PHY: [],
  GOV: [],
  ECO: [],
  GEO: [],
};
