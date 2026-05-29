const form =
document.getElementById(
"silatForm"
);

const statusDiv =
document.getElementById(
"status"
);

const toastDiv = document.getElementById("toast");
const telefonInputEl = document.getElementById("telefon");

// Auto-format No. Telefon ketika menaip
telefonInputEl.addEventListener("input", function (e) {
  let val = e.target.value.replace(/\D/g, ""); // Buang semua huruf/simbol kecuali nombor
  if (val.length > 11) val = val.substring(0, 11); // Hadkan kepada 11 digit nombor maksima
  
  let formatted = val;
  if (val.length > 3 && val.length <= 10) {
    formatted = val.substring(0, 3) + " " + val.substring(3, 6) + (val.length > 6 ? " " + val.substring(6) : "");
  } else if (val.length === 11) {
    formatted = val.substring(0, 3) + " " + val.substring(3, 7) + " " + val.substring(7);
  }
  
  e.target.value = formatted;
});

// Auto-uppercase untuk input teks dan catatan ketika menaip
const textInputs = document.querySelectorAll('input[type="text"], textarea');
textInputs.forEach(input => {
  input.addEventListener("input", function (e) {
    e.target.value = e.target.value.toUpperCase();
  });
});

// Fungsi memaparkan notifikasi Toast
function showToast(message) {
  toastDiv.innerHTML = message;
  toastDiv.classList.add("show");
  
  setTimeout(() => {
    toastDiv.classList.remove("show");
  }, 3500); // Hilang sendiri selepas 3.5 saat
}

// Tetapkan tarikh tutup (26 Jun 2026, 11:59:59 PM Waktu Malaysia)
const tarikhTutup = new Date("2026-06-26T23:59:59+08:00");

// Semak jika waktu sekarang sudah melepasi tarikh tutup semasa halaman dimuatkan
if (new Date() > tarikhTutup) {
  Array.from(form.elements).forEach(el => el.disabled = true); // Nyahaktifkan semua input
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.innerHTML = "Pendaftaran Ditutup";
  submitBtn.style.background = "#555";
  submitBtn.style.color = "#aaa";
  submitBtn.style.boxShadow = "none";
  statusDiv.style.color = "#ff4444";
  statusDiv.innerHTML = "⚠️ Harap maaf, tarikh pendaftaran telah tamat pada 26 Jun 2026.";
}

// Fungsi 'debounce' (jenis leading-edge) untuk mengelak klik bertubi-tubi
function debounceSubmit(func, wait) {
  let timeout;
  return function (e, ...args) {
    if (e && e.preventDefault) e.preventDefault(); // Mesti sentiasa halang form refresh
    
    const callNow = !timeout; // Laksana serta-merta pada klik pertama
    clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      timeout = null; // Buka semula 'kunci' selepas tempoh tamat
    }, wait);
    
    if (callNow) func.apply(this, [e, ...args]);
  };
}

