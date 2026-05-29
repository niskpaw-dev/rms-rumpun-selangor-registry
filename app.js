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

statusDiv.innerHTML =
"Menghantar data...";

setTimeout(()=>{

```
statusDiv.innerHTML =
"✅ Demo submit berjaya";

form.reset();
```

},1000);

});
