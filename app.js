const form =
document.getElementById(
"silatForm"
);

const statusDiv =
document.getElementById(
"status"
);

form.addEventListener(
"submit",

async (e)=>{

e.preventDefault();

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
