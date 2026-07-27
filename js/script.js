const GLOW_HINT_DELAY  = 15000;
const PHONE_IDLE_DELAY = 15000; // testar com 15s; produção: 3 * 60 * 1000

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const phone = document.getElementById("phone");
  const laptop = document.getElementById("laptop");
  const vinylPlayerWrap = document.getElementById("vinyl-player-wrap");
  const vinylPlayer = document.getElementById("vinyl-player");
  const me = document.getElementById("me");
  const cat       = document.getElementById("cat");
  const catNormal = document.getElementById("cat-normal");
  const catHover  = document.getElementById("cat-hover");
  const boxVinyl = document.getElementById("box-vinyl");
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

  function positionPhone() { positionObject(phone, 1404, 627, 129); }
  function positionLaptop() { positionObject(laptop, 581.4, 544, 335); }
  function positionVinylPlayer() { positionObject(vinylPlayerWrap, 1025, 135, 209); }
  function positionMe() { positionObject(me, 635, 195, 276); }
  function positionCat() { positionObject(cat, 205, 715, 249); }
  function positionBoxVinyl() { if (boxVinyl) positionObject(boxVinyl, 972, 738, 479); }
  function positionLp() { positionObject(lp, 1056, 245, 108); }

  function positionAll() {
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
  }

  const hour = new Date().getHours();
  applyTheme(hour < 6 || hour >= 20);

  laptop.addEventListener("click", () => openPopup("popup-skills"));
  me.addEventListener("click", () => openPopup("popup-about"));

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
    phoneRing.play().catch(() => {});
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

  // ["mousemove", "keydown", "scroll", "touchstart", "click"].forEach(ev => {
  //   document.addEventListener(ev, resetIdleTimer, { passive: true });
  // });

  phone.addEventListener("click", () => {
    stopPhoneRing();
    clearTimeout(idleTimer);
    ["mousemove", "keydown", "scroll", "touchstart", "click"].forEach(ev => {
      document.removeEventListener(ev, resetIdleTimer);
    });
    openPopup("popup-contacts");
  });

  // resetIdleTimer(); // desativado temporariamente

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

  // --- Vinyl Player ---
  const vinylPlayBtn  = document.getElementById("vinyl-play");
  const vinylPrevBtn  = document.getElementById("vinyl-prev");
  const vinylSkipBtn  = document.getElementById("vinyl-skip");
  const vinylTrackName = document.getElementById("vinyl-track-name");
  const vinylVolume   = document.getElementById("vinyl-volume");
  const vinylVolFill  = document.getElementById("vinyl-vol-fill");
  const vinylVolThumb = document.getElementById("vinyl-vol-thumb");

  const playlist = [
    { title: "Bloom", src: "sounds/playlist/01 - Bloom.wav" },
    { title: "Morning Mr Magpie", src: "sounds/playlist/02 - Morning Mr Magpie.wav" },
    { title: "Little By Little", src: "sounds/playlist/03 - Little By Little.wav" },
    { title: "Feral", src: "sounds/playlist/04 - Feral.wav" },
    { title: "Lotus Flower", src: "sounds/playlist/05 - Lotus Flower.wav" },
    { title: "Codex", src: "sounds/playlist/06 - Codex.wav" },
    { title: "Give Up The Ghost", src: "sounds/playlist/07 - Give Up The Ghost.wav" },
    { title: "Separator", src: "sounds/playlist/08 - Separator.wav" },
  ];
  let currentTrack = 0;
  let vinylAudio = null;
  let isVinylPlaying = false;

  function loadTrack(index) {
    if (playlist.length === 0) return;
    currentTrack = ((index % playlist.length) + playlist.length) % playlist.length;
    const track = playlist[currentTrack];
    if (!vinylAudio) {
      vinylAudio = new Audio();
      vinylAudio.addEventListener("ended", () => skipTrack());
    }
    vinylAudio.src = track.src;
    vinylAudio.volume = parseFloat(vinylVolFill.style.height || "80") / 100;
    vinylTrackName.textContent = track.title;
    vinylTrackName.classList.add("visible");
  }

  function toggleVinylPlay() {
    if (playlist.length > 0 && !vinylAudio) loadTrack(0);
    if (isVinylPlaying) {
      if (vinylAudio) vinylAudio.pause();
      vinylDisc.classList.remove("spinning");
      const cs = getComputedStyle(lp);
      const curTransform = cs.transform;
      const curFilter = cs.filter;
      lp.classList.remove("floating");
      lp.style.transform = curTransform;
      lp.style.filter = curFilter;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          lp.style.transform = "";
          lp.style.filter = "";
        });
      });
      setPlayIcon(false);
    } else {
      if (vinylAudio) vinylAudio.play().catch(() => {});
      vinylDisc.classList.add("spinning");
      lp.style.transform = "";
      lp.style.filter = "";
      lp.classList.add("floating");
      setPlayIcon(true);
    }
    isVinylPlaying = !isVinylPlaying;
  }

  function skipTrack() {
    loadTrack(currentTrack + 1);
    if (isVinylPlaying) {
      vinylAudio.play().catch(() => {});
    }
  }

  function prevTrack() {
    if (vinylAudio && vinylAudio.currentTime > 3) {
      vinylAudio.currentTime = 0;
      return;
    }
    loadTrack(currentTrack - 1);
    if (isVinylPlaying) {
      vinylAudio.play().catch(() => {});
    }
  }

  function setPlayIcon(playing) {
    const iconPlay  = vinylPlayBtn.querySelector(".icon-play");
    const iconPause = vinylPlayBtn.querySelector(".icon-pause");
    iconPlay.style.display  = playing ? "none" : "";
    iconPause.style.display = playing ? "" : "none";
  }

  // Single click = play, double click = open popup
  let vinylClickTimer = null;
  let vinylFirstClicked = false;
  vinylPlayerWrap.addEventListener("click", (e) => {
    if (vinylClickTimer) {
      clearTimeout(vinylClickTimer);
      vinylClickTimer = null;
      openPopup("popup-vinyl");
    } else {
      vinylClickTimer = setTimeout(() => {
        vinylClickTimer = null;
        toggleVinylPlay();
        if (!vinylFirstClicked) {
          vinylFirstClicked = true;
          vinylPlayerWrap.classList.add("show-tooltip");
        }
      }, 300);
    }
  });

  // Popup controls
  vinylPlayBtn.addEventListener("click", () => toggleVinylPlay());
  vinylSkipBtn.addEventListener("click", () => skipTrack());
  vinylPrevBtn.addEventListener("click", () => prevTrack());

  // Volume slider
  function setVolume(pct) {
    pct = Math.max(0, Math.min(100, pct));
    vinylVolFill.style.height = pct + "%";
    vinylVolThumb.style.bottom = "calc(" + pct + "% - max(4px, 0.5cqw))";
    if (vinylAudio) vinylAudio.volume = pct / 100;
  }

  function handleVolEvent(e) {
    const rect = vinylVolume.getBoundingClientRect();
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const pct = ((rect.bottom - y) / rect.height) * 100;
    setVolume(pct);
  }

  vinylVolume.addEventListener("mousedown", (e) => {
    handleVolEvent(e);
    const onMove = (ev) => handleVolEvent(ev);
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  vinylVolume.addEventListener("touchstart", (e) => {
    handleVolEvent(e);
    const onMove = (ev) => { ev.preventDefault(); handleVolEvent(ev); };
    const onEnd = () => {
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
  }, { passive: true });

  setVolume(80);

  themeToggle.addEventListener("click", () => {
    applyTheme(!document.body.classList.contains("night-mode"));
  });

  const glowSequence = [
    { el: me,       delay: 0    },
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
