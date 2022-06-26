let user = prompt("Qual seu nome de usuário?");

function eraseValue (elemento) {
    if(elemento.value === "Escreva aqui...") {
       elemento.value = "";
    }
}
function enterRoom () {
    let userobject = {
        name: `${user}`
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userobject);
    promise.then(userOk);
    promise.catch(userError);
}   
function userOk(answer) {
    alert("deu bom");
    console.log(answer);
}
function userError(answer) {
    const statuscode = answer.response.status;
    if(statuscode === 400) {
        user = prompt(`
        Ja existe um usuário cadastrado com esse nome.
        Por favor, digite outro nome.
        `) 
        enterRoom();
    }
}
enterRoom();

