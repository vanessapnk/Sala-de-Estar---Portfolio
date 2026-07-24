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
