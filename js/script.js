const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const phone = document.getElementById("phone");
const laptop = document.getElementById("laptop");
const vinylPlayer = document.getElementById("vinyl-player");
const me = document.getElementById("me");
const cat = document.getElementById("cat");
const boxVinyl = document.getElementById("box-vinyl");
const lp = document.getElementById("lp");
const popupSkillsImg = document.getElementById("popup-skills-img");

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
function positionVinylPlayer() { positionObject(vinylPlayer, 1025, 135, 209); }
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

laptop.addEventListener("click", () => openPopup("popup-skills"));
phone.addEventListener("click", () => openPopup("popup-contacts"));
me.addEventListener("click", () => openPopup("popup-about"));

themeToggle.addEventListener("click", () => {
  const isNight = document.body.classList.toggle("night-mode");
  document.body.classList.toggle("day-mode", !isNight);

  themeIcon.src = isNight
    ? "images/Assets/Sky Switch - Dark.svg"
    : "images/Assets/Sky Switch - Light.svg";

  phone.src = isNight
    ? "images/Assets/Phone night.svg"
    : "images/Assets/Phone day.svg";

  laptop.src = isNight
    ? "images/Assets/laptop night.svg"
    : "images/Assets/laptop day.svg";

  vinylPlayer.src = isNight
    ? "images/Assets/Vinyl player night.svg"
    : "images/Assets/Vinyl player day.svg";

  me.src = isNight
    ? "images/Assets/Me night.svg"
    : "images/Assets/Me day.svg";

  cat.src = isNight
    ? "images/Assets/Cat night.svg"
    : "images/Assets/Cat day.svg";

  if (boxVinyl) boxVinyl.src = isNight
    ? "images/Assets/Box vinyl night.svg"
    : "images/Assets/Box vinyl day.svg";

  lp.src = isNight
    ? "images/Assets/LP night.svg"
    : "images/Assets/LP day.svg";

  popupSkillsImg.src = isNight
    ? "images/popups/skills night.svg"
    : "images/popups/skills day.svg";
});
