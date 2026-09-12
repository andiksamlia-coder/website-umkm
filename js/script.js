const promoButton = document.getElementById("promoButton");
const promoText = document.getElementById("promoText");

promoButton.addEventListener("click", function () {
    promoText.classList.toggle("hidden");

    if (promoButton.textContent === "Lihat Promo Galau Hari Ini") {
        promoButton.textContent = "Promo Hari Ini";
    } else {
        promoButton.textContent = "Lihat Promo Galau Hari Ini";
    }
});