form.addEventListener(
"submit",

debounceSubmit(async (e)=>{

// e.preventDefault() kini diuruskan secara automatik di dalam fungsi debounceSubmit

// Semakan sekuriti tambahan jika borang cuba dihantar selepas tarikh tutup
if (new Date() > tarikhTutup) {
  statusDiv.innerHTML = "⚠️ Harap maaf, tarikh pendaftaran telah tamat.";
  return;
}

const pesertaInput = document.getElementById("peserta").value;
const telefonInput = document.getElementById("telefon").value;

// Semak jika input HANYA mengandungi digit nombor, dan nilainya antara 1 hingga 500
if (!/^\d+$/.test(pesertaInput) || parseInt(pesertaInput) < 1 || parseInt(pesertaInput) > 500) {
  statusDiv.style.color = "#ff4444"; // Warna merah muda untuk ralat
  statusDiv.innerHTML = "❌ Ralat: Jumlah Peserta mestilah nombor yang sah (1 hingga 500).";
  return; // Hentikan fungsi jika ralat
}

// Semak format nombor telefon (mesti bermula dengan 01 dan mempunyai format berjarak)
if (!/^01\d \d{3,4} \d{4}$/.test(telefonInput)) {
  statusDiv.style.color = "#ff4444";
  statusDiv.innerHTML = "❌ Ralat: Sila masukkan No. Telefon yang sah (Contoh: 012 345 6789).";
  return; // Hentikan fungsi jika ralat
}

statusDiv.style.color = "white"; // Kembalikan ke warna asal jika tiada ralat
statusDiv.innerHTML =
"Menghantar data...";

document.getElementById("shareBtn").style.display = "none"; // Sembunyikan butang jika pengguna mendaftar lagi

const submitBtn = form.querySelector('button[type="submit"]');
const originalBtnText = submitBtn.innerHTML;
submitBtn.innerHTML = '<span class="spinner"></span> Sedang Menghantar...';
submitBtn.disabled = true; // Elakkan spam klik

// Masukkan URL Web App Google Apps Script anda yang disalin tadi di sini:
const scriptURL = 'https://script.google.com/macros/s/AKfycbwp3eM1D6tIxY3LO1hfHkJ4EV2huaoW7NYy-825nrdtTg1S-jQHq2qO9PJOdGhkHFVX0w/exec';

try {
  // Hantar borang ke Google Script menggunakan Fetch API
  const response = await fetch(scriptURL, { method: 'POST', body: new FormData(form) });
  const resultText = await response.text();
  
  if (response.ok) {
    if (resultText.trim() === "Quota_Full") {
      statusDiv.style.color = "#ff4444";
      statusDiv.innerHTML = "⚠️ Harap maaf, pendaftaran gagal. Kuota maksimum 500 orang peserta telah penuh!";
    } else {
      statusDiv.innerHTML = ""; // Kosongkan teks status
      showToast("✅ Pendaftaran berjaya dihantar!");
      
      // Ambil data dari kotak borang sebelum dikosongkan
      const valPertubuhan = document.getElementById("pertubuhan").value;
      const valPengerusi = document.getElementById("pengerusi").value;
      const valTelefon = document.getElementById("telefon").value;
      const valPeserta = document.getElementById("peserta").value;
      const valCatatan = document.getElementById("catatan").value || "TIADA CATATAN";
      
      form.reset(); // Kosongkan borang
      
      // Masukkan ke dalam kotak ringkasan
      document.getElementById("sumPertubuhan").innerText = valPertubuhan;
      document.getElementById("sumPengerusi").innerText = valPengerusi;
      document.getElementById("sumTelefon").innerText = valTelefon;
      document.getElementById("sumPeserta").innerText = valPeserta;
      document.getElementById("sumCatatan").innerText = valCatatan;
      
      // Tunjukkan butang Share WhatsApp
      const shareBtn = document.getElementById("shareBtn");
      const shareText = "Jom sertai Program RMS Rumpun Selangor 2026! Daftar pasukan anda segera di sini: " + window.location.href;
      shareBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      shareBtn.style.display = "block";
      
      // Sembunyikan borang, tunjukkan ringkasan
      form.style.display = "none";
      document.getElementById("summary").style.display = "block";
    }
  } else {
    throw new Error('Ralat rangkaian');
  }
} catch (error) {
  statusDiv.style.color = "#ff4444";
  statusDiv.innerHTML = "❌ Ralat: Gagal menghantar data. Sila cuba lagi.";
  console.error(error);
} finally {
  // Kembalikan keadaan butang seperti asal
  submitBtn.innerHTML = originalBtnText;
  submitBtn.disabled = false;
}

}, 2000)); // 2000ms = 2 saat masa 'bertenang' (cooldown)

// Logik butang untuk 'Daftar Pasukan Lain'
document.getElementById("btnDaftarLagi").addEventListener("click", () => {
  document.getElementById("summary").style.display = "none";
  document.getElementById("shareBtn").style.display = "none";
  form.style.display = "block"; // Munculkan semula borang asal
  window.scrollTo({ top: 0, behavior: "smooth" }); // Skrol semula ke atas
});
