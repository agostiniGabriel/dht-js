const localHost = "http://127.0.0.1:8080";
const retriveFileListEndpoint = `${localHost}/api/getFilesList`;
const uploadFileEndpoint = `${localHost}/api/sendFile`;

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
    const file = fileInput.files[0];
    const blobFile = new Blob([file])
    fetch(`${uploadFileEndpoint}?fileName=${file.name}`,  {
        method: 'POST',
        headers: {'Content-Type': file.type},
        body:  blobFile,
        duplex: 'half',
    }).then((response)=>{
        console.log(response);
    });
}

window.onload = () => {
    fetch(retriveFileListEndpoint)
    .then((response) => response.json())
    .then((data) => console.log(data));
};