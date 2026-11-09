"use strict";

console.log("P10 JavaScript aktif");


const produkUmkm = [
  {
    nama: "Kopi Tubruk Signature",
    kategori: "Kopi Hitam",
    harga: 18000,
    stok: 25,
    unggulan: false,
    deskripsi: "Kopi hitam pekat dengan aroma khas.",
  },
  {
    nama: "Cold Brew Aren",
    kategori: "Cold Brew",
    harga: 24000,
    stok: 4,
    unggulan: false,
    deskripsi: "Cold brew ringan dengan manis gula aren.",
  },
  {
    nama: "Americano Peach",
    kategori: "Americano",
    harga: 19000,
    stok: 12,
    unggulan: false,
    deskripsi: "Espresso dengan rasa peach yang segar.",
  },
  {
    nama: "Americano Blackcurrant",
    kategori: "Americano",
    harga: 29000,
    stok: 0,
    unggulan: false,
    deskripsi: "Americano blackcurrant, manis dan sedikit asam.",
  },
  {
    nama: "V60",
    kategori: "Manual Brew",
    harga: 16000,
    stok: 20,
    unggulan: false,
    deskripsi: "Manual brew dengan rasa bersih.",
  },
  {
    nama: "Es Kopi Kenangan Galau",
    kategori: "Kopi Susu",
    harga: 22000,
    stok: 15,
    unggulan: true,
    deskripsi: "Espresso, susu creamy, dan gula aren.",
  },
  {
    nama: "Latte Kenangan Manis",
    kategori: "Kopi Susu",
    harga: 23000,
    stok: 3,
    unggulan: false,
    deskripsi: "Espresso dan susu creamy dengan karamel manis.",
  },
];


function formatRupiah(nilai) {
  const angka = Number.isFinite(Number(nilai)) ? Number(nilai) : 0;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}


function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", className: "empty" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}


function labelKategori(kategori) {
  switch (kategori) {
    case "Kopi Hitam":
      return "Kopi hitam klasik";
    case "Cold Brew":
    case "Americano":
      return "Kopi dingin";
    case "Manual Brew":
      return "Seduh manual";
    case "Kopi Susu":
      return "Kopi dengan susu";
    default:
      return "Menu Kopi Kenangan";
  }
}


function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);
  const adaStok = produk.stok > 0;
  const labelAksi = adaStok ? "Pesan" : "Tanya admin";
  const tautanAksi = adaStok ? "https://wa.me/6281234567890" : "kontak.html";
  const labelUnggulan = produk.unggulan ? "Produk unggulan" : "";

  return `
    <article class="js-product-card${produk.unggulan ? " unggulan" : ""}">
      <h3>${produk.nama}</h3>
      <p class="kategori">${produk.kategori} - ${labelKategori(produk.kategori)}</p>
      <p class="price">${formatRupiah(produk.harga)}</p>
      <p>${produk.deskripsi}</p>
      <span class="stock-badge ${status.className}">${status.label}</span>
      <p class="label-unggulan">${labelUnggulan}</p>
      <a class="button" href="${tautanAksi}" aria-label="${labelAksi} ${produk.nama}">${labelAksi}</a>
    </article>
  `;
}


function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");

  
  if (!grid && !ringkasan && !unggulan) {
    return;
  }

  
  if (!grid || !ringkasan || !unggulan) {
    console.warn("Target render produk belum lengkap.");
    return;
  }

  
  produkUmkm.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
  });

  const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
  const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
  const markupProduk = produkTersedia.map(buatKartuProduk).join("");

  grid.innerHTML = markupProduk;
  ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;
  unggulan.textContent = produkUnggulan
    ? `Produk unggulan: ${produkUnggulan.nama}`
    : "Belum ada produk unggulan.";

  console.table(produkUmkm);
}

document.addEventListener("DOMContentLoaded", renderProduk);