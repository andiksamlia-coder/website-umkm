"use strict";

console.log("P12 JavaScript aktif");


const produkUmkm = [
  {
    nama: "Kopi Tubruk Signature",
    kategori: "Kopi",
    harga: 18000,
    stok: 25,
    unggulan: false,
    deskripsi: "Kopi hitam pekat dengan aroma khas.",
  },
  {
    nama: "Cold Brew Aren",
    kategori: "Kopi",
    harga: 24000,
    stok: 4,
    unggulan: false,
    deskripsi: "Cold brew ringan dengan manis gula aren.",
  },
  {
    nama: "Americano Peach",
    kategori: "Kopi",
    harga: 19000,
    stok: 12,
    unggulan: false,
    deskripsi: "Espresso dengan rasa peach yang segar.",
  },
  {
    nama: "Americano Blackcurrant",
    kategori: "Kopi",
    harga: 29000,
    stok: 0,
    unggulan: false,
    deskripsi: "Americano blackcurrant, manis dan sedikit asam.",
  },
  {
    nama: "V60",
    kategori: "Kopi",
    harga: 16000,
    stok: 20,
    unggulan: false,
    deskripsi: "Manual brew dengan rasa bersih.",
  },
  {
    nama: "Es Kopi Kenangan Galau",
    kategori: "Kopi",
    harga: 22000,
    stok: 15,
    unggulan: true,
    deskripsi: "Espresso, susu creamy, dan gula aren.",
  },
  {
    nama: "Latte Kenangan Manis",
    kategori: "Kopi",
    harga: 23000,
    stok: 3,
    unggulan: false,
    deskripsi: "Espresso dan susu creamy dengan karamel manis.",
  },
  {
    nama: "Paket Galauin",
    kategori: "Bundling",
    harga: 45000,
    stok: 10,
    unggulan: false,
    deskripsi: "Paket kopi untuk menemani malam yang galau.",
  },
  {
    nama: "Paket Ngangenin",
    kategori: "Bundling",
    harga: 50000,
    stok: 4,
    unggulan: false,
    deskripsi: "Paket kopi untuk mengenang momen yang bikin kangen.",
  },
  {
    nama: "Paket Nemenin",
    kategori: "Bundling",
    harga: 60000,
    stok: 0,
    unggulan: false,
    deskripsi: "Paket kopi untuk menemani waktu santai bersama.",
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
    case "Kopi":
      return "Menu kopi";
    case "Bundling":
      return "Paket hemat";
    default:
      return "Menu Kopi Kenangan";
  }
}


const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const tombolFilter = document.querySelectorAll("[data-filter]");


function buatElemenProduk(produk) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = produk.kategori;

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(produk.harga);

  const stock = document.createElement("span");
  const status = statusStok(produk.stok);
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  card.append(title, category, price, stock);

  
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Sembunyikan";
  removeButton.classList.add("ghost-button");

  removeButton.addEventListener("click", () => {
    card.remove();
    produkStatus.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
  });

  card.append(removeButton);

  return card;
}


function buatEmptyState(kategori) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
  return empty;
}


function renderProduk(kategoriAktif = "Semua") {
  if (!produkGrid || !produkStatus) {
    console.warn("Target render produk tidak ditemukan.");
    return;
  }

  const produkTampil = kategoriAktif === "Semua"
    ? produkUmkm
    : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

  produkGrid.replaceChildren();

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif));
    produkStatus.textContent = "0 produk ditemukan.";
    return;
  }

  produkTampil.forEach((produk) => {
    produkGrid.append(buatElemenProduk(produk));
  });

  produkStatus.textContent = `${produkTampil.length} produk ditampilkan.`;
}

renderProduk();


tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const kategori = tombolAktif.dataset.filter;

    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    tombolAktif.classList.add("is-active");

    renderProduk(kategori);
  });
});