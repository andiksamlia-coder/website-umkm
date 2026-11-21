(() => {
  "use strict";

  const KEY_NEWSLETTER = "kopi-kenangan-newsletter";

  const formNewsletter = document.querySelector("#form-newsletter");
  if (!formNewsletter) return;

  const pilihMinat = document.querySelector("#newsletter-minat");
  const errorMinat = document.querySelector("#newsletter-error");
  const statusNewsletter = document.querySelector("#status-newsletter");
  const tombolHapus = document.querySelector("#hapus-newsletter");

  function setStatus(pesan, sukses) {
    statusNewsletter.textContent = pesan;
    statusNewsletter.classList.toggle("success", sukses);
  }

  function validasiMinat() {
    pilihMinat.setCustomValidity("");
    const pesan = pilihMinat.validity.valueMissing ? "Pilih info yang ingin diterima." : "";

    pilihMinat.setCustomValidity(pesan);
    pilihMinat.setAttribute("aria-invalid", pesan ? "true" : "false");
    errorMinat.textContent = pesan;

    return pesan === "";
  }

  function simpanNewsletter() {
    const preferensi = {
      minat: pilihMinat.value,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(KEY_NEWSLETTER, JSON.stringify(preferensi));
      setStatus("Minat newsletter disimpan di browser ini.", true);
    } catch (error) {
      console.warn("Minat newsletter gagal disimpan.", error);
      setStatus("Minat newsletter gagal disimpan.", false);
    }
  }

  function muatNewsletter() {
    try {
      const tersimpan = localStorage.getItem(KEY_NEWSLETTER);
      if (!tersimpan) return;

      const preferensi = JSON.parse(tersimpan);
      if (!preferensi || typeof preferensi !== "object") {
        throw new Error("Format newsletter tidak sesuai.");
      }

      pilihMinat.value = preferensi.minat ?? "";
      if (pilihMinat.selectedIndex === -1) pilihMinat.selectedIndex = 0;

      setStatus("Minat newsletter dimuat dari localStorage.", true);
    } catch (error) {
      console.warn("Data newsletter tidak valid.", error);
      localStorage.removeItem(KEY_NEWSLETTER);
    }
  }

  function hapusNewsletter() {
    try {
      localStorage.removeItem(KEY_NEWSLETTER);
      pilihMinat.value = "";
      pilihMinat.removeAttribute("aria-invalid");
      errorMinat.textContent = "";
      setStatus("Minat newsletter sudah dihapus.", true);
    } catch (error) {
      console.warn("Minat newsletter gagal dihapus.", error);
      setStatus("Minat newsletter gagal dihapus.", false);
    }
  }

  formNewsletter.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validasiMinat()) {
      setStatus("Periksa kembali bagian yang memiliki pesan error.", false);
      pilihMinat.focus();
      return;
    }

    simpanNewsletter();
  });

  pilihMinat.addEventListener("change", validasiMinat);
  tombolHapus?.addEventListener("click", hapusNewsletter);

  muatNewsletter();
})();