
const form = document.getElementById('form');
const nam = document.getElementById('name');
const number = document.getElementById('number');
const month = document.getElementById('month');
const year = document.getElementById('year');
const cvc = document.getElementById('cvc');
const complete = document.getElementById('complete')
//card info
let cardNumber = document.getElementById('card-number');
let cardName = document.getElementById('card-name');
let cardDate = document.getElementById('card-date');
let cardCvd = document.getElementById('card-cvc');
let errorInput = false;

const cards = JSON.parse(localStorage.getItem('cards')) || [];
//manejo de errores con focusout
const handleError= (e) =>{
    if (isNaN(e.path[0].value) && e.path[0].className == "number" || e.path[0].value.includes("e") && e.path[0].className == "number"){
            e.path[1].lastChild.previousSibling.innerText = "Wrong format, numbers only"
            e.path[0].classList.add('inputError')
            errorInput = true;
        }else{
            if (e.path[0].value == ""){
                console.log(e.path[1].lastChild.previousSibling)
                e.path[1].lastChild.previousSibling.innerText = "Can't be blank"
                e.path[0].classList.add('inputError')
                errorInput = true;
            }else{
                    e.path[1].lastChild.previousSibling.innerText = "";
                    e.path[0].classList.remove('inputError')
                    errorInput = false;
            }
        }
        if(e.path[0].id == "month"){
            if(e.path[0].value > "12"){
                e.path[1].lastChild.previousSibling.innerText = "It's not a Month";
                e.path[0].classList.add('inputError')
                
                errorInput = true;
            }
        } 
        if(e.path[0].id == "name" && !isNaN(e.path[0].value)){
            e.path[1].lastChild.previousSibling.innerText = "Wrong format, letters only"
            e.path[0].classList.add('inputError')
            errorInput = true;
        }  
}

form.addEventListener('focusout', e => {
    e.path[0].nodeName == 'BUTTON' ? null : handleError(e);
})
form.addEventListener('input',(e) =>{
    let numCero = "0000 0000 0000 0000" 
    if(number.value == ""){
        cardNumber.innerText = numCero;  
    }else{
        for (let i = 0; i < number.value.length; i++) {
            i==0 ? cardNumber.innerText = `${number.value[i]}` :  ((i+1) % 4 == "0" ? cardNumber.innerText += `${number.value[i] + " " }` : cardNumber.innerText += `${number.value[i]}`);
        }
    }
    cardName.innerText = nam.value == "" ? "JANE APPLESEED" : nam.value;
    cardDate.innerText = month.value == "" && year.value == "" ? "00/00" : (month.value == "" ? `00/${year.value}` : (year.value == "" ? `${month.value}/00` : `${month.value}/${year.value}`))
    cardCvd.innerText = cvc.value == "" ? "000" : cvc.value;
})

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = [number, nam, year, month, cvc];
    data.forEach((dato)=> {
        if(dato.id == "month"){
            if(dato.value > "12"){
                errorInput = true;
                console.log(dato.parentNode.lastChild.previousSibling)
                dato.parentNode.lastChild.previousSibling.innerText = "It's not a Month";
                dato.classList.add('inputError')
            }
        }
        if(dato.value == "") {
            dato.classList.add('inputError');
            errorInput = true;
            dato.parentNode.lastChild.previousSibling.innerText = "Can't be blank";
        }
        if(dato.className == "number" && isNaN(dato.value) || dato.className == "number" && dato.value.includes("e")) {
            errorInput = true;
            dato.classList.add('inputError');
            dato.parentNode.lastChild.previousSibling.innerText = "Wrong format, numbers only";
        }
       if(dato.id == "name" && !isNaN(dato.value)){
            errorInput = true;
            dato.classList.add('inputError');
            dato.parentNode.lastChild.previousSibling.innerText = "Wrong format, letters only";
       }
    })
    if(!errorInput){
        form.classList.add('hidden');
        complete.classList.remove('hidden');
        const newCard = {
            number : number.value,
            name : nam.value,
            month : month.value,
            year : year.value,
            cvc : cvc.value
        }
        cards.push(newCard)
        localStorage.setItem('cards', JSON.stringify(cards))
    }
})

const menu = document.getElementById('menu');
const btnContinue = document.getElementById('continue');
btnContinue.addEventListener('click', ()=>{
    complete.classList.add('hidden')
    menu.classList.remove('hidden')
    form.reset();
})
const addNew = document.getElementById('addNew');

addNew.addEventListener('click', () =>{
    menu.classList.add('hidden')
    form.classList.remove('hidden')
})
const btnSeeList = document.getElementById('seeList');
const listTable = document.getElementById('listTable');
const list = document.getElementById('list');
const renderList = () =>{
   list.innerHTML = '';
    cards.forEach((card, index) => {
        list.innerHTML += `
        <tr>
        <td>${card.number}</td>
        <td>${card.name}</td>
        <td>${card.month}/${card.year}</td>
        <td>${card.cvc}</td>
        <td><button id="${index}" class="delete">❎</button></td>
        </tr>
        `;
    });
};

btnSeeList.addEventListener('click', () =>{
    menu.classList.add('hidden')
    listTable.classList.remove('hidden')
    renderList()
})
const btnAdd = document.getElementById('btnAdd');
btnAdd.addEventListener('click',() =>{
    form.classList.remove('hidden')
    listTable.classList.add('hidden')
})

const handleDelete = (e) => {
    const num = e.path[0].id;
    if (confirm(`Are you sure you want to remove ${cards[num].name} from the list?`)) {
        cards.splice(num, 1) 
        localStorage.setItem('cards', JSON.stringify(cards))
        renderList();
    } 
}
list.addEventListener('click', (e) => {
    e.path[0].className == "delete" ? handleDelete(e) : null;
})




