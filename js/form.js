const KEY_PREFERENSI_KONTAK = "kopi-kenangan-preferensi-kontak";

const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");
const statusPreferensi = document.querySelector("#status-preferensi");
const defaultPreview = preview ? preview.textContent : "";

const fields = ["nama", "email", "telepon", "paket", "pesan", "setuju"]
  .map((id) => document.querySelector(`#${id}`))
  .filter(Boolean);
const topikInputs = document.querySelectorAll('input[name="topik"]');


console.log(fields);

const labelField = {
  nama: "Nama",
  email: "Email",
  telepon: "Nomor WhatsApp",
  paket: "Paket",
  pesan: "Pesan",
  setuju: "Persetujuan",
};


function getFieldError(field) {
  const validity = field.validity;
  const label = labelField[field.id] ?? "Bagian ini";
  const nilai = field.value.trim();
  const isTeks =
    ["text", "email", "tel"].includes(field.type) || field.tagName === "TEXTAREA";

  if (validity.valueMissing || (field.required && isTeks && nilai === "")) {
    if (field.type === "checkbox") return "Centang persetujuan terlebih dahulu.";
    if (field.tagName === "SELECT") return "Pilih paket terlebih dahulu.";
    return `${label} wajib diisi.`;
  }

  if (validity.typeMismatch) {
    return "Format email belum sesuai. Contoh: nama@email.com.";
  }

  if (
    validity.tooShort ||
    (field.minLength > 0 && nilai.length > 0 && nilai.length < field.minLength)
  ) {
    return `${label} minimal ${field.minLength} karakter.`;
  }

  if (validity.patternMismatch) {
    return "Nomor WhatsApp belum sesuai. Contoh: 081234567890.";
  }

  return "";
}



function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);

  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");

  if (error) {
    error.textContent = pesan;
  }
}

function validasiField(field) {
  field.setCustomValidity("");
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

function validasiTopik() {
  const valid = Array.from(topikInputs).some((input) => input.checked);
  const pesan = valid ? "" : "Pilih salah satu topik pertanyaan.";
  const error = document.querySelector("#topik-error");

  topikInputs.forEach((input) => {
    input.setAttribute("aria-invalid", valid ? "false" : "true");
  });

  if (error) {
    error.textContent = pesan;
  }

  return valid;
}



function tampilkanPreview() {
  const data = new FormData(form);
  const telepon = data.get("telepon") || "-";
  const waktu = data.get("waktu") || "-";

  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `WhatsApp: ${telepon}`,
    `Paket: ${data.get("paket")}`,
    `Topik: ${data.get("topik")}`,
    `Waktu kontak: ${waktu}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");

  formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
  formFeedback.classList.add("success");
}



function setStatusPreferensi(pesan, sukses) {
  if (!statusPreferensi) return;
  statusPreferensi.textContent = pesan;
  statusPreferensi.classList.toggle("success", sukses);
}

function simpanPreferensi() {
  const data = new FormData(form);
  const preferensi = {
    paket: data.get("paket") || "",
    topik: data.get("topik") || "",
    updatedAt: new Date().toISOString(),
  };

  if (!preferensi.paket && !preferensi.topik) {
    setStatusPreferensi("Pilih paket atau topik dulu sebelum menyimpan preferensi.", false);
    return;
  }

  try {
    localStorage.setItem(KEY_PREFERENSI_KONTAK, JSON.stringify(preferensi));
    setStatusPreferensi("Preferensi disimpan di browser ini.", true);
  } catch (error) {
    console.warn("Preferensi gagal disimpan.", error);
    setStatusPreferensi("Preferensi gagal disimpan. Penyimpanan browser mungkin dinonaktifkan.", false);
  }
}

function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(KEY_PREFERENSI_KONTAK);
    if (!tersimpan) return;

    const preferensi = JSON.parse(tersimpan);
    if (!preferensi || typeof preferensi !== "object") {
      throw new Error("Format preferensi tidak sesuai.");
    }

    const paket = document.querySelector("#paket");
    paket.value = preferensi.paket ?? "";
    if (paket.selectedIndex === -1) paket.selectedIndex = 0;

    const topik = Array.from(topikInputs).find((input) => input.value === preferensi.topik);
    if (topik) topik.checked = true;

    setStatusPreferensi("Preferensi dimuat dari localStorage.", true);
  } catch (error) {
    console.warn("Preferensi tidak valid.", error);
    localStorage.removeItem(KEY_PREFERENSI_KONTAK);
  }
}

function hapusPreferensi() {
  try {
    localStorage.removeItem(KEY_PREFERENSI_KONTAK);
    setStatusPreferensi("Preferensi tersimpan sudah dihapus.", true);
  } catch (error) {
    console.warn("Preferensi gagal dihapus.", error);
    setStatusPreferensi("Preferensi gagal dihapus.", false);
  }
}


if (form && preview && formFeedback) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const semuaValid = fields.map((field) => validasiField(field)).every(Boolean);
    const topikValid = validasiTopik();

    if (!semuaValid || !topikValid || !form.checkValidity()) {
      formFeedback.textContent = "Periksa kembali bagian yang memiliki pesan error.";
      formFeedback.classList.remove("success");
      preview.textContent = defaultPreview;

      form.reportValidity();
      
      form.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus();
      return;
    }

    tampilkanPreview();
  });

  
  fields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validasiField(field);
    });
    field.addEventListener("change", () => validasiField(field));
  });

  topikInputs.forEach((input) => {
    input.addEventListener("change", validasiTopik);
  });

  form.addEventListener("reset", () => {
    fields.forEach((field) => {
      tampilkanError(field, "");
      field.removeAttribute("aria-invalid");
    });

    topikInputs.forEach((input) => input.removeAttribute("aria-invalid"));
    const topikError = document.querySelector("#topik-error");
    if (topikError) topikError.textContent = "";

    formFeedback.textContent = "";
    formFeedback.classList.remove("success");
    preview.textContent = defaultPreview;
  });

  document.querySelector("#simpan-preferensi")?.addEventListener("click", simpanPreferensi);
  document.querySelector("#hapus-preferensi")?.addEventListener("click", hapusPreferensi);

  muatPreferensi();
}