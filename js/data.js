// data.js
const PROJECT_TAGS = {
    artisanat: "Artisanat",
    graphisme: "Graphisme"
};

const PROJECTS_DATA = [
    {
        id: "volatiles",
        title: "L'empreinte d'un geste",
        displayTitle: "L'empreinte <br>d'un geste",
        tags: ["artisanat"],
        home: {
            order: 1,
            layout: "portrait",
            image: "image/home/vol.webp",
            alt: "Animation de gravure personnalisée sur verre — cave à vin Volatiles",
            title: "Volatiles",
            label: "Animation · Création",
            date: "2025-2026"
        },
        client: "Volatiles",
        prestations: [
            "Direction artistique et recherche de personnalisation",
            "Communication (affiche, Instagram, reel)",
            "Gravure sur verre",
            "Animation événementielle",
            "Personnalisation live"
        ],
        displayCategory: "Événement & gravure",
        year: "2025-2026",
        type: "ARTISANAT & ÉVÉNEMENT",
        discipline: "DESIGN & ARTISANAT",
        description: `“Créer une expérience de gravure artisanale en direct dans un univers lié à l'objet de dégustation.”

\n\nÀ travers une série d’animations de gravure personnalisée réalisées à la cave à vin Volatiles, ce projet explore la rencontre de l’univers du vin et celui du geste artisanal. 
\nL'enjeu était d'utiliser cette technique dans un contexte de dégustation et de l'adapter aux contraintes d’usage d'objets du quotidien (bouteilles, carafes, verres et sous-verres).
Concevoir et réaliser ces animations a été l’occasion de questionner ma pratique et la place du geste artisanal.
\nCe projet est conçu de A à Z, de la création de visuels de communication aux tests d'outillage, jusqu'à l'exécution de la gravure en direct et sur mesure sur le lieu de vente.`,
        imageHero: "image/projets/volatiles/logo.webp",
        heroAlt: "Gravure sur verre Volatiles",
gallery: [

    // 01 — LE CONTEXTE
    {
        src: "image/projets/volatiles/iphone1.webp",
        span: 7,
        ratio: "4/3",
        alt: "Jéroboam photographié sur un tonneau gravé avec les initiales M&A en doré"
    },

    {
        src: "image/projets/volatiles/cave-4.jpg",
        span:5,
        ratio: "3/4",
         alt: "Affiche d'invitation à l'événement de gravure présentée sur un smartphone"
        
    },


    // 02 — LA RECHERCHE
 
    {
        src: "image/projets/volatiles/reel.mp4",
        span: 5,
        ratio: "7/12",
        alt: "Reel vidéo geste de gravure"
    },  
     {
        src: "image/projets/volatiles/jero1.jpg",
        span:7,
        ratio: "1/1",
        alt: "Croquis de motifs de vigne et de grappes de raisin"
    }
]
    },
    {
        id: "lucie-allard",
        title: "Lucie Allard Design",
        tags: ["graphisme"],
        home: {
            order: 2,
            layout: "square",
            image: "image/home/lucie.webp",
            alt: "Identité visuelle éco-conçue Lucie Allard Design",
            title: "Lucie Allard",
            label: "Création",
            date: "2024"
        },
        client: "Lucie Allard Design",
        prestations: [
            "Identité visuelle éco-conçue",
            "Logo et typographies",
            "Gamme colorimétrique"
        ],
        displayCategory: "IDENTITÉ VISUELLE",
        year: "2024",
        type: "Graphisme",
        discipline: "Identité visuelle",
        description: `Création de l’identité visuelle de la designer et artisane éco-responsable Lucie Allard.\n\nCe projet explore les possibilités et les limites d’une identité graphique éco-conçue. Comment tendre vers une identité visuelle plus responsable sans compromettre sa lisibilité et son impact ? Peut-on réellement concevoir une identité visuelle 100 % responsable ?\n\nLe logo a été développé à partir de typographies conçues dans une logique de réduction des ressources, notamment en limitant la consommation d’encre lors de l’impression et en optimisant la lisibilité. La gamme colorimétrique suit également cette approche.\n\nSi ces choix sont pertinents dans un contexte imprimé, ils révèlent rapidement leurs limites dans un environnement numérique, où les teintes trop claires nuisent à la lisibilité et à l’impact visuel.\n\nAu-delà de la création d’une identité, ce projet a permis d’expérimenter des méthodes de conception plus responsables et de questionner les compromis entre intention écologique et efficacité graphique.`,
        imageHero: "image/projets/lucie/lucie-3.webp",
        heroAlt: "Présentation identité visuelle Lucie Allard",
        gallery: [
            { src: "image/projets/lucie/gif.gif", span: 4, ratio: "4/5", alt: "Animation logo" },
            { src: "image/projets/lucie/lucie-3.webp", span: 8, ratio: "16/9", alt: "Papeterie éco-conçue" },
            { src: "image/projets/lucie/lucie-1.jpg", span: 12, ratio: "16/9", alt: "Charte graphique Lucie Allard" }
        ]
    },
    {
        id: "signature",
        title: "Gravure Signature",
        tags: ["artisanat"],
        home: {
            order: 3,
            layout: "portrait",
            image: "image/home/thuizat.webp",
            alt: "Gravure d'exception sur carafe en cristal",
            title: "Gravure Signature",
            label: "Commande",
            date: "2025"
        },
        client: "Riedel",
        prestations: [
            "Gravure sur mesure sur cristal",
            "Reproduction de signature",
            "Création d'un pochoir sur mesure"
        ],
        displayCategory: "DESIGN & GRAVURE",
        year: "2025",
        type: "Artisanat",
        discipline: "Design & Artisanat",
        description: `Personnalisation réalisée par l'intermédiaire et sur les produits de la maison RIEDEL.\n\nÀ la suite d'un événement de gravure personnalisée dans la cave à vin Volatiles, j'ai réalisé des gravures sur mesure pour des clients de Riedel.\n\nCe fut l'opportunité de pratiquer cette technique et mon savoir-faire sur de nouveaux supports avec des caractéristiques différentes.\n\nPenser la gravure autrement en fonction de ces caractéristiques.`,
        imageHero: "image/projets/thuizat/client-logo(1).webp",
        heroAlt: "Carafe en cristal gravée Riedel",
        gallery: [
            { src: "image/projets/thuizat/client-logo(2).webp", span: 12, ratio: "1/1", alt: "Détail signature gravée sur cristal" }
        ]
    },
    {
        id: "particulier",
        title: "Conception particulière",
        tags: ["artisanat"],
        home: {
            order: 4,
            layout: "portrait",
            image: "image/home/client-illu(3).webp",
            alt: "Design & Artisanat sur mesure",
            title: "Conception particulière",
            label: "Commande",
            date: "depuis 2024"
        },
        client: "Particuliers",
        prestations: [
            "Recherche graphique",
            "Création sur mesure",
            "Gravure personnalisée"
        ],
        displayCategory: "RECHERCHE & CRÉATION",
        year: "depuis 2024",
        type: "Artisanat",
        discipline: "Design artisanal",
        description: "Recherche graphique, création personnelle et expérimentations autour du geste...",
        imageHero: "image/home/client-illu(3).webp",
        heroAlt: "Projet de gravure personnalisée pour particulier",
        gallery: [
            { src: "image/projets/perso/client-illu(4).webp", span: 12, ratio: "4/5", alt: "Pièce unique réalisée sur commande" }
        ]
    },
    {
        id: "lvmh",
        title: "Guerlain - Animations live",
        tags: ["artisanat"],
        home: {
            order: 5,
            layout: "square",
            image: "image/home/guer.webp",
            alt: "Prestations de personnalisation artisanale en direct - Partout à Paris",
            title: "Guerlain - Animations live",
            label: "Animation",
            date: "depuis 2019"
        },
        client: "Guerlain",
        prestations: [
            "Animation live en boutique",
            "Événements spécifiques"
        ],
        displayCategory: "ANIMATION GRAVURE",
        year: "depuis 2019",
        type: "Animation gravure",
        discipline: "Gravure artisanale",
        description: "Prestations de gravure événementielle en direct au cœur de Paris...",
        imageHero: "image/projets/animation/anim-calli(1).webp",
        heroAlt: "Animation live de gravure Guerlain",
        gallery: [
            { src: "image/projets/animation/GUERLAIN-02.jpg", span: 4, ratio: "4/5", alt: "Flacon Guerlain gravé sur place" },
            { src: "image/projets/animation/GLH-2.webp", span: 4, ratio: "1/1", alt: "Atelier gravure en boutique" },
            { src: "image/projets/animation/GLH-9 (2).webp", span: 4, ratio: "4/5", alt: "Personnalisation dorure/gravure" }
        ]
    },
    {
        id: "tasaki",
        title: "Œufs de Pâques",
        tags: ["artisanat"],
        home: {
            order: 6,
            layout: "portrait",
            image: "image/home/tasaki.webp",
            alt: "Projet personnalisé sur mesure pour la maison Tasaki sur des œufs de pâques",
            title: "Animation Maison Tasaki",
            label: "Animation",
            date: "2025"
        },
        client: "Maison Tasaki",
        prestations: [
            "Personnalisation sur mesure",
            "Gravure sur œufs de Pâques",
            "Animation"
        ],
        displayCategory: "ANIMATION & PERSONNALISATION",
        year: "2025",
        type: "Artisanat & Événement",
        discipline: "Gravure sur mesure",
        description: "Personnalisation en direct d'œufs de Pâques pour la Maison Tasaki...",
        imageHero: "image/projets/tasaki/tasaki.webp",
        heroAlt: "Œufs de Pâques gravés Tasaki",
        gallery: [
            { src: "image/projets/tasaki/tasaki.webp", span: 12, ratio: "4/5", alt: "Détail gravure Tasaki" }
        ]
    },
    {
        id: "hibou",
        title: "Posters Illustrés",
        tags: ["graphisme"],
        home: {
            order: 7,
            layout: "portrait",
            image: "image/home/lucas.webp",
            alt: "Conception de posters illustrés sur l'univers du vin",
            title: "Posters Illustrés",
            label: "Création",
            date: "2025"
        },
        client: "Projet personnel",
        prestations: [
            "Illustration",
            "Conception graphique",
            "Mise en page de posters"
        ],
        displayCategory: "CONCEPTION GRAPHIQUE",
        year: "2025",
        type: "Graphisme & Illustration",
        discipline: "Design graphique",
        description: "Recherche graphique, création personnelle et expérimentations visuelles...",
        imageHero: "image/projets/archi/archi1.webp",
        heroAlt: "Poster illustré",
        gallery: [
            { src: "image/projets/archi/archi3.webp", span: 6, ratio: "4/5", alt: "Poster sérigraphie" },
            { src: "image/projets/archi/perso-archi(2).webp", span: 6, ratio: "16/9", alt: "Vue d'ensemble de la série de posters" }
        ]
    }
];