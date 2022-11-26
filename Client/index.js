const fileInput = document.querySelector("#fileInput");
const nodeInput = document.querySelector("#nodeInput");

fileInput.addEventListener('change',(event)=>{
    console.log(fileInput.files);
})