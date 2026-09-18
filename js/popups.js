function openPopup(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add("active");
}

function closePopup(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove("active");
}

// Fechar ao clicar fora da caixa
document.querySelectorAll(".popup-overlay").forEach(overlay => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active");
  });
});

// Fechar com Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".popup-overlay.active").forEach(p => p.classList.remove("active"));
  }
});

/* ══════════════════════════════
   Popup "Sobre mim" — livro animado
══════════════════════════════ */

// Repõe o livro fechado à posição original (chamado ao clicar em "me")
function resetAboutBook() {
  const closedImg = document.getElementById("about-bg-closed");
  if (closedImg) closedImg.classList.remove("slide-out");
  const popupAbout = document.getElementById("popup-about");
  if (popupAbout) popupAbout.classList.remove("no-bounce");
}

// Fecha em reverso — aberto → a abrir → fechado a deslizar de volta
function reverseBookClose() {
  const aboutBgOpening = document.getElementById("about-bg-opening");
  const aboutBgOpen = document.getElementById("about-bg-open");
  const aboutBgClosed = document.getElementById("about-bg-closed");

  aboutBgOpen.hidden = true;
  aboutBgOpening.hidden = false;

  setTimeout(() => {
    closePopup("popup-about-open");
    document.getElementById("popup-about").classList.add("no-bounce");
    openPopup("popup-about");

    // Começa já deslizado, sem transição, para depois animar de volta à posição original
    aboutBgClosed.style.transition = "none";
    aboutBgClosed.classList.add("slide-out");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        aboutBgClosed.style.transition = "";
        aboutBgClosed.classList.remove("slide-out");
      });
    });
  }, 200);
}

