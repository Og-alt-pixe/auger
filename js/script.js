// ============================================================
// TRANSITION DE PAGE
// ============================================================
// Tout est géré en CSS (voir « TRANSITION ENTRE LES PAGES » dans style.css) :
// transition native là où elle existe, fondu depuis le noir ailleurs.
// Plus aucun calque ni délai au clic côté JS.
//
// Le header ne rejoue son animation d'entrée (wipe + cascade des liens) qu'à
// l'arrivée sur le site : c'est le petit script du <head> de chaque page qui
// en décide avant le premier rendu (voir la classe intro-seen).

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// 'pageshow' se déclenche à chaque affichage de la page, y compris
// quand elle revient du cache du navigateur (bouton retour / bfcache),
// contrairement à 'DOMContentLoaded' qui ne se redéclenche pas dans ce cas.
// Une URL avec ancre (#portfolio depuis « Voir les réalisations » ou le bouton
// retour d'une page projet, #service-gravure / #service-direction depuis les liens
// du hero) doit atterrir sur sa cible, sous le header fixe, plutôt qu'en haut de page.
// Retour depuis une page projet : l'accueil retrouve la position où on l'avait quittée
// (sauvegardée dans sessionStorage quand on quitte l'accueil, voir pagehide plus bas).
// Un rechargement ou une nouvelle visite repartent toujours du haut, comme avant.
const HOME_SCROLL_KEY = 'home-scroll-y';
const savedHomeScroll = () => {
    try {
        const nav = performance.getEntriesByType('navigation')[0];
        if (!nav || nav.type !== 'back_forward') return null;
        const y = parseInt(sessionStorage.getItem(HOME_SCROLL_KEY), 10);
        return Number.isFinite(y) && y > 0 ? y : null;
    } catch (_) { return null; }
};

const scrollToHashOrTop = () => {
    let id = '';
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (_) { }
    const el = id ? document.getElementById(id) : null;
    if (!el) {
        // « instant » : sans ça, html { scroll-behavior: smooth } faisait glisser la page vers le haut
        const restored = document.querySelector('.grid-layout') ? savedHomeScroll() : null;
        window.scrollTo({ top: restored || 0, behavior: 'instant' });
        return;
    }
    // Un lien vers un service cadre le bloc entier (son filet du haut compris)
    const target = el.closest('.service-block') || el;
    // On retire la montée du reveal en cours, sinon le bloc remonterait de 20px après l'arrivée
    const lift = new DOMMatrix(getComputedStyle(target).transform).m42 || 0;
    const header = document.querySelector('header');
    const offset = (header ? header.offsetHeight : 0) + 24;
    window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - lift - offset,
        behavior: 'instant'
    });
};

window.addEventListener('pageshow', (e) => {
    // Page restaurée telle quelle depuis le cache (retour) : le navigateur a déjà remis le bon scroll.
    if (e.persisted) return;
    scrollToHashOrTop();
});

