
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

const handleError= (e) =>{
    let i = 2;
    let dismin = false
    if (e.path[0].id == "year" || e.path[0].id == "month"){
        i += 1
        dismin = true;
    }
    if (isNaN(e.path[0].value) && e.path[0].className == "number" || e.path[0].value.includes("e") && e.path[0].className == "number"){
            console.log(e.path[1].children[i])
            e.path[1].children[i].innerText = "Wrong format, numbers only"
            e.path[0].classList.add('inputError')
            errorInput = true;
        }else{
            if (e.path[0].value == ""){
                e.path[1].children[i].innerText = "Can't be blank"
                e.path[0].classList.add('inputError')
                errorInput = true;
            }else{
                    e.path[1].children[i].innerText = "";
                    e.path[0].classList.remove('inputError')
                    errorInput = false;
            }
        }
    dismin ? i-=1 : null;
}

form.addEventListener('focusout', e => {
    e.path[0].nodeName == 'BUTTON' ? null : handleError(e);
})
form.addEventListener('focusout',() =>{
    cardNumber.innerText = number.value == "" ? "0000 0000 0000 0000" : number.value;
    cardName.innerText = nam.value == "" ? "JANE APPLESEED" : nam.value;
    cardDate.innerText = month.value == "" && year.value == "" ? "00/00" : (month.value == "" ? `00/${year.value}` : (year.value == "" ? `${month.value}/00` : `${month.value}/${year.value}`))
    cardCvd.innerText = cvc.value == "" ? "000" : cvc.value;
})

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = [number, nam, year, month, cvc];
    data.forEach((dato)=> {
        if(dato.value == "") {
            dato.classList.add('inputError');
            errorInput = true;
            dato.parentNode.lastChild.previousSibling.innerText = "Can't be blank";
        }
        if(dato.className == "number" && isNaN(dato.value)) {
            dato.classList.add('inputError');
            errorInput = true;
            dato.parentNode.lastChild.previousSibling.innerText = "Wrong format, numbers only";
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




