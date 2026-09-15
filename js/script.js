const GLOW_HINT_DELAY  = 15000;
const PHONE_IDLE_DELAY = 60 * 1000;

document.addEventListener("DOMContentLoaded", () => {
  // Carrega SVGs externos referenciados via data-svg (mantém o HTML limpo)
  document.querySelectorAll("[data-svg]").forEach((el) => {
    fetch(el.dataset.svg)
      .then((res) => res.text())
      .then((svgText) => { el.innerHTML = svgText; });
  });

  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const phone = document.getElementById("phone");
  const phoneTooltip = document.getElementById("phone-tooltip");
  const laptop = document.getElementById("laptop");
  const laptopTooltip = document.getElementById("laptop-tooltip");
  const vinylPlayerWrap = document.getElementById("vinyl-player-wrap");
  const vinylPlayer = document.getElementById("vinyl-player");
  const me = document.getElementById("me");
  const meWrap = document.getElementById("me-wrap");
  const meTooltip = document.getElementById("me-tooltip");
  const cat       = document.getElementById("cat");
  const catNormal = document.getElementById("cat-normal");
  const catHover  = document.getElementById("cat-hover");
  const boxVinyl = document.getElementById("box-vinyl");
  const boxVinylTooltip = document.getElementById("box-vinyl-tooltip");
  const lp = document.getElementById("lp");
  const popupSkillsImg = document.getElementById("popup-skills-img");
  const vinylDisc     = document.getElementById("vinyl-disc");
  const vinylPopupBg  = document.getElementById("vinyl-popup-bg");
  const vinylTonearm  = document.getElementById("vinyl-tonearm");

  const IMG_W = 1672;
  const IMG_H = 941;

  function getCoverTransform() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.max(vw / IMG_W, vh / IMG_H);
    const offsetX = (vw - IMG_W * scale) / 2;
    const offsetY = (vh - IMG_H * scale) / 2;
    return { scale, offsetX, offsetY };
  }

  function positionObject(el, imgX, imgY, svgW) {
    const { scale, offsetX, offsetY } = getCoverTransform();
    el.style.left = (offsetX + imgX * scale) + "px";
    el.style.top = (offsetY + imgY * scale) + "px";
    el.style.width = (svgW * scale) + "px";
    el.style.height = "auto";
  }

  function positionToggle() {
    const { scale, offsetX } = getCoverTransform();
    const vw = window.innerWidth;
    const btnW = 114 * scale;
    const idealLeft = offsetX + 1350 * scale;
    const clampedLeft = Math.min(Math.max(idealLeft, 8), vw - btnW - 8);

    themeToggle.style.left = clampedLeft + "px";
    themeToggle.style.top = "10px";
    themeToggle.style.right = "auto";
    themeToggle.style.width = btnW + "px";
  }

  function positionPhone() {
    positionObject(phone, 1404, 627, 129);
    if (phoneTooltip) {
      const rect = phone.getBoundingClientRect();
      phoneTooltip.style.left = (rect.left + rect.width / 2) + "px";
      phoneTooltip.style.top = rect.top + "px";
    }
  }
  function positionLaptop() {
    positionObject(laptop, 551, 524, 385);
    if (laptopTooltip) {
      const rect = laptop.getBoundingClientRect();
      const { scale } = getCoverTransform();
      laptopTooltip.style.left = (rect.left + 170 * scale) + "px";
      laptopTooltip.style.top = (rect.top + 129 * scale) + "px";
    }
  }
  function positionVinylPlayer() { positionObject(vinylPlayerWrap, 1025, 135, 209); }
  function positionMe() {
    positionObject(meWrap, 635, 195, 276);
    if (meTooltip) {
      const rect = meWrap.getBoundingClientRect();
      meTooltip.style.left = (rect.left + rect.width / 2) + "px";
      meTooltip.style.top = rect.top + "px";
    }
  }
  function positionCat() { positionObject(cat, 205, 715, 249); }
  function positionBoxVinyl() {
    if (!boxVinyl) return;
    positionObject(boxVinyl, 972, 738, 479);
    if (boxVinylTooltip) {
      const rect = boxVinyl.getBoundingClientRect();
      boxVinylTooltip.style.left = (rect.left + rect.width / 2) + "px";
      boxVinylTooltip.style.top = rect.top + "px";
    }
  }
  function positionLp() { positionObject(lp, 1056, 245, 108); }

  function positionAll() {
    const { scale } = getCoverTransform();
    document.documentElement.style.setProperty("--scene-scale", scale);
    positionToggle();
    positionPhone();
    positionLaptop();
    positionVinylPlayer();
    positionLp();
    positionMe();
    positionCat();
    positionBoxVinyl();
  }

  window.addEventListener("resize", positionAll);
  positionAll();

  document.querySelectorAll(".scene-popup, .scene-generative, .scene-static").forEach(el => {
    el.style.opacity = "1";
  });
  themeToggle.style.opacity = "1";

  function applyTheme(isNight) {
    document.body.classList.toggle("night-mode", isNight);
    document.body.classList.toggle("day-mode", !isNight);
    themeIcon.src = isNight ? "images/Assets/Sky Switch - Dark.svg" : "images/Assets/Sky Switch - Light.svg";
    phone.src = isNight ? "images/Assets/Phone night.svg" : "images/Assets/Phone day.svg";
    laptop.src = isNight ? "images/Assets/laptop night.svg" : "images/Assets/laptop day.svg";
    vinylPlayer.src = isNight ? "images/Assets/Vinyl player night.svg" : "images/Assets/Vinyl player day.svg";
    me.src = isNight ? "images/Assets/Me night.svg" : "images/Assets/Me day.svg";
    catNormal.src = isNight ? "images/Assets/Cat night.svg" : "images/Assets/Cat day.svg";
    catHover.src  = isNight ? "images/Assets/Cat night eyes closed.svg" : "images/Assets/Cat day eyes closed.svg";
    if (boxVinyl) boxVinyl.src = isNight ? "images/Assets/Box vinyl night.svg" : "images/Assets/Box vinyl day.svg";
    lp.src = isNight ? "images/Assets/LP night.svg" : "images/Assets/LP day.svg";
    popupSkillsImg.src = isNight ? "images/popups/skills night.svg" : "images/popups/skills day.svg";
    vinylPopupBg.src = isNight ? "images/popups/vinyl-player-top-night.svg" : "images/popups/vinyl-player-top-day.svg";
    vinylDisc.src = isNight ? "images/Assets/vinyl-night.svg" : "images/Assets/vinyl-day.svg";
    vinylTonearm.src = isNight ? "images/popups/vinyl-player-top-night.svg" : "images/popups/vinyl-player-top-day.svg";
    const mode = isNight ? "night" : "day";
    document.getElementById("vinyl-prev-icon").src = "images/icons/Previous-" + mode + ".svg";
    document.getElementById("vinyl-play-icon").src = "images/icons/Play-" + mode + ".svg";
    document.getElementById("vinyl-pause-icon").src = "images/icons/Pause-" + mode + ".svg";
    document.getElementById("vinyl-skip-icon").src = "images/icons/Skip-" + mode + ".svg";
    document.getElementById("vinyl-speaker-icon").src = "images/icons/speaker-" + mode + ".svg";
  }

  const hour = new Date().getHours();
  applyTheme(hour < 6 || hour >= 20);

  // --- Triggers que abrem popups (a lógica de cada popup vive em popups.js) ---
  laptop.addEventListener("click", () => openPopup("popup-skills"));
  meWrap.addEventListener("click", () => {
    resetAboutBook();
    openPopup("popup-about");
  });
  if (boxVinyl) boxVinyl.addEventListener("click", () => {
    openPopup("popup-projects");
    window.positionCarousel();
  });
  phone.addEventListener("click", () => {
    stopPhoneRing();
    clearTimeout(idleTimer);
    ["mousemove", "keydown", "scroll", "touchstart", "click"].forEach(ev => {
      document.removeEventListener(ev, resetIdleTimer);
    });
    openPopup("popup-contacts");
  });
  themeToggle.addEventListener("click", () => {
    applyTheme(!document.body.classList.contains("night-mode"));
  });

  // Reinicia a animação SMIL da seta a cada hover (clonar reinicia o timeline)
  function restartArrowOnHover(triggerEl, tooltipEl) {
    if (!triggerEl || !tooltipEl) return;
    triggerEl.addEventListener("mouseenter", () => {
      tooltipEl.querySelectorAll(".tooltip-arrow svg").forEach((arrowSvg) => {
        const clone = arrowSvg.cloneNode(true);
        arrowSvg.replaceWith(clone);
      });
    });
  }

  restartArrowOnHover(meWrap, meTooltip);
  restartArrowOnHover(laptop, laptopTooltip);
  restartArrowOnHover(boxVinyl, boxVinylTooltip);
  restartArrowOnHover(phone, phoneTooltip);
  restartArrowOnHover(vinylPlayerWrap, vinylPlayerWrap);

  // --- Telefone: toca após inatividade ---
  const phoneRing = new Audio("sounds/phone ringing.mp3");
  phoneRing.loop = true;
  let idleTimer = null;

  // Desbloqueia o áudio na primeira interação real do utilizador
  const unlockPhoneAudio = () => {
    phoneRing.play().then(() => { phoneRing.pause(); phoneRing.currentTime = 0; }).catch(() => {});
  };
  ["click", "keydown", "touchstart"].forEach(ev =>
    document.addEventListener(ev, unlockPhoneAudio, { once: true, passive: true })
  );

  const startPhoneRing = () => {
    if (!phoneRing.paused) return;
    phone.classList.add("ringing");
    phoneRing.currentTime = 0;
    // phoneRing.play().catch(() => {});  // ← Som desativado
  };

  const stopPhoneRing = () => {
    phone.classList.remove("ringing");
    phoneRing.pause();
    phoneRing.currentTime = 0;
  };

  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startPhoneRing, PHONE_IDLE_DELAY);
  };

  ["mousemove", "keydown", "scroll", "touchstart", "click"].forEach(ev => {
    document.addEventListener(ev, resetIdleTimer, { passive: true });
  });
  resetIdleTimer();

  // --- Gato: som ao passar/clicar ---
  const purr = new Audio("sounds/cat purr.mp3");
  purr.loop = true;
  const miau = new Audio("sounds/miau.mp3");

  cat.addEventListener("mouseenter", () => {
    purr.currentTime = 0;
    purr.play();
  });
  cat.addEventListener("mouseleave", () => {
    purr.pause();
    purr.currentTime = 0;
    cat.classList.remove("cat-blink");
  });
  cat.addEventListener("click", () => {
    purr.pause();
    miau.currentTime = 0;
    miau.play();
    cat.classList.add("cat-blink");
  });

  // --- Glow hint — chama atenção para os elementos interativos ---
  const glowSequence = [
    { el: meWrap,   delay: 0    },
    { el: laptop,   delay: 3000 },
    { el: boxVinyl, delay: 6000 },
    { el: phone,    delay: 9000 },
  ];
  const glowClickables = document.querySelectorAll(".scene-popup, .scene-generative");
  let glowTimeouts = [];
  let glowInterval = null;

  const runGlow = () => {
    glowTimeouts = [];
    glowSequence.forEach(({ el, delay }) => {
      if (!el) return;
      const t1 = setTimeout(() => {
        el.classList.add("glow-hint");
        const t2 = setTimeout(() => el.classList.remove("glow-hint"), 2500);
        glowTimeouts.push(t2);
      }, delay);
      glowTimeouts.push(t1);
    });
  };

  const stopGlow = () => {
    clearInterval(glowInterval);
    glowInterval = null;
    glowTimeouts.forEach(clearTimeout);
    glowTimeouts = [];
    glowSequence.forEach(({ el }) => el && el.classList.remove("glow-hint"));
    glowClickables.forEach(el => el.removeEventListener("click", stopGlow));
  };

  glowInterval = setInterval(runGlow, GLOW_HINT_DELAY);
  glowClickables.forEach(el => el.addEventListener("click", stopGlow));
});
