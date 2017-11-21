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
      var total = (stocks[stock].price * amount).toFixed(2)
      result += `<tr><td>${name}</td><td>${amount}</td> <td>${total}$</td> </tr>`
    }

    table.innerHTML = result
  } else {
    table.innerHTML = '';
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

  var reset = () => {
    setTimeout(() => {
      button.style.color = '#555'
      button.innerText = 'Buy'
      document.querySelector('.buy > #stock-symbol').value = ""
      document.querySelector('.buy > #stock-amount').value = ""
    }, 1500)
  }
  
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
          reset()
        } else if (amount == 0) {
          button.innerText = 'Amount of stock too small'
          button.style.color = 'tomato'
          reset()
        } else {
          button.style.color = '#555'
          button.innerText = 'Bought ' + json.symbol + ': ' + total + '$'

          stocks[json.symbol] = {
            'amount':Number(amount),
            'price':json.price
          }
          cashAmount -= total;
          profile();
          stockTable();
          reset()
        }
      })
  })
}

var sell = () => {
  var button = document.querySelector('.sell > button')
  var url = 'http://localhost:8080/api/quote/'


  var reset = () => {
    setTimeout(() => {
      button.innerText = 'Sell'
      button.style.color = '#555'
      document.querySelector('.sell > #stock-symbol').value = ""
      document.querySelector('.sell > #stock-amount').value = ""
    }, 1500)
  }

  button.addEventListener('click', () => {
    var quote = document.querySelector('.sell > #stock-symbol').value
    var amount = document.querySelector('.sell > #stock-amount').value

    fetch(url + quote)
      .then(data => data.json())
      .then(json => {
        var total = Math.round(json.price * amount);
        var obj = stocks[json.symbol];

        console.log(obj)

        if (obj === undefined) {
          button.innerText = 'You do not own this stock';
          button.style.color = 'tomato';
          reset()
        } else if (obj.amount < amount) {
          console.log(obj.amount + ', ' + amount)
          button.innerText = 'Not enough stock to sell';
          button.style.color = 'tomato';
          reset()
        } else {
          if (obj.amount - amount === 0) {
            delete stocks[json.symbol]
            stockTable()
          } else {
            obj.amount -= amount;
          }

          button.style.color = '#555'
          button.innerText = 'Sold ' + json.symbol + ': ' + total + '$'

          cashAmount += total;
          profile();
          stockTable();
          reset()
        }
      })
  })
}

profile()
quote()
buy()
sell()