const referenssiDialog = document.getElementById("referenssiTiedot");
const referenssiLista = document.getElementById("referenssiLista");
const referenssiKuva = document.getElementById("referenssiKuva");
const referenssiOtsikko = document.getElementById("referenssiOtsikko");
const referenssiKuvaus = document.getElementById("referenssiKuvaus");
const suljeReferenssi = document.getElementById("suljeReferenssi");
const edellinenKuva = document.getElementById("edellinenKuva");
const seuraavaKuva = document.getElementById("seuraavaKuva");
const kuvaLaskuri = document.getElementById("kuvaLaskuri");
const nav = document.querySelector("nav");
const menuToggle = document.querySelector(".menuToggle");
const arvioLomake = document.querySelector(".arvioLomake");
const arvioLomakeIlmoitus = document.querySelector(".arvioLomakeIlmoitus");
const arvioLaheta = arvioLomake.querySelector(".arvioLaheta");

function suljeValikko() {
    nav.dataset.menuOpen = "false";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Avaa valikko");
}

function updateNavScrollState() {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", updateNavScrollState, { passive: true });
updateNavScrollState();

let arvioLahetysKaynnissa = false;
arvioLomake.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (arvioLahetysKaynnissa) {
        return;
    }

    arvioLahetysKaynnissa = true;
    arvioLaheta.disabled = true;
    arvioLaheta.textContent = "Lähetetään...";
    arvioLomakeIlmoitus.textContent = "";
    delete arvioLomakeIlmoitus.dataset.state;

    try {
        const response = await fetch(arvioLomake.action, {
            method: "POST",
            body: new FormData(arvioLomake),
            headers: { Accept: "application/json" }
        });

        if (!response.ok) {
            arvioLomakeIlmoitus.dataset.state = "error";
            arvioLomakeIlmoitus.textContent = "Lähetys ei onnistunut. Tarkista tiedot ja yritä uudelleen, tai ota meihin yhteyttä puhelimitse.";
            return;
        }

        arvioLomake.reset();
        arvioLomakeIlmoitus.dataset.state = "success";
        arvioLomakeIlmoitus.textContent = "Kiitos viestistäsi! Arviointipyyntösi on lähetetty. Palaamme asiaan mahdollisimman pian.";
    } catch {
        arvioLomakeIlmoitus.dataset.state = "error";
        arvioLomakeIlmoitus.textContent = "Lähetys ei onnistunut verkkovirheen vuoksi. Tarkista yhteys ja yritä uudelleen.";
    } finally {
        arvioLahetysKaynnissa = false;
        arvioLaheta.disabled = false;
        arvioLaheta.textContent = "Lähetä arviointipyyntö";
    }
});

menuToggle.addEventListener("click", () => {
    const avattu = menuToggle.getAttribute("aria-expanded") === "true";
    nav.dataset.menuOpen = String(!avattu);
    menuToggle.setAttribute("aria-expanded", String(!avattu));
    menuToggle.setAttribute("aria-label", avattu ? "Avaa valikko" : "Sulje valikko");
});

nav.querySelectorAll(".links a").forEach((link) => {
    link.addEventListener("click", suljeValikko);
});

document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) {
        suljeValikko();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        suljeValikko();
        menuToggle.focus();
    }
});

const mainSection = document.querySelector("main");
const mainImages = [
    { selector: ".kuva1", x: -1, y: -0.5 },
    { selector: ".kuva2", x: -1, y: 0.5 },
    { selector: ".kuva4", x: 1, y: 0.5 },
    { selector: ".kuva3", x: 1, y: -0.5 }
].map(({ selector, x, y }) => ({
    element: mainSection.querySelector(selector),
    x,
    y
}));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mainImagesUseGrid = window.matchMedia("(max-width: 760px), (max-height: 600px) and (max-width: 1000px)");
let mainScrollUpdatePending = false;

function updateMainImages() {
    mainScrollUpdatePending = false;

    if (reducedMotion.matches || mainImagesUseGrid.matches) {
        mainImages.forEach(({ element }) => {
            element.style.transform = "";
        });
        return;
    }

    const bounds = mainSection.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0,
        (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)
    ));
    const distance = progress * Math.min(160, Math.max(32, window.innerWidth * 0.12));

    mainImages.forEach(({ element, x, y }) => {
        element.style.transform = `translate3d(${distance * x}px, ${distance * y}px, 0)`;
    });
}

