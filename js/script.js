const promoButton = document.querySelector("#promoButton");

if (promoButton) {
  promoButton.addEventListener("click", () => {
      promoButton.textContent = "Beli 1 gratis 1!";
      console.log("Promo Kopi Kenangan berhasil ditampilkan.");
  });
}


const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#menu-utama");

if (navToggle && navMenu) {
  const desktopQuery = window.matchMedia("(min-width: 42rem)");

  
  document.documentElement.classList.add("js");

  const setMenu = (open) => {
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  };

  navToggle.addEventListener("click", () => {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });

  
  navMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      navToggle.focus();
    }
  });

  
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
}