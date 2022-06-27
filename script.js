let user = prompt("Qual seu nome de usuário?");
let Idintervalstatus;
let Idintervalmessage;
let messagelist;
let stat;

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
    console.log("deu bom");
    getMessages();
    userStatus();
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
function getMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promise.catch(messagesEroor);
    promise.then(messagesOk);

    clearInterval(Idintervalmessage);
}
function messagesOk(list) {
      console.log("carregadas");
      messagelist = list.data;
      const interval = setInterval(getMessages, 3000);
      Idintervalmessage = interval;
      printMessages();
}
function messagesEroor(error) {
    alert("Erro carrregar mensagens");
    enterRoom();
}
function userStatus() {
    let userobject = {
        name: `${user}`
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userobject);
    promise.catch(userOffline)
    promise.then(userOnline);

    clearInterval(Idintervalstatus);
}
function userOnline(response1) {
    let interval = setInterval(userStatus, 5000);
    Idintervalstatus = interval;
    stat = "online";
    console.log("online");
}
function userOffline(error1) {
    alert("offline");
    stat = "offline";
    window.location.reload();
}
function printMessages() {
    const element = document.querySelector(".content");
    element.innerHTML = "";

    for(let i = 0; i < messagelist.length; i++) {
      if(messagelist[i].type === "status" && i < 99) {
         element.innerHTML += `
         <div class="status"><span class="time">(${messagelist[i].time})</span> <span class="user">${messagelist[i].from}</span> ${messagelist[i].text}</div>`;
      }
      if(messagelist[i].type === "status" && i === 99) {
        element.innerHTML += `
        <div class="status last"><span class="time">(${messagelist[i].time})</span> <span class="user">${messagelist[i].from}</span> ${messagelist[i].text}</div>`;
      }
      if(messagelist[i].type === "message" && i < 99) {
        element.innerHTML += `
        <div class="public-msg"><span class="time">(${messagelist[i].time})</span> <span class="user">${messagelist[i].from}</span> para <span class="user">${messagelist[i].to}:</span> ${messagelist[i].text}</div>`;
      }
      if(messagelist[i].type === "message" && i === 99) {
       element.innerHTML += `
       <div class="public-msg last"><span class="time">(${messagelist[i].time})</span> <span class="user">${messagelist[i].from}</span> para <span class="user">${messagelist[i].to}:</span> ${messagelist[i].text}</div>`;
      }
      if(messagelist[i].type === "private_message" && i < 99) {
        element.innerHTML += `
        <div class="private-msg"><span class="time">(${messagelist[i].time})</span> <span class="user">${messagelist[i].from}</span> reservadamente para <span class="user">${messagelist[i].to}:</span> ${messagelist[i].text}</div>`;
      }
      if(messagelist[i].type === "private_message" && i === 99) {
       element.innerHTML += `
       <div class="private-msg last"><span class="time">(${messagelist[i].time})</span> <span class="user">${messagelist[i].from}</span> reservadamente para <span class="user">${messagelist[i].to}:</span> ${messagelist[i].text}</div>`;
      }
    }
    document.querySelector(".last").scrollIntoView();
    console.log("load");
}
enterRoom();

