const balancefield = document.querySelector('.balance');
const incomefield = document.querySelector('.income');
const expensefield = document.querySelector('.expense');
const list = document.querySelector('.list');
const form = document.querySelector('.form');
const details = document.querySelector('.details');
const amount = document.querySelector('.amount');

const localstorage = JSON.parse(localStorage.getItem('transactions'));

// let transactions = templist;
let transactions = localStorage.getItem('transactions') != null ? localstorage: [];

// generate id's for each transaction.
function generateid() {
    return Math.floor(Math.random() * 1000000000);
}

// fetch transaction from dom. 
function fetchtransaction(event) {
    event.preventDefault();

    if(details.value.trim() === '' || amount.value.trim() === '') {
        alert('Please fill in the details about your transaction.');
    }
    else {
        const transaction = {id: generateid(), details: details.value, amount: +amount.value};
        transactions.push(transaction);
        addtransaction(transaction);
        
        evaluatebalance();
        updatelocalstorage();

        details.value = '';
        amount.value = '';
    }
}

// remove transaction from list in dom.
function removetransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    updatelocalstorage();
    render();
}

// add transaction to list in dom.
function addtransaction(transaction) {
    // if transaction amount is < 0 then we want a - sign else a + sign.
    // const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    // if transaction amount is < 0 then we want a minus class on li else a plus class.
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `${transaction.details} <span>₹${Math.abs(transaction.amount)}</span> <button class="delete-button" onclick="removetransaction(${transaction.id})"><i class="material-icons">remove_circle_outline</i></button>`;

    list.appendChild(item);
}

// evaluate and update values for balance, income and expense in dom.
function evaluatebalance() {
    const amounts = transactions.map(transaction => transaction.amount);
    const balance = amounts.reduce((total, item) => (total += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((total, item) => (total += item), 0).toFixed(2);
    // income - expense = balance
    const expense = (income - balance).toFixed(2);

    balancefield.innerHTML = `₹${balance}`;
    incomefield.innerHTML = `₹${income}`;
    expensefield.innerHTML = `₹${expense}`;
}

// update local storage after any change and save it.
function updatelocalstorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// render all data to dom
function render() {
    list.innerHTML = '';
    transactions.forEach(addtransaction);
    evaluatebalance();
}

render();

form.addEventListener('submit', fetchtransaction);

