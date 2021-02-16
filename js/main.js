import { infoErrors } from "./../files/errors.js";


const blockBotonsPetitions = document.getElementsByClassName("bloqueBotones")[0];
const blockPetitions = document.getElementsByClassName("bloquePeticiones")[0];
const idTiendaNode = document.getElementById("idTienda");
const blockDatas = document.getElementsByClassName("mostradoTiendas")[0];
const templateShop = document.querySelector("#tiendaTemplate");
const loadingHomeImage = document.getElementsByClassName("loadingHome")[0];
const botonSearch = document.getElementById("search");
const form = document.getElementById("form");
const buttonForm = document.getElementById("sendInfo");

blockBotonsPetitions.querySelectorAll('input').forEach(element => {
    element.addEventListener("click", () => {
        chargePetitions(event.target.id);
        addClassToNode(blockBotonsPetitions.parentNode, "hidden");

        petitions.getAllTiendas();        
    }); 
});

botonSearch.addEventListener("click", () => {
    clearNode(blockDatas);
    var id = idTiendaNode.value;

    if(id === ""){
        petitions.getAllTiendas();
    }else{
        if(event.currentTarget.firstElementChild.classList.contains("fa-search")){
            addAnimatedElementToNode(event.currentTarget.firstElementChild, "fa-spinner", "fa-search");
            petitions.getTiendaById(id);
        }else{
            petitions.getAllTiendas();
            idTiendaNode.value = "";
            addAnimatedElementToNode(event.currentTarget.firstElementChild, "fa-search", "fa-times");
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

form.addEventListener("submit", ()=> {
    event.preventDefault();
    checkAllForm();
});

document.getElementsByClassName("newTienda")[0].addEventListener("click", () => {
    resetForm();

    if(form.classList.contains("toHide")){
        removeClassFromNode(form, "toHide");
    }else{
        addClassToNode(form, "toHide");
    }
});


let petitions = {
    "getAllTiendas": () => {},
    "getTiendaById": () => {},
    "insertTienda": () => {} 
}

//const urlTienda = "http://localhost:8080/EmprInfRs_MoralesFelipeSaulJardel/webresources/tienda";
var urlTienda = "https://webapp-210130211157.azurewebsites.net/webresources/mitienda/";
var textName;
var textDirection;
var textPhone;
var textLocal;

//XHR petitions
const getTiendasXHR = () => {
    controlImageAnimation(loadingHomeImage, blockPetitions, "hidden");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlTienda);
    
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if (xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                chargeAllTiendas(json);
                controlImageAnimation(loadingHomeImage, blockPetitions, "hidden");
            }else{
                createTiendaFailedNode("Tienda no encontrada");
                controlImageAnimation(loadingHomeImage, blockPetitions, "hidden");
            }
        }else{
            createTiendaFailedNode("Acceso no encontrado");
            controlImageAnimation(loadingHomeImage, blockPetitions, "hidden");
        }
    }
    xhr.send();

}

const getTiendaByIdXHR = (id) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlTienda + id);
    
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if (xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                chargeTiendaById(json);
                addAnimatedElementToNode(botonSearch.firstElementChild, "fa-times", "fa-spinner");
            }else{
                createTiendaFailedNode("Tienda no encontrada");
                addAnimatedElementToNode(botonSearch.firstElementChild, "fa-times", "fa-spinner");
            }
        }else{
            createTiendaFailedNode("Acceso no encontrado");
            addAnimatedElementToNode(botonSearch.firstElementChild, "fa-times", "fa-spinner");
        }
    }

    xhr.send();
}

const insertTiendaXHR = (tienda) => {
    addAnimatedElementToNode(buttonForm.firstElementChild, "fa-spinner", "");
    changeButtonForm(true, "Cargando");

    var xhr = new XMLHttpRequest();
    xhr.open('POST', urlTienda);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    xhr.onreadystatechange = function() {

        console.log(xhr.status);
        if(xhr.readyState === 4){
            if (xhr.status === 204) {
                petitions.getAllTiendas();
                addAnimatedElementToNode(buttonForm.firstElementChild, "", "fa-spinner");
                changeButtonForm(false, "Enviar");

                
            }else{
                createTiendaFailedNode("Error al insertar");
                addAnimatedElementToNode(buttonForm.firstElementChild, "", "fa-spinner");
                changeButtonForm(false, "Enviar");

            }
        }else{
            createTiendaFailedNode("Error al insertar");
            addAnimatedElementToNode(buttonForm.firstElementChild, "", "fa-spinner");
            changeButtonForm(false, "Enviar");

        }
    }

    xhr.send(JSON.stringify(tienda));
}

