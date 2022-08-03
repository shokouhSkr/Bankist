"use strict";

// Data
const account1 = {
  owner: "Shokouh Askari",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/************************************************/
// Elements
const containerMovements = document.querySelector(".movements");
const containerApp = document.querySelector(".app");

const labelBalance = document.querySelector(".balance");
const labelSumIn = document.querySelector(".income");
const labelSumOut = document.querySelector(".outcome");
const labelInterest = document.querySelector(".interest");
const labelWelcome = document.querySelector(".welcome");

const inputLoginUsername = document.querySelector(".user-input");
const inputLoginPIN = document.querySelector(".pin-input");
const inputTransferTo = document.querySelector(".transfer-to");
const inputTransferAmount = document.querySelector(".amount");
const inputCloseUsername = document.querySelector(".input-close-username");
const inputClosePIN = document.querySelector(".input-close-pin");
const inputLoanAmount = document.querySelector(".loan");

const btnLogin = document.querySelector(".login-btn");
const btnTransfer = document.querySelector(".btn-transfer");
const btnClose = document.querySelector(".btn-close");
const btnLoan = document.querySelector(".btn-loan");
const btnSort = document.querySelector(".btn-sort");

/************************************************/
// Functions
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  // Sort ascending movements
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const colorType =
      type === "deposit"
        ? "bg-gradient-to-tl from-[#39b385] to-[#9be15d]"
        : "bg-gradient-to-tl from-[#e52a5a] to-[#ff585f]";

    const html = `
        <div class="movement-row">
          <div class="details">
            <span class="type ${colorType}">${i + 1} ${type}</span>
            <span class="text-[#666]">3 days ago</span>
          </div>
          <div>
            <span>${mov} €</span>
          </div>
        </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const displayCalcBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const displayCalcSummary = function (acc) {
  const income = acc.movements.filter((mov) => mov > 0).reduce((acc, mov) => acc + mov, 0);
  const outcome = acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0);
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = `${income} €`;
  labelSumOut.textContent = `${Math.abs(outcome)} €`;
  labelInterest.textContent = `${Math.abs(interest)} €`;
};

const creatUserNames = function (accs) {
  accs.forEach(function (acc) {
    // add username property to each account object
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });

  // console.log(accs);
};
creatUserNames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  displayCalcBalance(acc);
  displayCalcSummary(acc);
};

/************************************************/
// Event handlers
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPIN.value) {
    // display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}!`;
    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = inputLoginPIN.value = "";
    inputLoginPIN.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find((acc) => acc.username === inputTransferTo.value);
  // console.log(amount, receiverAcc);
  inputTransferTo.value = inputTransferAmount.value = "";

  if (
    receiverAcc &&
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // console.log("Transfer valid");

    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePIN.value
  ) {
    // console.log("confirmed");

    // Delete account
    const index = accounts.findIndex((acc) => acc.username === currentAccount.username);
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePIN.value = "";
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some((mov) => mov >= 1.1 * amount)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }

  inputLoanAmount.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