document.addEventListener("DOMContentLoaded", () => {
  // Livro "Sobre mim": fechado desliza → livro a abrir → livro aberto
  const aboutBgClosed = document.getElementById("about-bg-closed");
  const aboutBgOpening = document.getElementById("about-bg-opening");
  const aboutBgOpen = document.getElementById("about-bg-open");

  if (aboutBgClosed) {
    aboutBgClosed.addEventListener("click", (e) => {
      e.stopPropagation();
      aboutBgClosed.classList.add("slide-out");
      setTimeout(() => {
        closePopup("popup-about");
        aboutBgOpening.hidden = false;
        aboutBgOpen.hidden = true;
        openPopup("popup-about-open");
        setTimeout(() => {
          aboutBgOpening.hidden = true;
          aboutBgOpen.hidden = false;
        }, 200);
      }, 350);
    });

    // Clicar fora do livro fechado fecha
    document.querySelector("#popup-about .about-popup").addEventListener("click", () => {
      closePopup("popup-about");
    });
  }

  // Livro aberto: clicar fora fecha
  if (aboutBgOpen) {
    aboutBgOpen.addEventListener("click", (e) => e.stopPropagation());
    document.querySelector("#popup-about-open .about-popup").addEventListener("click", () => {
      reverseBookClose();
    });
  }

  /* ══════════════════════════════
     Dock magnification — ícones do popup Skills
  ══════════════════════════════ */
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

  /* ══════════════════════════════
     Vinyl Player — controlos do popup
  ══════════════════════════════ */
  const vinylPlayerWrap = document.getElementById("vinyl-player-wrap");
  const vinylPlayBtn  = document.getElementById("vinyl-play");
  const vinylPrevBtn  = document.getElementById("vinyl-prev");
  const vinylSkipBtn  = document.getElementById("vinyl-skip");
  const vinylTrackName = document.getElementById("vinyl-track-name");
  const vinylVolume   = document.getElementById("vinyl-volume");
  const vinylVolFill  = document.getElementById("vinyl-vol-fill");
  const vinylVolThumb = document.getElementById("vinyl-vol-thumb");
  const vinylDisc     = document.getElementById("vinyl-disc");
  const lp = document.getElementById("lp");

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

  function setPlayIcon(playing) {
    const iconPlay  = vinylPlayBtn.querySelector(".icon-play");
    const iconPause = vinylPlayBtn.querySelector(".icon-pause");
    iconPlay.style.display  = playing ? "none" : "";
    iconPause.style.display = playing ? "" : "none";
  }

  // Global: chamado também pelo clique simples no vinyl player na cena (script.js)
  window.toggleVinylPlay = function toggleVinylPlay() {
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
  };

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

  vinylPlayBtn.addEventListener("click", () => window.toggleVinylPlay());
  vinylSkipBtn.addEventListener("click", () => skipTrack());
  vinylPrevBtn.addEventListener("click", () => prevTrack());

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

  // Single click = play, double click = open popup (trigger na cena, lógica aqui)
  let vinylClickTimer = null;
  vinylPlayerWrap.addEventListener("click", (e) => {
    if (vinylClickTimer) {
      clearTimeout(vinylClickTimer);
      vinylClickTimer = null;
      openPopup("popup-vinyl");
    } else {
      vinylClickTimer = setTimeout(() => {
        vinylClickTimer = null;
        window.toggleVinylPlay();
      }, 300);
    }
  });

  /* ══════════════════════════════
     Projects Carousel
  ══════════════════════════════ */
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
    red: {
      title: "images/popups/projects/projects items/CARA FEIA/title.svg",
      subtitle: "images/popups/projects/projects items/CARA FEIA/subtitle.svg"
    },
    yellow: {
      title: "images/popups/projects/projects items/SALA DE ESTAR/title.svg",
      subtitle: "images/popups/projects/projects items/SALA DE ESTAR/subtitle.svg"
    },
    purple: {
      title: "images/popups/projects/projects items/aURRA/title.svg",
      subtitle: "images/popups/projects/projects items/aURRA/subtitle.svg"
    }
  };

  const colorToCover = {
    red: "images/popups/projects/projects items/CARA FEIA/cover.png",
    yellow: "images/popups/projects/projects items/SALA DE ESTAR/cover.png",
    purple: "images/popups/projects/projects items/aURRA/cover.png",
    green: "",
    lime: ""
  };

  const vinylTextTitle = document.getElementById("vinyl-text-title");
  const vinylTextSubtitle = document.getElementById("vinyl-text-subtitle");
  const vinylDesc = document.getElementById("vinyl-desc");

  // Substituir SVG closed pela cover se existir
  carouselItems.forEach((item) => {
    const color = item.dataset.color;
    if (colorToCover[color] && colorToCover[color] !== "") {
      const closedImg = item.querySelector(".vinyl-closed");
      if (closedImg) {
        closedImg.src = colorToCover[color];
        closedImg.alt = color.charAt(0).toUpperCase() + color.slice(1) + " - Capa";
      }
    }
  });

  // Global: chamado também pelo clique na caixa de vinis na cena (script.js)
  window.positionCarousel = function positionCarousel() {
    const spacing = Math.min(window.innerWidth * 0.22, 280);
    carouselItems.forEach((item, i) => {
      let offset = i - carouselIndex;
      if (offset > totalItems / 2) offset -= totalItems;
      if (offset < -totalItems / 2) offset += totalItems;

      const absOffset = Math.abs(offset);
      const translateX = offset * spacing;
      const translateZ = -absOffset * 150;
      const scale = 1 - absOffset * 0.1;
      const zIndex = 10 - absOffset;
      const hidden = absOffset > 2;

      const finalScale = hidden ? 0.4 : Math.max(scale, 0.5);
      const blur = absOffset === 0 ? 0 : absOffset === 1 ? 1.5 : 3;
      item.style.transform = "translate(-50%, -50%) translateX(" + (hidden ? 0 : translateX) + "px) translateZ(" + (hidden ? -500 : translateZ) + "px) scaleX(" + finalScale + ") scaleY(" + finalScale + ")";
      item.style.opacity = hidden ? "0" : "1";
      item.style.zIndex = hidden ? 0 : zIndex;
      item.style.filter = "blur(" + blur + "px)";
      item.classList.toggle("active", offset === 0);
      item.classList.toggle("hidden-item", hidden);
    });
  };

  function goToSlide(index) {
    carouselIndex = ((index % totalItems) + totalItems) % totalItems;
    window.positionCarousel();
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
    back.src = "images/popups/projects/State=closed, Color=" + color + ".svg";
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
        window.positionCarousel();
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