//FETCH petitions 
const getTiendasFetch = () => {
    controlImageAnimation(loadingHomeImage, blockPetitions, "hidden");

    const options = {
        method: "GET"
      };
      
      fetch(urlTienda, options)
        .then(response => response.text())
        .then(data => {
            var json = JSON.parse(data);
            chargeAllTiendas(json);
            controlImageAnimation(loadingHomeImage, blockPetitions, "hidden");
        })
        .catch(err => {
            createTiendaFailedNode("Tienda no encontrada");
            controlImageAnimation(loadingHomeImage, blockPetitions, "hidden");
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
            addAnimatedElementToNode(botonSearch.firstElementChild, "fa-times", "fa-spinner");
        }).catch(err => {
            createTiendaFailedNode("Tienda no encontrada");
            addAnimatedElementToNode(botonSearch.firstElementChild, "fa-times", "fa-spinner");
        });
}

const insertTiendaFetch = (tienda) => {
    addAnimatedElementToNode(buttonForm.firstElementChild, "fa-spinner", "");
    changeButtonForm(true, "Cargando");

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
            addAnimatedElementToNode(buttonForm.firstElementChild, "", "fa-spinner");
            changeButtonForm(false, "Enviar");
    }).catch(err => {
        createTiendaFailedNode("Error al insertar tienda");
        addAnimatedElementToNode(buttonForm.firstElementChild, "", "fa-spinner");
        changeButtonForm(false, "Enviar");
    });
}

//JQUERY petitions

//Poner finally para ocultar la animacion
const getTiendasJquery = () => {
    controlImageAnimation(loadingHomeImage, blockPetitions, "hidden");

    $.ajax({
        url : urlTienda,
        type : 'GET', 
        dataType : 'json',
        success : function(json) { //función a ejecutar si es satisfactoria
            chargeAllTiendas(json);
        },
        error : function(jqXHR, status, error) { //función error
            console.log(error);
            createTiendaFailedNode("Tienda no encontrada");

        },
        complete: function () {
            controlImageAnimation(loadingHomeImage, blockPetitions, "hidden");
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
            createTiendaFailedNode("Tienda no encontrada");
        },
        complete: function () {
            addAnimatedElementToNode(botonSearch.firstElementChild, "fa-times", "fa-spinner");
        }
    });
}

const insertTiendaJquery = (tienda) => {
    addAnimatedElementToNode(buttonForm.firstElementChild, "fa-spinner", "");
    changeButtonForm(true, "Cargando");

    $.ajax({
        url : urlTienda,
        type : 'POST', 
        dataType : 'json',
        contentType: 'application/json',
        data: JSON.stringify(tienda),
        success : function(json) { //función a ejecutar si es satisfactoria
            petitions.getAllTiendas();
        },
        error : function(jqXHR, status, error) { //función error
            createTiendaFailedNode("Error al insertar tienda");
        },
        complete: function () {
            addAnimatedElementToNode(buttonForm.firstElementChild, "", "fa-spinner");
            changeButtonForm(false, "Enviar");
        }
    }); 
}

//OTHER METHODS

/**
 * Almacena las peticiones en un objeto que posteriormente se usa
 *
 * @param {*} ajaxType
 */
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


/**
 * Envia los datos en formato de json al método chargeBody
 *
 *
 * @param {*} json
 */
function chargeAllTiendas(json){
    //let tiendasToShow = json["Tiendas"];
    chargeBody(json);
}

/**
 * Carga una única tienda mandandola al método chargeBody
 *
 * @param {*} json
 */
function chargeTiendaById(json){
        let tiendasToShow = [];
        
        if(json.nombreTienda !== undefined){
            tiendasToShow.push(json);
        }
        
        chargeBody(tiendasToShow);
}


/**
 * Comprueba todos los campos del formulario
 *
 */
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
            "nombreTienda": textName,
            "direccion": textDirection,
            "localidad": textLocal,
            "telefono": textPhone
        }

        petitions.insertTienda(tienda);
    }
}

/**
 * Comprueba el campo del nombre
 *
 * @param {*} node
 * @param {*} errors
 * @return {*} 
 */
function checkName(node, errors){
    
    if(node.validity.valueMissing){
        return addErrorMessage(node.nextElementSibling, node, errors.required);
    }else{
        textName = node.value;
        return addErrorMessage(node.nextElementSibling, node, "");
    }
}


/**
 * Comprueba el campo de texto de direccion
 *
 * @param {*} node
 * @param {*} errors
 * @return {*} 
 */
