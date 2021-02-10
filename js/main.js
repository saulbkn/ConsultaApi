
const blockBotonsPetitions = document.getElementsByClassName("bloqueBotones")[0];
const blockPetitions = document.getElementsByClassName("bloquePeticiones")[0];

const urlTienda = "http://localhost:8080/EmprInfRs_MoralesFelipeSaulJardel/webresources/tienda";

const blockDatas = document.getElementsByClassName("mostradoTiendas")[0];
var templateShop = document.querySelector("#tiendaTemplate");

blockBotonsPetitions.querySelectorAll('input').forEach(element => {
    element.addEventListener("click", () => {
        chargePetitions(event.target.id);
        petitions.getAllTiendas();

        addClassToNode(blockBotonsPetitions, "hidden");
        removeClassFromNode(blockPetitions, "hidden");
    }); 
});

let idTiendaNode = document.getElementById("idTienda");

document.getElementById("search").addEventListener("click", () => {
    clearNode(blockDatas);
    var id = idTiendaNode.value;

    if(id === ""){
        petitions.getAllTiendas();
    }else{
        if(event.target.value != "x"){
            petitions.getTiendaById(id);
            event.target.value = "x";
        }else{
            petitions.getAllTiendas();
            idTiendaNode.value = "";
            event.target.value = "Buscar";
        }
    }
});

let petitions = {
    "getAllTiendas": () => {},
    "getTiendaById": () => {},
    "insertTienda": () => {} 
}

//XHR petitions
const getTiendasXHR = () => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlTienda);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            chargeAllTiendas(json);
        }else {
            console.log(xhr.status);
            createTiendaFailedNode("Tienda no encontrada");
        }
    };
    xhr.send();
}

const getTiendaByIdXHR = (id) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlTienda + "/" + id);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            chargeTiendaById(json);
            
        }else {
            console.log(xhr.status);
            createTiendaFailedNode("Tienda no encontrada");
        }
    };

    xhr.send();
}

const insertTiendaXHR = (tienda) => {
    console.log("insertTienda");
    console.log(tienda);
}

//FETCH petitions 
const getTiendasFetch = () => {
    const options = {
        method: "GET"
      };
      
      fetch(urlTienda, options)
        .then(response => response.text())
        .then(data => {
            var json = JSON.parse(data);
            chargeAllTiendas(json);
        })
        .catch(err => {
            console.log(err);
            createTiendaFailedNode("Tienda no encontrada");
        });
}

const getTiendaByIdFetch = (id) => {
    const options = {
        method: "GET"
    };
      
    fetch(urlTienda + "/" + id, options)
        .then(response => response.text())
        .then(data => {
            var json = JSON.parse(data);
            chargeTiendaById(json);
    }).catch(err => {
        console.log(err);
        createTiendaFailedNode("Tienda no encontrada");
    });
}

const insertTiendaFetch = (tienda) => {

}

//JQUERY petitions
const getTiendasJquery = () => {
    $.ajax({
        url : urlTienda,
        type : 'GET', 
        dataType : 'json',
        success : function(json) { //función a ejecutar si es satisfactoria
            chargeAllTiendas(json);

        },
        error : function(jqXHR, status, error) { //función error
            console.log("error");
            console.log(status);
            console.log(error);
        }
    }); 
}

const getTiendaByIdJquery = (id) => {
    $.ajax({
        url : urlTienda + "/" + id,
        type : 'GET', 
        dataType : 'json',
        success : function(json) { //función a ejecutar si es satisfactoria
            chargeTiendaById(json);

        },
        error : function(jqXHR, status, error) { //función error
            console.log("error");
            console.log(status);
            console.log(error);
        }
    });
}

const insertTiendaJquery = (tienda) => {

}
//OTHER METHODS
function chargePetitions(ajaxType){
    switch(ajaxType){
        case "XHR":
            petitions.getAllTiendas = getTiendasXHR;
            petitions.getTiendaById = getTiendaByIdXHR;
            petitions.insertTienda = insertTiendaXHR;
            break;
        case "FETCH":
            petitions.getAllTiendas = getTiendasFetch;
            petitions.getTiendaById = getTiendaByIdFetch;
            petitions.insertTienda = insertTiendaFetch;
            break;
        case "JQUERY":
            petitions.getAllTiendas = getTiendasJquery;
            petitions.getTiendaById = getTiendaByIdJquery;
            petitions.insertTienda = insertTiendaJquery;
            break;
        default: break;
    }
}

function chargeAllTiendas(json){
    let tiendasToShow = json["Tiendas"];

    createPetitionBody(tiendasToShow);
}

function chargeTiendaById(json){
        let tiendasToShow = [];
        
        if(json.Nombre !== undefined){
            tiendasToShow.push(json);
        }
        
        createPetitionBody(tiendasToShow);
}

function chargeInsertTienda(){

}

function createPetitionBody(tiendasToShow){
    clearNode(blockDatas);

    if(tiendasToShow.length === 0){
        createTiendaFailedNode("Tienda no encontrada");
    }else{
        tiendasToShow.forEach((tienda) => {
            createTiendaNode(tienda);
        });
    }

}

function createTiendaNode(shop){
    var shopNode = templateShop.content.querySelector("#bloqueTienda");
    var nodeClone = shopNode.cloneNode(true);

    nodeClone.getElementsByClassName("title")[0].innerHTML = shop.Nombre;
    nodeClone.getElementsByClassName("direction")[0].innerHTML = shop.Direccion;
    nodeClone.getElementsByClassName("phone")[0].innerHTML = shop.Telefono;

    blockDatas.appendChild(nodeClone);
}

function createTiendaFailedNode(message){
    var node = document.createElement("h2");
    node.innerHTML = message;

    blockDatas.appendChild(node);
}

function clearNode(node){
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}

function addClassToNode(node, newClass){
    node.classList.add(newClass);
}

function removeClassFromNode(node, classToRemove){
    if (node.classList.contains(classToRemove)) {
        node.classList.remove(classToRemove);
      }
}

