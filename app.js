const form =
document.getElementById(
"silatForm"
);

const statusDiv =
document.getElementById(
"status"
);

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

form.addEventListener(
"submit",

async (e)=>{

e.preventDefault();

// Semakan sekuriti tambahan jika borang cuba dihantar selepas tarikh tutup
if (new Date() > tarikhTutup) {
  statusDiv.innerHTML = "⚠️ Harap maaf, tarikh pendaftaran telah tamat.";
  return;
}

const pesertaInput = document.getElementById("peserta").value;

// Semak jika input HANYA mengandungi digit nombor dan nilainya 1 atau lebih
if (!/^\d+$/.test(pesertaInput) || parseInt(pesertaInput) < 1) {
  statusDiv.style.color = "#ff4444"; // Warna merah muda untuk ralat
  statusDiv.innerHTML = "❌ Ralat: Jumlah Peserta mestilah nombor yang sah (minimum 1).";
  return; // Hentikan fungsi jika ralat
}

statusDiv.style.color = "white"; // Kembalikan ke warna asal jika tiada ralat
statusDiv.innerHTML =
"Menghantar data...";

const submitBtn = form.querySelector('button[type="submit"]');
const originalBtnText = submitBtn.innerHTML;
submitBtn.innerHTML = "Sedang Menghantar...";
submitBtn.disabled = true; // Elakkan spam klik

// Masukkan URL Web App Google Apps Script anda yang disalin tadi di sini:
const scriptURL = 'https://script.google.com/macros/s/AKfycbwp3eM1D6tIxY3LO1hfHkJ4EV2huaoW7NYy-825nrdtTg1S-jQHq2qO9PJOdGhkHFVX0w/exec';

try {
  // Hantar borang ke Google Script menggunakan Fetch API
  const response = await fetch(scriptURL, { method: 'POST', body: new FormData(form) });
  
  if (response.ok) {
    statusDiv.innerHTML = "✅ Pendaftaran berjaya disimpan ke Google Sheets!";
    form.reset();
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

});