function checkDirection(node, errors) {
    if(node.validity.valueMissing){
        return addErrorMessage(node.nextElementSibling, node, errors.required);
    }else{
        textDirection = node.value;
        return addErrorMessage(node.nextElementSibling, node, "");
    }
}


/**
 * Comprueba el campo de texto de  telefono
 *
 * @param {*} node
 * @param {*} errors
 * @return {*} 
 */
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


/**
 * Comprueba el campo de texto de localidad
 *
 * @param {*} node
 * @param {*} errors
 * @return {*} 
 */
function checkLocal(node, errors){
    if(node.validity.valueMissing){
        return addErrorMessage(node.nextElementSibling, node, errors.required);
    }else{
        textLocal = node.value;
        return addErrorMessage(node.nextElementSibling, node, "");
    }
}


/**
 *  Resetea los campos del formulario
 *
 */
function resetForm(){
    document.getElementById("form").reset();

    document.querySelectorAll(".inputCorrect").forEach((element) => {
        removeClassFromNode(element, "inputCorrect");
    });

    document.querySelectorAll(".inputError").forEach((element) => {
        removeClassFromNode(element, "inputError");
    });

    document.querySelectorAll(".error").forEach((element) => {
        element.innerHTML = "";
    });
}


/**
 * Agrega un mensaje de error debajo del campo mandado y pone en rojo el propio campo
 *
 * @param {*} node
 * @param {*} nodeToAddClass
 * @param {*} message
 * @return {*} 
 */
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


/**
 * Carga las tiendas en el cuerpo de la página o muestra un error de no encontradas
 *
 * @param {*} tiendasToShow
 */
function chargeBody(tiendasToShow){
    clearNode(blockDatas);

    if(tiendasToShow.length === 0){
        createTiendaFailedNode("Tienda no encontrada");
    }else{
        tiendasToShow.forEach((tienda) => {
            createTiendaNode(tienda);
        });
    }

}


/**
 * Clona el template de tienda y lo añade al cuerpo del body
 *
 * @param {*} shop
 */
function createTiendaNode(shop){
    var shopNode = templateShop.content.querySelector("#bloqueTienda");
    var nodeClone = shopNode.cloneNode(true);

    nodeClone.getElementsByClassName("title")[0].innerHTML = shop.nombreTienda;
    nodeClone.getElementsByClassName("direction")[0].innerHTML = shop.direccion;
    nodeClone.getElementsByClassName("phone")[0].innerHTML = shop.telefono;

    blockDatas.appendChild(nodeClone);
}


/**
 * Crea un nodo con un mensaje de error
 *
 * @param {*} message
 */
function createTiendaFailedNode(message){
    clearNode(blockDatas);

    var node = document.createElement("h2");
    node.innerHTML = message;

    blockDatas.appendChild(node);
}


/**
 * Añade o elimina la clase en los nodos recibidos
 *
 * @param {*} node
 * @param {*} secondNode
 * @param {*} nameClass
 */
function controlImageAnimation(node, secondNode, nameClass){
    if(node.classList.contains(nameClass)){
        removeClassFromNode(node, nameClass);
    }else{
        addClassToNode(node, nameClass);
        removeClassFromNode(secondNode, nameClass);
    }
}


/**
 * Añade y elimina clases del nodo, además de añadir o quitar una clase predefinida en el nodo
 *
 * @param {*} node
 * @param {*} classToAdd
 * @param {*} classToDelete
 */
function addAnimatedElementToNode(node, classToAdd, classToDelete){
    removeClassFromNode(node, classToDelete);
    addClassToNode(node, classToAdd);

    if(!node.classList.contains("imageButton") && classToAdd === "fa-spinner"){
        addClassToNode(node, "imageButton");
    }else{
        removeClassFromNode(node, "imageButton");
    }
}

/**
 * Deshabilita o habilita un botón y le cambia el texto a un hijo del nodo
 *
 * @param {*} disabled
 * @param {*} text
 */
function changeButtonForm(disabled, text){
    buttonForm.disabled = disabled;
    buttonForm.firstElementChild.nextElementSibling.innerHTML = text;
}

/**
 * Elimina todos los hijos de un nodo
 *
 * @param {*} node
 */
function clearNode(node){
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}

/**
 * Añade una clase al nodo si no recibe un parámetro vacío
 *
 * @param {*} node
 * @param {*} newClass
 */
function addClassToNode(node, newClass){
    if(newClass != ""){
        node.classList.add(newClass);
    }
}

/**
 * Elimina una clase del nodo si lo contiene
 *
 * @param {*} node
 * @param {*} classToRemove
 */
function removeClassFromNode(node, classToRemove){
    if (node.classList.contains(classToRemove)) {
        node.classList.remove(classToRemove);
      }
}

