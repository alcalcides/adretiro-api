import randomizer from "random-number";

function shotANumber(min, max) {
  var options = { min, max, integer: true };
  return randomizer(options);
}

function initializeCounter(size) {
  const valuesCounter = [];
  for (var i = 0; i < size; i++) {
    valuesCounter.push(i);
  }
  valuesCounter.fill(0);
  return valuesCounter;
}

function setUpALot() {
  const numbers = [];
  const counter = initializeCounter(12);
  var repetitions = 0;
  for (var i = 0; i < 12; i++) {
    var number;
    do {
      number = shotANumber(1, 12);
      repetitions++;
    } while (counter[number - 1] > 0);

    numbers.push(number);
    counter[number - 1]++;
  }
  return { numbers, counter, repetitions };
}

function setUpLots() {
  var list = [];
  for (var i = 0; i < 167; i++) {
    const newLot = setUpALot().numbers;
    list = list.concat(newLot);
  }
  return list;
}

function analyzeChosens(chosens) {
  const counter = initializeCounter(12);
  for (var i = 0; i < chosens.length; i++) {
    const value = chosens[i];
    counter[value - 1]++;
  }
  return counter;
}

export function raffle() {
  const chosens = setUpLots();
  const analyses = analyzeChosens(chosens);
  const success = analyses.find((value) => value === 168) === undefined;
  return { chosens, success };
}