// On mémorise la position de l'accueil en le quittant (clic sur un projet, lien, fermeture).
window.addEventListener('pagehide', () => {
    if (!document.querySelector('.grid-layout')) return;
    try { sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.round(window.pageYOffset))); } catch (_) { }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- 0bis. GRILLE D'ACCUEIL : générée depuis js/data.js ---
    // Chaque projet qui a un bloc `home` devient une carte, dans l'ordre de
    // `home.order`. Les classes de la carte = layout + tags (ce sont ces tags
    // que le filtrage ci-dessous lit). Le balisage produit est identique à
    // l'ancienne grille écrite à la main dans index.html.
    const homeGrid = document.querySelector('.grid-layout');
    if (homeGrid && typeof PROJECTS_DATA !== 'undefined') {
        const tagLabels = (typeof PROJECT_TAGS !== 'undefined') ? PROJECT_TAGS : {};
        const esc = (v) => String(v == null ? '' : v)
            .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;');

        homeGrid.innerHTML = PROJECTS_DATA
            .filter(p => p.home)
            .sort((a, b) => (a.home.order ?? 999) - (b.home.order ?? 999))
            .map(p => {
                const tags = Array.isArray(p.tags) ? p.tags : [];
                const label = p.home.label || tags.map(t => tagLabels[t] || t).join(' · ');
                const classes = ['grid-item', p.home.layout, ...tags].filter(Boolean).join(' ');
                return `
                <div class="${esc(classes)}">
                    <a href="projets.html?id=${encodeURIComponent(p.id)}">
                        <img src="${esc(p.home.image)}" loading="lazy" alt="${esc(p.home.alt || p.title)}">
                        <div class="item-overlay">
                            <div class="category">
                                <span>${esc(label)}</span>
                                <div class="divider-line3"></div>
                            </div>
                            <div>
                                <h3 class="project-name">${esc(p.home.title || p.title)}</h3>
                                <span class="project-date">${esc(p.home.date || p.year)}</span>
                            </div>
                        </div>
                    </a>
                </div>`;
            })
            .join('\n');
    }

    scrollToHashOrTop();
    // --- 0. Burger ---
    const burgerCheck = document.getElementById('burger-check');
    const burgerLabel = document.querySelector('label.hamburger');
    const navLinks = document.querySelectorAll('header nav a');
    // Texte caché de chaque lien du menu (réserve la largeur du survol en gras, voir style.css)
    // + page courante annoncée aux lecteurs d'écran.
    const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    navLinks.forEach(link => {
        link.setAttribute('data-text', link.textContent.trim());
        const target = (link.getAttribute('href') || '').split(/[?#]/)[0].toLowerCase();
        if (target && target === currentPage) link.setAttribute('aria-current', 'page');
    });

    if (burgerCheck && burgerLabel) {
        const syncAria = () => {
            const isOpen = burgerCheck.checked;
            burgerLabel.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };
        burgerCheck.addEventListener('change', syncAria);
        syncAria();

        // Le burger est un <label> : sans ça, il est inatteignable au clavier.
        burgerLabel.setAttribute('role', 'button');
        burgerLabel.setAttribute('tabindex', '0');
        burgerLabel.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                burgerCheck.checked = !burgerCheck.checked;
                syncAria();
            }
        });

        // Passage en affichage tablette/desktop menu ouvert (rotation du téléphone, redimensionnement) :
        // le menu se referme et le défilement de la page est rendu (il restait bloqué avant).
        const desktopNav = window.matchMedia('(min-width: 768px)');
        const onNavBreakpoint = (e) => {
            if (e.matches && burgerCheck.checked) {
                burgerCheck.checked = false;
                syncAria();
            }
        };
        if (desktopNav.addEventListener) desktopNav.addEventListener('change', onNavBreakpoint);
        else if (desktopNav.addListener) desktopNav.addListener(onNavBreakpoint);

        // Fermer le menu lors du clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (burgerCheck.checked) {
                    burgerCheck.checked = false;
                    syncAria();
                }
            });
        });

        // Fermer le menu avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && burgerCheck.checked) {
                burgerCheck.checked = false;
                syncAria();
                burgerLabel.focus();
            }
        });
    }



    // --- 1. BARRE DE PROGRESSION ---
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const updateProgress = () => {
            const pixels = window.pageYOffset || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            // Page plus courte que l'écran : pas de division par zéro (la barre restait en « NaN% »)
            const percentage = height > 0 ? Math.min(100, (pixels / height) * 100) : 0;
            progressBar.style.width = percentage + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        // Page ouverte déjà scrollée (ancre, retour) : la barre est juste dès l'arrivée
        updateProgress();
        window.addEventListener('load', updateProgress);
    }

    // --- 2. RÉCUPÉRATION DES ÉLÉMENTS ---
    const projects = document.querySelectorAll('.grid-item');
    const filters = document.querySelectorAll('.filter-btn');
    const filterNav = document.querySelector('.filter-nav');
    // Masques hero (logo/texte) : simple fondu, indépendant de la cascade galerie ci-dessous
    // Masques hero (logo/texte) : simple fondu, indépendant de la cascade galerie.
    // On exclut .project-grid-item : sur la page projet, ces éléments ont leur
    // propre cascade (voir projet-manager.js) — les observer ici en plus
    // déclencherait leur apparition sans délai, en conflit avec cette cascade.
    const itemsToReveal = document.querySelectorAll('.reveal-mask:not(.project-grid-item), .reveal-right');

    // --- 3. LOGIQUE DU REVEAL AU SCROLL (simple, sans cascade) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    itemsToReveal.forEach(item => revealObserver.observe(item));

    // --- 3bis. REVEAL EN CASCADE (nav de filtres + galerie) ---
    // Objectif : que les éléments apparaissent dans l'ordre du DOM (ordre des blocs),
    // que ce soit au chargement (plusieurs éléments déjà visibles à l'écran) ou au
    // scroll (nouveaux éléments qui entrent dans le viewport). Le délai n'est plus
    // fixé en CSS par nth-child (limité aux 3 premiers) mais calculé ici, à chaque
    // "vague" d'apparition, ce qui s'adapte automatiquement au nombre de colonnes
    // affichées selon la taille d'écran.
    const cascadeItems = Array.from(document.querySelectorAll(
        '.filter-nav, .grid-item, .reveal-up, .next-project-link, ' +
        '.format-card, .pillar-card, .realm-item, ' +
        '.gallery .next-label, .project-gallery .next-label'
    ));
    const CASCADE_STEP = 0.09;   // secondes entre deux éléments d'une même vague
    const CASCADE_MAX_STEPS = 8; // au-delà, on ne rallonge plus l'attente

    // Fin de l'intro (header + hero + titre de page projet) : on la lit directement
    // sur les animations CSS en cours, au lieu de recopier leurs délais à la main.
    // Si l'on change un délai ou une durée dans le CSS, rien à mettre à jour ici.
    // Sur mobile, une galerie déjà visible au chargement patiente ainsi jusqu'à la
    // fin du hero ; au scroll classique, l'intro est terminée et la promesse déjà résolue.
    // Si la page s'ouvre déjà scrollée (ancre, retour depuis un projet), le hero est
    // hors écran : on n'attend pas une intro que personne ne voit.
    const introEl = document.querySelector('.hero, .project-hero');
    const introVisible = !!introEl && introEl.getBoundingClientRect().bottom > 0;
    const introDone = !introVisible ? Promise.resolve() : Promise.allSettled(
        document.getAnimations()
            .filter(a => a.animationName && a.effect && a.effect.target &&
                a.effect.target.closest('header, .hero, .project-hero'))
            .map(a => a.finished)
    );

    const cascadeObserver = new IntersectionObserver((entries) => {
        // On isole les éléments qui entrent dans CE batch, remis dans l'ordre du DOM,
        // pour que la cascade suive toujours l'ordre visuel des blocs de la page.
        const entering = entries
            .filter(entry => entry.isIntersecting)
            .map(entry => entry.target)
            .sort((a, b) => cascadeItems.indexOf(a) - cascadeItems.indexOf(b));

        // On cesse d'observer tout de suite : l'apparition elle-même attend l'intro.
        entering.forEach(target => cascadeObserver.unobserve(target));

        introDone.then(() => {
            entering.forEach((target, i) => {
                const step = Math.min(i, CASCADE_MAX_STEPS);
                const delay = `${(step * CASCADE_STEP).toFixed(2)}s`;
                target.style.transitionDelay = delay;
                // Pour les éléments dont ce sont les ENFANTS qui s'animent (labels de section)
                target.style.setProperty('--reveal-delay', delay);
                target.classList.add('is-visible');

                // Une fois l'apparition jouée, on retire le délai inline pour ne pas
                // qu'il perturbe les futures transitions (ex: clic sur un filtre).
                // On ignore les transitionend remontés par les enfants (image au hover).
                const clearDelay = (e) => {
                    if (e.target !== target) return;
                    target.style.transitionDelay = '';
                    target.removeEventListener('transitionend', clearDelay);
                };
                target.addEventListener('transitionend', clearDelay);
            });
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    cascadeItems.forEach(item => cascadeObserver.observe(item));

    // Initialise les liens par défaut
    projects.forEach(project => {
        const link = project.querySelector('a');
        if (!link) return;
        try {
            const url = new URL(link.href, window.location.origin);
            if (url.search && !url.searchParams.get('filter')) {
                url.searchParams.set('filter', 'all');
                link.href = url.toString();
            }
        } catch (_) { }
    });


// --- 4. FONCTION DE FILTRAGE (Version Grid-Safe) ---
let filterAnimationFrame = null;

const applyFilter = (filterValue, clickedButton, instant = false) => {

    // Annule proprement une éventuelle animation précédente
    if (filterAnimationFrame) {
        cancelAnimationFrame(filterAnimationFrame);
        filterAnimationFrame = null;
    }

    filters.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });

    if (clickedButton) {
        clickedButton.classList.add('active');
        clickedButton.setAttribute('aria-pressed', 'true');
    }

    const matchingProjects = [];
    const visibleProjects = [];

    projects.forEach(project => {

        const isMatch =
            filterValue === 'all' ||
            project.classList.contains(filterValue);

        // --- MISE À JOUR DYNAMIQUE DES LIENS ---
        const link = project.querySelector('a');

        if (link) {
            try {
                const url = new URL(link.href, window.location.origin);
                const projectId = url.searchParams.get('id');

                if (projectId) {
                    url.searchParams.set('filter', filterValue);
                    link.href = url.toString();
                }
            } catch (_) {
                // on ignore si URL relative exotic
            }
        }

        if (isMatch) {
            matchingProjects.push(project);
        }

        // Les cartes actuellement présentes dans la grille
        // servent de point de départ pour l'animation FLIP.
        if (
            project.style.display !== 'none' &&
            !project.classList.contains('filtering-out')
        ) {
            visibleProjects.push(project);
        }
    });

    // ---------------------------------------------------------
    // FILTRE AU CHARGEMENT VIA L'URL
    // ---------------------------------------------------------
    if (instant) {

        projects.forEach(project => {

            const isMatch =
                filterValue === 'all' ||
                project.classList.contains(filterValue);

            project.classList.remove('filtering-out');
            project.classList.remove('filtering-move');

            project.style.removeProperty('--filter-x');
            project.style.removeProperty('--filter-y');

            if (isMatch) {
                project.style.display = '';
                project.classList.add('is-visible');
            } else {
                project.classList.remove('is-visible');
                project.style.display = 'none';
            }
        });

        return;
    }

    // ---------------------------------------------------------
    // 1. MÉMORISE LA POSITION ACTUELLE
    // ---------------------------------------------------------
    const firstPositions = new Map();

    visibleProjects.forEach(project => {

        const rect = project.getBoundingClientRect();

        firstPositions.set(project, {
            left: rect.left,
            top: rect.top
        });
    });

    // ---------------------------------------------------------
    // 2. NORMALISE L'ÉTAT DE TOUTES LES CARTES
    // ---------------------------------------------------------
    projects.forEach(project => {

        project.classList.remove('filtering-out');
        project.classList.remove('filtering-move');

        project.style.removeProperty('--filter-x');
        project.style.removeProperty('--filter-y');

        const isMatch =
            filterValue === 'all' ||
            project.classList.contains(filterValue);

        if (isMatch) {
            project.style.display = '';
        } else {
            project.classList.remove('is-visible');
            project.style.display = 'none';
        }
    });

    // ---------------------------------------------------------
    // 3. NOUVELLE POSITION DE LA GRILLE
    // ---------------------------------------------------------
    void homeGrid.offsetHeight;

    // ---------------------------------------------------------
    // 4. ANIMATION DES CARTES QUI RESTENT
    // ---------------------------------------------------------
    matchingProjects.forEach(project => {

        const first = firstPositions.get(project);

        // Nouvelle carte : elle n'était pas présente avant.
        // On la laisse apparaître avec le reveal normal.
        if (!first) {
            project.classList.remove('is-visible');

            requestAnimationFrame(() => {
                if (project.style.display !== 'none') {
                    project.classList.add('is-visible');
                }
            });

            return;
        }

        const last = project.getBoundingClientRect();

        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;

        // Pas de déplacement nécessaire
        if (
            Math.abs(deltaX) < 1 &&
            Math.abs(deltaY) < 1
        ) {
            project.classList.add('is-visible');
            return;
        }

        project.style.setProperty('--filter-x', `${deltaX}px`);
        project.style.setProperty('--filter-y', `${deltaY}px`);

        project.classList.add('filtering-move');
        project.classList.add('is-visible');
    });

    // ---------------------------------------------------------
    // 5. LANCE LE MOUVEMENT VERS LA NOUVELLE POSITION
    // ---------------------------------------------------------
    filterAnimationFrame = requestAnimationFrame(() => {

        matchingProjects.forEach(project => {

            if (project.style.display === 'none') return;

            project.style.setProperty('--filter-x', '0px');
            project.style.setProperty('--filter-y', '0px');
        });

        // Nettoyage après la transition
        filterAnimationFrame = requestAnimationFrame(() => {

            matchingProjects.forEach(project => {

                project.classList.remove('filtering-move');

                project.style.removeProperty('--filter-x');
                project.style.removeProperty('--filter-y');
            });

            filterAnimationFrame = null;
        });
    });
};
    
    // --- 5. ÉCOUTEURS DE CLIC (Version ultra-stable) ---
    filters.forEach(filter => {
        filter.addEventListener('click', function (e) {
            // Empêche toute action résiduelle
            e.preventDefault();

            const filterValue = this.getAttribute('data-filter');

            // On applique le filtre visuel
            applyFilter(filterValue, this);

            // On met l'URL à jour sans empiler d'entrées dans l'historique :
            // avant (pushState), le bouton Retour changeait l'adresse sans changer les filtres affichés.
            const newUrl = filterValue !== 'all' ? `?filter=${filterValue}` : window.location.pathname;
            window.history.replaceState({ path: newUrl }, '', newUrl);
        });
    });

    // --- 6. GESTION DU FILTRE VIA URL AU CHARGEMENT ---
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter');

    if (filterParam) {
        const targetFilter = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
        if (targetFilter) {
            applyFilter(filterParam, targetFilter, true);
            // La grille vient de changer de hauteur : on repose le scroll (retour depuis un projet)
            scrollToHashOrTop();
        }
    }



});
// --- 7. LOGIQUE D'AFFICHAGE DES MÉDIAS (IMG VS VIDEO) ---
const renderMedia = (item) => {
    const isVideo = item.src.endsWith('.mp4');

    if (isVideo) {
        // On ajoute 'gallery-item' pour le style CSS 
        // et 'video-gallery' pour le script JS de lecture au scroll
        return `
            <div class="grid-item ${item.layout || ''}">
                <video 
                    src="${item.src}" 
                    class="video-gallery"
                    loop 
                    muted 
                    playsinline 
                    style="width:100%; height:100%; object-fit:cover; display:block; cursor:pointer;">
                </video>
            </div>`;
    } else {
        return `
            <div class="grid-item ${item.layout || ''}">
                <img src="${item.src}" alt="Projet" style="width:100%; height:100%; object-fit:cover; display:block;">
            </div>`;
    }
};