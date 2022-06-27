let user = prompt("Qual seu nome de usuário?");
let Idinterval;

function eraseValue (element) {
    if(element.value === "Escreva aqui...") {
       element.value = "";
    }
}
function enterRoom () {
    let userobject = {
        name: `${user}`
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userobject);
    promise.catch(userError);
    promise.then(userOk);

}   
function userOk(response) {
    alert("deu bom");
    userStatus()
}
function userError(error) {
    const statuscode = error.response.status;
    if(statuscode !== 200) {
        user = prompt(`
        Ja existe um usuário cadastrado com esse nome.
        Por favor, digite outro nome.
        `) 
        enterRoom();
    }
}
function userStatus() {
    let userobject = {
        name: `${user}`
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userobject);
    promise.catch(userOffline)
    promise.then(userOnline);

    clearInterval(Idinterval);
}
function userOnline(response1) {
    let interval = setInterval(userStatus, 5000);
    Idinterval = interval;
    console.log("online");
}
function userOffline(error1) {
        alert("offline");
}
function printMessages(object) {

}
enterRoom();

