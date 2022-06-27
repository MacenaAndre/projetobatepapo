let user = document.querySelector(".enter").value;
let Idintervalstatus;
let Idintervalmessage;
let messagelist;

function eraseValue (element) {
    if(element.value === "Escreva aqui...") {
       element.value = "";
       element.classList.remove("sample");
    }
    if(element.value === "Digite o seu nome") {
       element.value = "";
    }
}
function login() {
    user = document.querySelector(".enter").value;
    document.querySelector(".separate").innerHTML =`
    <img class="load-img" src="https://acegif.com/wp-content/uploads/loading-45.gif" alt="">
    <p class="load">Entrando...</p>
    `
    enterRoom();
}
function enterRoom () {
    let userobject = {
        name: user
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
      messagelist = list.data;
      const interval = setInterval(getMessages, 3000);
      Idintervalmessage = interval;
      printMessages();
}
function messagesEroor(error) {
    alert("Erro ao carregar mensagens.");
    window.location.reload();
}
function userStatus() {
    let userobject = {
        name: `${user}`
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userobject);
    promise.catch(userOffline);
    promise.then(userOnline);

    clearInterval(Idintervalstatus);
}
function userOnline(response1) {
    let interval = setInterval(userStatus, 5000);
    Idintervalstatus = interval;
    console.log("online");
}
function userOffline(error1) {
    alert("Você saiu da sala.");
    window.location.reload();
}
function sendMessage() {
    const messageobject = {
      from: user,
	  to: "Todos",
	  text: document.querySelector(".typing-space").value,
	  type: "message" 
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", messageobject);

    promise.catch(sendFail);
    promise.then(sendOk);


}
function sendOk(response) {
    document.querySelector(".typing-space").value = "Escreva aqui...";
    document.querySelector(".typing-space").classList.add("sample");
}
function sendFail(error) {
    alert("Erro ao enviar mensagens");
    window.location.reload();
}
function printMessages() {
    const element = document.querySelector(".content");
    element.innerHTML = "";

    for(let i = 0; i < messagelist.length; i++) {
      if(messagelist[i].type === "status" && i < 99) {
        element.innerHTML += `
        <div class="status">
          <p><span class="time">(${messagelist[i].time}) </span><span class="user">${messagelist[i].from} </span>${messagelist[i].text}</p>
        </div>
        `;
      }
      if(messagelist[i].type === "status" && i === 99) {
        element.innerHTML += `
        <div class="status last">
          <p><span class="time">(${messagelist[i].time}) </span><span class="user">${messagelist[i].from} </span>${messagelist[i].text}</p>
        </div>
        `;
      }
      if(messagelist[i].type === "message" && i < 99) {
        element.innerHTML += `
        <div class="public-msg">
          <p><span class="time">(${messagelist[i].time}) </span><span class="user">${messagelist[i].from} </span>para <span class="user">${messagelist[i].to}: </span>${messagelist[i].text}</p>
        </div>
        `;
      }
      if(messagelist[i].type === "message" && i === 99) {
        element.innerHTML += `
        <div class="public-msg last">
          <p><span class="time">(${messagelist[i].time}) </span><span class="user">${messagelist[i].from} </span>para <span class="user">${messagelist[i].to}: </span>${messagelist[i].text}</p>
        </div>
         `;
      }
      if(messagelist[i].type === "private_message" && i < 99 && messagelist[i].to === user) {
        element.innerHTML += `
        <div class="private-msg">
          <p><span class="time">(${messagelist[i].time}) </span><span class="user">${messagelist[i].from} </span>reservadamente para <span class="user">${messagelist[i].to}: </span>${messagelist[i].text}</p>
        </div>  
        `;
      }
      if(messagelist[i].type === "private_message" && i === 99 && messagelist[i].to === user) {
        element.innerHTML += `
        <div class="private-msg last">
          <p><span class="time">(${messagelist[i].time}) </span><span class="user">${messagelist[i].from} </span>reservadamente para <span class="user">${messagelist[i].to}: </span>${messagelist[i].text}</p>
        </div>
        `;
      }
    }
    document.querySelector(".last").scrollIntoView();
}


