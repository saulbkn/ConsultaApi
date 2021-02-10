import { infoErrors } from "./../files/errors.js";

const blockBotonsPetitions = document.getElementsByClassName("bloqueBotones")[0];
const blockPetitions = document.getElementsByClassName("bloquePeticiones")[0];
const idTiendaNode = document.getElementById("idTienda");
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

document.getElementById("name").addEventListener("input", (element) => {
    var id = element.target.getAttribute("id");
    checkName(element.target, infoErrors[id]);
});

document.getElementById("direction").addEventListener("input", (element) => {
    var id = element.target.getAttribute("id");
    checkDirection(element.target, infoErrors[id]);
});

document.getElementById("phone").addEventListener("input", (element) => {
    var id = element.target.getAttribute("id");
    checkPhone(element.target, infoErrors[id]);
});

document.getElementById("local").addEventListener("input", (element) => {
    var id = element.target.getAttribute("id");
    checkLocal(element.target, infoErrors[id]);
});


document.getElementById("form").addEventListener("submit", ()=> {
    event.preventDefault();
    checkAllForm();
});


const urlTienda = "http://localhost:8080/EmprInfRs_MoralesFelipeSaulJardel/webresources/tienda";
let petitions = {
    "getAllTiendas": () => {},
    "getTiendaById": () => {},
    "insertTienda": () => {} 
}

var textName;
var textDirection;
var textPhone;
var textLocal;

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
    var xhr = new XMLHttpRequest();
    xhr.open('POST', urlTienda);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            petitions.getAllTiendas();
        }else {
            console.log(xhr.status);
            createTiendaFailedNode("Error al insertar");
        }
    };
    xhr.send(JSON.stringify(tienda));
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
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tienda)
    };
      
    fetch(urlTienda, options)
        .then(response => response.text())
        .then(data => {
            petitions.getAllTiendas();
    }).catch(err => {
        console.log(err);
        createTiendaFailedNode("Error al insertar tienda");
    });
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
    $.ajax({
        url : urlTienda,
        type : 'POST', 
        dataType : 'json',
        contentType: 'application/json',
        data: JSON.stringify(tienda),
        success : function(json) { //función a ejecutar si es satisfactoria
            console.log(json);
            petitions.getAllTiendas();
        },
        error : function(jqXHR, status, error) { //función error
            console.log("error");
            console.log(status);
            console.log(error);
        }
    }); 
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

function checkAllForm(){
    var controlForms = document.querySelectorAll(".control");
    var validates = 0;

    controlForms.forEach(node => {
        var id = node.getAttribute("id"); 
        switch(id){
            case "name": 
                if(checkName(node, infoErrors[id]))
                    validates++
                break;
            case "direction":
                if(checkDirection(node, infoErrors[id]))        
                    validates++
                break;
            case "phone":
                if(checkPhone(node, infoErrors[id]))
                    validates++
                break;
            case "local":
                if(checkLocal(node, infoErrors[id]))
                    validates++
                break;
            default:
                break;
        }
    });

    if(validates == controlForms.length){
        resetForm();
        var tienda = {
            "Nombre": textName,
            "Direccion": textDirection,
            "Localidad": textLocal,
            "Telefono": textPhone
        }

        petitions.insertTienda(tienda);
    }
}

function checkName(node, errors){
    
    if(node.validity.valueMissing){
        return addErrorMessage(node.nextElementSibling, node, errors.required);
    }else{
        textName = node.value;
        return addErrorMessage(node.nextElementSibling, node, "");
    }
}

function checkDirection(node, errors) {
    if(node.validity.valueMissing){
        return addErrorMessage(node.nextElementSibling, node, errors.required);
    }else{
        textDirection = node.value;
        return addErrorMessage(node.nextElementSibling, node, "");
    }
}

function checkPhone(node, errors){
    
    if(node.validity.valueMissing){
        return addErrorMessage(node.nextElementSibling, node, errors.required);
    }else if(node.validity.patternMismatch){
        return addErrorMessage(node.nextElementSibling, node, errors.format);
    }else{ 
        textPhone = node.value;
        return addErrorMessage(node.nextElementSibling, node, "");
    }
}

function checkLocal(node, errors){
    if(node.validity.valueMissing){
        return addErrorMessage(node.nextElementSibling, node, errors.required);
    }else{
        textLocal = node.value;
        return addErrorMessage(node.nextElementSibling, node, "");
    }
}

function resetForm(){
    document.getElementById("form").reset();

    document.querySelectorAll(".inputCorrect").forEach((element) => {
        removeClassFromNode(element, "inputCorrect");
    });
}

function addErrorMessage(node, nodeToAddClass, message){
    node.innerHTML = message;
    var validated = false;

    if(nodeToAddClass != null){
        if(message == ""){
            removeClassFromNode(nodeToAddClass, "inputError");
            addClassToNode(nodeToAddClass, "inputCorrect");
            validated = true;
        }else{
            removeClassFromNode(nodeToAddClass, "inputCorrect");
            addClassToNode(nodeToAddClass, "inputError");
            validated = false;
        }
    }else{
        validated = message == "" ? true : false; 
    }

    return validated;
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
    clearNode(blockDatas);

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

