// ==========================================================================
// PROJET-MANAGER.JS — Gestion dynamique de la page Projets (projets.html)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // PARTIE 1 : RÉCUPÉRATION ET VALIDATION DES DONNÉES DU PROJET
    // ----------------------------------------------------------------------
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    const currentFilter = params.get('filter') || 'all';

    const projectIndex = PROJECTS_DATA.findIndex(p => p.id === projectId);
    const currentProject = PROJECTS_DATA[projectIndex];

    // Adresse sans id valide (lien cassé, projet retiré) : on renvoie vers la galerie
    // plutôt que d'afficher une page projet vide.
    if (!currentProject) {
        if (document.getElementById('project-grid')) {
            window.location.replace('index.html#portfolio');
        }
        return;
    }

    document.title = `${currentProject.title} | Alice Auger`;

    const escAttr = (v) => String(v == null ? '' : v)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');

    // ----------------------------------------------------------------------
    // PARTIE 2 : MÉTADONNÉES SEO & OPEN GRAPH DYNAMIQUES
    // ----------------------------------------------------------------------
    const setMeta = (selector, value) => {
        const el = document.querySelector(selector);
        if (el && value) el.setAttribute('content', value);
    };

    const firstParagraph = (currentProject.description || '').split('\n\n')[0].replace(/\s+/g, ' ').trim();
    const shortDesc = firstParagraph.length > 160
        ? firstParagraph.slice(0, 157).replace(/\s+\S*$/, '') + '…'
        : firstParagraph;

    setMeta('meta[name="description"]', shortDesc);
    setMeta('meta[property="og:title"]', document.title);
    setMeta('meta[property="og:description"]', shortDesc);

    if (currentProject.imageHero) {
        setMeta('meta[property="og:image"]', new URL(currentProject.imageHero, window.location.href).href);
        setMeta('meta[property="og:image:alt"]', currentProject.heroAlt || currentProject.title);
        
        document.querySelectorAll('meta[property="og:image:width"], meta[property="og:image:height"]')
            .forEach(el => el.remove());
    }

    // ----------------------------------------------------------------------
    // PARTIE 3 : INJECTION DES CONTENUS DU PROJET
    // ----------------------------------------------------------------------
    const nameEl = document.querySelector('.name-project .reveal-text');
    const catEl = document.querySelector('.projet-category');
    const yearEl = document.querySelector('.project-year');
    const descContainer = document.querySelector('.description-text');
    const detailsContainer = document.querySelector('.project-details');
    const heroImgEl = document.getElementById('project-hero-img');

    if (nameEl) nameEl.innerHTML = currentProject.displayTitle || currentProject.title;
    if (catEl) catEl.textContent = currentProject.displayCategory || '';
    if (yearEl) yearEl.textContent = currentProject.year || '';

    if (descContainer && currentProject.description) {
        const paragraphs = currentProject.description.split('\n\n');
        descContainer.innerHTML = paragraphs
            .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
            .join('');
    }

    if (heroImgEl && currentProject.imageHero) {
        heroImgEl.src = currentProject.imageHero;
        heroImgEl.alt = currentProject.heroAlt || currentProject.title;

        if (heroImgEl.complete) {
            heroImgEl.classList.add('loaded');
        } else {
            heroImgEl.onload = () => heroImgEl.classList.add('loaded');
        }
    }

    if (detailsContainer) {
        const rows = [];

        if (currentProject.client) {
            rows.push(`
                <li>
                    <span class="meta-label">Client</span>
                    <span class="meta-value">${currentProject.client}</span>
                </li>`);
        }

        if (currentProject.displayCategory) {
            rows.push(`
                <li>
                    <span class="meta-label">Catégorie</span>
                    <span class="meta-value">${currentProject.displayCategory}</span>
                </li>`);
        }

        if (currentProject.year) {
            rows.push(`
                <li>
                    <span class="meta-label">Année</span>
                    <span class="meta-value">${currentProject.year}</span>
                </li>`);
        }

        if (Array.isArray(currentProject.prestations) && currentProject.prestations.length) {
            const items = currentProject.prestations.map(p => `<li>${p}</li>`).join('');
            rows.push(`
                <li>
                    <span class="meta-label">Prestations</span>
                    <ul class="meta-services">${items}</ul>
                </li>`);
        }

        detailsContainer.innerHTML = rows.join('');
    }

    // ----------------------------------------------------------------------
    // PARTIE 4 : OBSERVATEUR DES VIDÉOS
    // ----------------------------------------------------------------------
    // L'apparition des blocs (fondu + montée) est gérée par un seul observer,
    // la cascade de script.js. Celui-ci ne s'occupe que de lancer les vidéos
    // et d'activer le clic pour le son.
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const video = entry.target.querySelector('video.video-gallery');
            if (video) {
                video.muted = true;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => { });
                }

                video.onclick = function () {
                    this.muted = !this.muted;
                    this.classList.toggle('sound-on', !this.muted);
                };
            }

            videoObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    // ----------------------------------------------------------------------
    // PARTIE 5 : CRÉATION DE LA GALERIE MÉDIAS
    // ----------------------------------------------------------------------
    const galleryGrid = document.getElementById('project-grid');

    if (galleryGrid && Array.isArray(currentProject.gallery)) {
        const chapters = [];
        currentProject.gallery.forEach(media => {
            const last = chapters[chapters.length - 1];
            const title = media.chapter || (last ? last.title : '');
            if (last && last.title === title) last.items.push(media);
            else chapters.push({ title, items: [media] });
        });

        const galleryLabel = document.querySelector('.project-gallery .next-label .txt-label');
        let mediaIndex = 0;
        let previousGrid = null;

        chapters.forEach((chapter, chapterIndex) => {
            let grid = galleryGrid;

            if (chapterIndex === 0) {
                if (chapter.title && galleryLabel) galleryLabel.textContent = chapter.title;
            } else {
                const heading = document.createElement('div');
                heading.className = 'next-label';
                heading.style.margin = 'clamp(56px, 8vw, 112px) 0 32px';
                heading.innerHTML = '<span class="txt-label"></span><div class="divider-line"></div>';
                heading.querySelector('.txt-label').textContent = chapter.title;

                grid = document.createElement('div');
                grid.className = 'project-grid';

                previousGrid.after(heading);
                heading.after(grid);
            }

            fillGrid(grid, chapter.items);
            previousGrid = grid;
        });

        function fillGrid(grid, items) {
            grid.innerHTML = '';

            items.forEach(media => {
                const item = document.createElement('div');
                item.className = `reveal-mask project-grid-item reveal-up ${media.layout || ''}`;
                item.dataset.index = mediaIndex++;

                const customRatio = normalizeRatio(media.ratio);
                if (customRatio) item.style.setProperty('--media-ratio', customRatio);

                const customSpan = parseInt(media.span, 10);
                if (customSpan >= 1 && customSpan <= 12) {
                    item.style.setProperty('--span', String(customSpan));
                }

                const isVideo = media.src.toLowerCase().endsWith('.mp4');

                if (isVideo) {
                    item.innerHTML = `
                    <video
                        src="${media.src}"
                        class="video-gallery"
                        autoplay
                        muted
                        loop
                        playsinline
                        webkit-playsinline
                        preload="metadata"
                        aria-label="${escAttr(media.alt || currentProject.title)}">
                    </video>`;
                } else {
                    item.innerHTML = `
                    <img
                        src="${media.src}"
                        loading="lazy"
                        decoding="async"
                        alt="${escAttr(media.alt || currentProject.title)}">`;
                }

                grid.appendChild(item);
                if (isVideo) videoObserver.observe(item);
            });

            const recalc = () => requestAnimationFrame(() => resizeAllGridItems(grid));

            const mediaReady = Array.from(grid.querySelectorAll('img, video'));
            mediaReady.forEach(media => {
                if (media.tagName === 'IMG') {
                    if (!media.complete) media.addEventListener('load', recalc, { once: true });
                } else if (media.readyState < 1) {
                    media.addEventListener('loadedmetadata', recalc, { once: true });
                }
            });

            recalc();

            if ('ResizeObserver' in window) {
                const gridResizeObserver = new ResizeObserver(recalc);
                gridResizeObserver.observe(grid);
            } else {
                window.addEventListener('resize', recalc, { passive: true });
            }
        }
    }

    // ----------------------------------------------------------------------
    // PARTIE 6 : CALCUL DES DIMENSIONS DE LA GRILLE
    // ----------------------------------------------------------------------
