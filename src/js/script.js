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

/////////////////////////////////////////////////
// Elements
const containerMovements = document.querySelector(".movements");

const labelBalance = document.querySelector(".label-balance");
const labelSumIn = document.querySelector(".income");
const labelSumOut = document.querySelector(".outcome");
const labelInterest = document.querySelector(".interest");

/////////////////////////////////////////////////
// Functions
const displayMovements = function (movements) {
  containerMovements.innerHTML = "";

  movements.forEach(function (mov, i) {
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
displayMovements(account1.movements);

const displayCalcBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance} €`;
};
displayCalcBalance(account1.movements);

const displayCalcSummary = function (movements) {
  const income = movements.filter((mov) => mov > 0).reduce((acc, mov) => acc + mov, 0);
  const outcome = movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0);
  const interest = movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * 1.2) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = `${income} €`;
  labelSumOut.textContent = `${Math.abs(outcome)} €`;
  labelInterest.textContent = `${Math.abs(interest)} €`;
};
displayCalcSummary(account1.movements);

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

///////////////////////////////////////
// Event handlers
