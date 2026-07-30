const GLOW_HINT_DELAY  = 15000;
const PHONE_IDLE_DELAY = 60 * 1000;

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
  function positionLaptop() { positionObject(laptop, 561, 524, 385); }
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
    const mode = isNight ? "night" : "day";
    document.getElementById("vinyl-prev-icon").src = "images/icons/Previous-" + mode + ".svg";
    document.getElementById("vinyl-play-icon").src = "images/icons/Play-" + mode + ".svg";
    document.getElementById("vinyl-pause-icon").src = "images/icons/Pause-" + mode + ".svg";
    document.getElementById("vinyl-skip-icon").src = "images/icons/Skip-" + mode + ".svg";
    document.getElementById("vinyl-speaker-icon").src = "images/icons/speaker-" + mode + ".svg";
  }

  const hour = new Date().getHours();
  applyTheme(hour < 6 || hour >= 20);

  laptop.addEventListener("click", () => openPopup("popup-skills"));
  me.addEventListener("click", () => openPopup("popup-about"));
  if (boxVinyl) boxVinyl.addEventListener("click", () => {
    openPopup("popup-projects");
    positionCarousel();
  });

  // --- Dock magnification effect on skill icons ---
  const skillsIcons = document.querySelector(".skills-icons");
  if (skillsIcons) {
    const MAX_SCALE = 1.5;
    const RADIUS = 80;

    skillsIcons.addEventListener("mousemove", (e) => {
      const icons = skillsIcons.querySelectorAll("img");
      icons.forEach((icon) => {
        const rect = icon.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const iconCenterY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - iconCenterX, e.clientY - iconCenterY);
        const scale = dist < RADIUS
          ? MAX_SCALE - (MAX_SCALE - 1) * (dist / RADIUS)
          : 1;
        icon.style.transform = "scale(" + scale + ")";
      });
    });

    skillsIcons.addEventListener("mouseleave", () => {
      skillsIcons.querySelectorAll("img").forEach((icon) => {
        icon.style.transform = "scale(1)";
      });
    });
  }

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

  ["mousemove", "keydown", "scroll", "touchstart", "click"].forEach(ev => {
    document.addEventListener(ev, resetIdleTimer, { passive: true });
  });
  resetIdleTimer();

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

  // --- Projects Carousel ---
  const carouselItems = document.querySelectorAll(".carousel-item");
  const carouselContainer = document.querySelector(".carousel-container");
  const vinylOpenView = document.getElementById("vinyl-open-view");
  const vinylOpenImg = document.getElementById("vinyl-open-img");
  const vinylCloseOpen = document.getElementById("vinyl-close-open");
  const totalItems = carouselItems.length;
  let carouselIndex = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragDelta = 0;

  const colorToOpen = {
    red: "images/popups/projects/State=open, Color=red.svg",
    yellow: "images/popups/projects/State=open, Color=yellow.svg",
    pink: "images/popups/projects/State=open, Color=pink.svg",
    purple: "images/popups/projects/State=open, Color=purple.svg",
    green: "images/popups/projects/State=open, Color=green.svg",
    lime: "images/popups/projects/State=open, Color=lime.svg",
  };

  const colorToText = {
    lime: {
      title: "images/popups/projects/projects items/CARA FEIA/CARA FEIA-title.svg",
      subtitle: "images/popups/projects/projects items/CARA FEIA/CARA FEIA-subtitle.svg"
    },
    yellow: {
      title: "images/popups/projects/projects items/SALA DE ESTAR/SALA DE ESTAR-title.svg",
      subtitle: "images/popups/projects/projects items/SALA DE ESTAR/SALA DE ESTAR-subtitle.svg"
    },
    purple: {
      title: "images/popups/projects/projects items/aURRA/aURRA title.svg",
      subtitle: "images/popups/projects/projects items/aURRA/aURRA subtitle.svg"
    }
  };

  const vinylTextTitle = document.getElementById("vinyl-text-title");
  const vinylTextSubtitle = document.getElementById("vinyl-text-subtitle");
  const vinylDesc = document.getElementById("vinyl-desc");


  function positionCarousel() {
    const spacing = Math.min(window.innerWidth * 0.22, 280);
    carouselItems.forEach((item, i) => {
      let offset = i - carouselIndex;
      if (offset > totalItems / 2) offset -= totalItems;
      if (offset < -totalItems / 2) offset += totalItems;

      const absOffset = Math.abs(offset);
      const translateX = offset * spacing;
      const translateZ = -absOffset * 150;
      const rotateY = -offset * 20;
      const scale = 1 - absOffset * 0.1;
      const zIndex = 10 - absOffset;
      const hidden = absOffset > 2;

      item.style.transform = "translate(-50%, -50%) translateX(" + (hidden ? 0 : translateX) + "px) translateZ(" + (hidden ? -500 : translateZ) + "px) rotateY(" + (hidden ? 0 : rotateY) + "deg) scale(" + (hidden ? 0.4 : Math.max(scale, 0.5)) + ")";
      item.style.opacity = hidden ? "0" : "1";
      item.style.zIndex = hidden ? 0 : zIndex;
      item.classList.toggle("active", offset === 0);
      item.classList.toggle("hidden-item", hidden);
    });
  }

  function goToSlide(index) {
    carouselIndex = ((index % totalItems) + totalItems) % totalItems;
    positionCarousel();
  }

  carouselItems.forEach((item) => {
    item.addEventListener("click", () => {
      const idx = parseInt(item.dataset.index);
      if (idx === carouselIndex) {
        openVinyl(item);
      } else {
        goToSlide(idx);
      }
    });
  });

  function openVinyl(item) {
    const color = item.dataset.color;
    const img = item.querySelector("img");
    const rect = img.getBoundingClientRect();

    var back = document.createElement("img");
    back.src = img.src;
    back.className = "vinyl-flap-back";
    back.style.left = rect.left + "px";
    back.style.top = rect.top + "px";
    back.style.width = rect.width + "px";
    back.style.height = rect.height + "px";
    document.body.appendChild(back);

    var flap = document.createElement("img");
    flap.src = img.src;
    flap.className = "vinyl-flap";
    flap.style.left = rect.left + "px";
    flap.style.top = rect.top + "px";
    flap.style.width = rect.width + "px";
    flap.style.height = rect.height + "px";
    document.body.appendChild(flap);

    carouselItems.forEach(function(ci) {
      ci.style.transition = "opacity 0.3s ease";
      ci.style.opacity = "0";
    });

    vinylOpenImg.src = colorToOpen[color];

    if (colorToText[color]) {
      vinylTextTitle.src = colorToText[color].title;
      vinylTextSubtitle.src = colorToText[color].subtitle;
      vinylTextTitle.style.display = "block";
      vinylTextSubtitle.style.display = "block";
    } else {
      vinylTextTitle.style.display = "none";
      vinylTextSubtitle.style.display = "none";
    }

    var descTpl = document.getElementById("desc-" + color);
    if (descTpl) {
      vinylDesc.innerHTML = "";
      vinylDesc.appendChild(descTpl.content.cloneNode(true));
      vinylDesc.style.display = "block";
      vinylDesc.scrollTop = 0;
    } else {
      vinylDesc.innerHTML = "";
      vinylDesc.style.display = "none";
    }

    setTimeout(function() {
      carouselContainer.style.display = "none";
      document.querySelector(".projects-close-carousel").style.display = "none";

      requestAnimationFrame(function() {
        flap.classList.add("flap-open");
      });
    }, 300);

    setTimeout(function() {
      vinylOpenView.classList.add("active");
      back.style.transition = "opacity 0.4s ease";
      back.style.opacity = "0";
    }, 850);

    setTimeout(function() {
      flap.remove();
      back.remove();
    }, 1400);
  }

  if (vinylCloseOpen) {
    vinylCloseOpen.addEventListener("click", () => {
      vinylOpenView.classList.remove("active");
      setTimeout(() => {
        carouselContainer.style.display = "";
        document.querySelector(".projects-close-carousel").style.display = "";
        carouselItems.forEach(ci => ci.style.transition = "");
        positionCarousel();
      }, 400);
    });
  }

  // Close projects popup when clicking outside carousel/vinyl
  var projectsPopup = document.querySelector(".projects-popup");
  if (projectsPopup) {
    projectsPopup.addEventListener("click", function(e) {
      if (e.target === projectsPopup || e.target === carouselContainer) {
        if (vinylOpenView.classList.contains("active")) {
          vinylCloseOpen.click();
        } else {
          closePopup("popup-projects");
        }
      }
    });
  }

  // Drag navigation
  if (carouselContainer) {
    carouselContainer.addEventListener("mousedown", (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragDelta = 0;
      carouselContainer.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      dragDelta = e.clientX - dragStartX;
    });

    document.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      carouselContainer.style.cursor = "";
      if (Math.abs(dragDelta) > 50) {
        goToSlide(carouselIndex + (dragDelta < 0 ? 1 : -1));
      }
    });

    carouselContainer.addEventListener("touchstart", (e) => {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragDelta = 0;
    }, { passive: true });

    document.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      dragDelta = e.touches[0].clientX - dragStartX;
    }, { passive: true });

    document.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      if (Math.abs(dragDelta) > 50) {
        goToSlide(carouselIndex + (dragDelta < 0 ? 1 : -1));
      }
    });
  }
});