function resizeAllGridItems(grid) {
    if (window.matchMedia('(max-width: 899px)').matches) {
        grid.querySelectorAll('.project-grid-item').forEach(item => {
            item.style.removeProperty('grid-row-end');
        });

        return;
    }

    const items = Array.from(
        grid.querySelectorAll('.project-grid-item')
    );

    if (!items.length) return;

    const styles = getComputedStyle(grid);

    const rowUnit =
        parseFloat(
            styles.getPropertyValue('--gallery-row')
        ) || 8;

    const rowGap =
        parseFloat(styles.getPropertyValue('row-gap')) || 0;

    /*
     * Les éléments sont regroupés selon leurs spans.
     *
     * Exemple :
     *
     * 4 + 4 + 4 = une ligne
     * 5 + 7     = une ligne
     * 4 + 5 + 3 = une ligne
     */
    const rows = [];
    let currentRow = [];
    let currentSpan = 0;

    items.forEach(item => {
        const itemSpan = parseInt(
            getComputedStyle(item)
                .getPropertyValue('--span'),
            10
        ) || 2;

        /*
         * Si l'élément ne rentre pas dans la ligne actuelle,
         * on commence une nouvelle ligne.
         */
        if (
            currentRow.length &&
            currentSpan + itemSpan > 12
        ) {
            rows.push(currentRow);

            currentRow = [];
            currentSpan = 0;
        }

        currentRow.push(item);
        currentSpan += itemSpan;

        /*
         * Ligne complète.
         */
        if (currentSpan === 12) {
            rows.push(currentRow);

            currentRow = [];
            currentSpan = 0;
        }
    });

    /*
     * Ajoute une éventuelle dernière ligne incomplète.
     */
    if (currentRow.length) {
        rows.push(currentRow);
    }


    /*
     * Chaque ligne reçoit une hauteur commune.
     */
    rows.forEach(row => {

        let maxHeight = 0;

        /*
         * 1. On cherche le média qui nécessite
         *    la plus grande hauteur.
         */
        row.forEach(item => {

            const ratio = parseRatio(
                getComputedStyle(item)
                    .getPropertyValue('--media-ratio')
            );

            const width =
                item.getBoundingClientRect().width;

            if (!width || !ratio) return;

            const desiredHeight =
                width / ratio;

            maxHeight = Math.max(
                maxHeight,
                desiredHeight
            );
        });


        /*
         * 2. Toute la ligne reçoit la hauteur
         *    du média le plus haut.
         */
        const rowSpan = Math.max(
            1,
            Math.ceil(
                (maxHeight + rowGap) /
                (rowUnit + rowGap)
            )
        );


        /*
         * 3. Tous les médias de cette ligne
         *    ont exactement le même nombre de rows.
         */
        row.forEach(item => {
            item.style.gridRowEnd =
                `span ${rowSpan}`;
        });
    });
}
    function parseRatio(value) {
        const parts = String(value).trim().split('/').map(Number);
        if (parts.length === 1 && parts[0] > 0) return parts[0];
        if (parts.length !== 2 || !parts[0] || !parts[1]) return 1;
        return parts[0] / parts[1];
    }

    function normalizeRatio(value) {
        if (value == null) return null;
        const s = String(value).trim().replace(':', '/').replace(/\s+/g, '');
        if (/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(s)) return s.replace('/', ' / ');
        if (/^\d+(\.\d+)?$/.test(s) && Number(s) > 0) return `${s} / 1`;
        return null;
    }

    // ----------------------------------------------------------------------
    // PARTIE 7 : NAVIGATION VERS LE PROJET SUIVANT
    // ----------------------------------------------------------------------
    const nextLink = document.getElementById('next-project-link');
    const nextTitle = document.getElementById('next-project-title');
    const nextImg = document.getElementById('next-project-img');

    let filteredList = PROJECTS_DATA;
    if (currentFilter && currentFilter !== 'all') {
        filteredList = PROJECTS_DATA.filter(p => Array.isArray(p.tags) && p.tags.includes(currentFilter));
    }

    let filteredIndex = filteredList.findIndex(p => p.id === projectId);

    if (filteredIndex === -1) {
        filteredList = PROJECTS_DATA;
        filteredIndex = filteredList.findIndex(p => p.id === projectId);
    }

    if (filteredIndex !== -1 && filteredList.length > 0) {
        const nextProject = filteredList[(filteredIndex + 1) % filteredList.length];
        const targetUrl = `projets.html?id=${nextProject.id}&filter=${currentFilter}`;

        if (nextLink) nextLink.setAttribute('href', targetUrl);
        if (nextTitle) nextTitle.textContent = nextProject.title;
        if (nextImg && nextProject.imageHero) {
            nextImg.src = nextProject.imageHero;
        }
    }

    // ----------------------------------------------------------------------
    // PARTIE 8 : BOUTON RETOUR
    // ----------------------------------------------------------------------
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (document.referrer && document.referrer.includes(window.location.hostname)) {
                history.back();
            } else {
                window.location.href = `index.html?filter=${currentFilter}#portfolio`;
            }
        });
    }

});