function scheduleMainImageUpdate() {
    if (!mainScrollUpdatePending) {
        mainScrollUpdatePending = true;
        window.requestAnimationFrame(updateMainImages);
    }
}

window.addEventListener("scroll", scheduleMainImageUpdate, { passive: true });
window.addEventListener("resize", scheduleMainImageUpdate);
reducedMotion.addEventListener("change", scheduleMainImageUpdate);
scheduleMainImageUpdate();

const referenssit = [
    {
        image: "./Kuvat/WhatsApp Image 2026-10-31 at 20.21.334.jpeg",
        images: [
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.21.334.jpeg",
            "./Kuvat/1.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.22.092.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.22.105.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.22.106.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.22.1011.jpeg"
        ],
        title: "Omakotitalo ja autotalli",
        description: "Omakotitalon ja autotallin maalaustyö."
    },
    {
        image: "./Kuvat/WhatsApp Image 2026-10-31 at 20.22.09.jpeg",
        images: [
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.22.09.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.22.jpeg"
        ],
        title: "Autotalli",
        description: "Autotallin maalaustyö."
    },
    {
        image: "./Kuvat/WhatsApp Image 2026-10-31 at 20.22.1012.jpeg",
        images: [
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.22.1012.jpeg"
        ],
        title: "Omakotitalo",
        description: "Normaali omakotitalon maalaus. Talo sijaitsee Kurkimäessä."
    },
    {
        image: "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2842.jpeg",
        images: [
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2842.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.22.1115.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.22.1118.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.22.1120.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2945.jpeg"
        ],
        title: "Omakotitalon homepesu",
        description: "Omakotitalon puuosien homepesu. Talo sijaitsee Varkaudessa."
    },
    {
        image: "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2734.jpeg",
        images: [
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2733.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2734.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2735.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2736.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2838.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.27.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2528.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2424.jpeg",
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2629.jpeg"
        ],
        title: "Hirsitalo",
        description: "Valmiin hirsitalon normaali maalaus."
    },
    {
        image: "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2950.jpeg",
        images: [
            "./Kuvat/WhatsApp Image 2026-10-31 at 20.26.2950.jpeg"
        ],
        title: "Kesäkeittiö",
        description: "Normaali maalaus."
    },
];

let aktiivinenReferenssi = null;
let aktiivinenKuva = 0;

function naytaKuva() {
    const kuvat = aktiivinenReferenssi.images ?? [aktiivinenReferenssi.image];
    referenssiKuva.src = kuvat[aktiivinenKuva];
    referenssiKuva.alt = `${aktiivinenReferenssi.title} – kuva ${aktiivinenKuva + 1}`;
    kuvaLaskuri.textContent = `${aktiivinenKuva + 1} / ${kuvat.length}`;
    edellinenKuva.hidden = kuvat.length < 2;
    seuraavaKuva.hidden = kuvat.length < 2;
}

referenssit.forEach((referenssi) => {
    const button = document.createElement("button");
    button.className = "referenssi";
    button.type = "button";
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-controls", "referenssiTiedot");

    const image = document.createElement("img");
    image.className = "kuva";
    image.loading = "lazy";
    image.decoding = "async";
    image.alt = referenssi.title;
    image.src = referenssi.image;

    const title = document.createElement("span");
    title.textContent = referenssi.title;

    button.append(image, title);
    button.addEventListener("click", () => {
        aktiivinenReferenssi = referenssi;
        aktiivinenKuva = 0;
        naytaKuva();
        referenssiOtsikko.textContent = referenssi.title;
        referenssiKuvaus.textContent = referenssi.description;
        referenssiDialog.showModal();
    });

    referenssiLista.append(button);
});

edellinenKuva.addEventListener("click", () => {
    const kuvat = aktiivinenReferenssi.images ?? [aktiivinenReferenssi.image];
    aktiivinenKuva = (aktiivinenKuva - 1 + kuvat.length) % kuvat.length;
    naytaKuva();
});

seuraavaKuva.addEventListener("click", () => {
    const kuvat = aktiivinenReferenssi.images ?? [aktiivinenReferenssi.image];
    aktiivinenKuva = (aktiivinenKuva + 1) % kuvat.length;
    naytaKuva();
});

suljeReferenssi.addEventListener("click", () => {
    referenssiDialog.close();
});

referenssiDialog.addEventListener("click", (event) => {
    if (event.target === referenssiDialog) {
        referenssiDialog.close();
    }
});
