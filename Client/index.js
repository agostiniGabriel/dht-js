const localHost = "http://127.0.0.1:8080";
const retriveFileList = `${localHost}/api/getFilesList`;
const uploadFile = `${localHost}/api/sendFile`;

const fileInput = document.querySelector("#fileInput");

fileInput.addEventListener('click',()=>{
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type','file');
    fileSelector.addEventListener('change',()=>{
        handleFileSelection(fileSelector);
    });
    fileSelector.click()
})

function handleFileSelection(fileInput){
    console.log(fileInput.files);
}

window.onload = () => {
    fetch(retriveFileList)
    .then((response) => response.json())
    .then((data) => console.log(data));
};