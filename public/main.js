var cashAmount = 10000;
var stocks = {}

var profile = () => {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  var cashEl = document.querySelector('.cash')
  cashEl.innerText = 'You have ' + numberWithCommas(cashAmount) + '$';
}

var stockTable = () => {
  var table = document.querySelector('.profile > table')

  if (Object.keys(stocks).length != 0) {
    var result = '<tr> <th>Stock Name</th> <th>Amount</th> <th>Current Total Value</th> </tr>'

    for (var stock in stocks) {
      var name = stock
      var amount = stocks[stock].amount
      var total = Math.round(stocks[stock].price * amount)
      result += `<tr><td>${name}</td><td>${amount}</td> <td>${total}$</td> </tr>`
    }

    table.innerHTML = result
  }
}

var quote = () => {
  var button = document.querySelector('.quote > button')
  var url = 'http://localhost:8080/api/quote/'

  button.addEventListener('click', () => {
    var quote = document.querySelector('.quote > input').value
    var result = document.querySelector('.quote > .result')

    fetch(url + quote)
      .then(data => data.json())
      .then(json => {
        result.innerText = json.symbol + ': ' + json.price + '$'
      })
  })
}

var buy = () => {
  var button = document.querySelector('.buy > button')
  var url = 'http://localhost:8080/api/quote/'

  button.addEventListener('click', () => {
    var quote = document.querySelector('.buy > #stock-symbol').value
    var amount = document.querySelector('.buy > #stock-amount').value

    fetch(url + quote)
      .then(data => data.json())
      .then(json => {
        var total = Math.round(json.price * amount);

        if (cashAmount < total) {
          button.innerText = 'Too low funds'
          button.style.color = 'tomato'
        } else if (amount == 0) {
          button.innerText = 'Amount of stock too small'
          button.style.color = 'tomato'
        } else {
          button.style.color = '#555'
          button.innerText = 'Bought ' + json.symbol + ': ' + total + '$'

          stocks[json.symbol] = {
            'amount':amount,
            'price':json.price
          }
          cashAmount -= total;
          profile();
          stockTable();

          setTimeout(() => {
            button.innerText = 'Buy'
            document.querySelector('.buy > #stock-symbol').value = ""
            document.querySelector('.buy > #stock-amount').value = ""
          }, 1500)
        }
      })
  })
}

profile()
quote()
buy()
