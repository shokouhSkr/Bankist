"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2021-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-07-26T17:01:17.194Z",
    "2022-07-28T23:36:17.929Z",
    "2022-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2021-11-01T13:15:33.035Z",
    "2021-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-04-10T14:43:26.374Z",
    "2022-06-25T18:49:59.371Z",
    "2022-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/************************************************/
// Elements
const containerMovements = document.querySelector(".movements");
const containerApp = document.querySelector(".app");

const labelBalance = document.querySelector(".balance__value");
const labelDate = document.querySelector(".date");
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

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  // Sort ascending movements
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const colorType =
      type === "deposit"
        ? "bg-gradient-to-tl from-[#39b385] to-[#9be15d]"
        : "bg-gradient-to-tl from-[#e52a5a] to-[#ff585f]";

    // Create current date
    const date = new Date(acc.movementsDates[i]);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const day = `${date.getDate()}`.padStart(2, 0);
    const displayDate = `${day}/${month}/${year}`;

    const html = `
        <div class="movement-row">
          <div class="details">
            <span class="type ${colorType}">${i + 1} ${type}</span>
            <span class="text-2xs text-[#666]">${displayDate}</span>
          </div>
          <div>
            <span>${mov.toFixed(2)} €</span>
          </div>
        </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const displayCalcBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

const displayCalcSummary = function (acc) {
  const income = acc.movements.filter((mov) => mov > 0).reduce((acc, mov) => acc + mov, 0);
  const outcome = acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0);
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = `${income.toFixed(2)} €`;
  labelSumOut.textContent = `${Math.abs(outcome.toFixed(2))} €`;
  labelInterest.textContent = `${Math.abs(interest.toFixed(2))} €`;
};

const updateUI = function (acc) {
  displayMovements(acc);
  displayCalcBalance(acc);
  displayCalcSummary(acc);
};

/************************************************/
// Event handlers
let currentAccount;

// FAKE ALWAYS LOGIN !!!!!!!!!!!!!!!!!!!!!!!!!!
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPIN.value) {
    // display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}!`;
    containerApp.style.opacity = 100;

    // Create current data
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const day = `${now.getDate()}`.padStart(2, 0);
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

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

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());

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

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some((mov) => mov >= 1.1 * amount)) {
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }

  inputLoanAmount.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
