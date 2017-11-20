module.exports = (app,finance) => {
  app.get('/', (req,res) => {
    res.sendFile('index')
  })

  // ------ API ------ //

  app.get('/api/quote/:symbol', (req,res) => {
    var symbol = req.params.symbol.toUpperCase();

    var getOldDate = () => {
      var dt = new Date();
      return dt.getFullYear() + "-" + (dt.getMonth()) + "-" + dt.getDate();
    }

    var getNormalDate = () => {
      var dt = new Date();
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    }

    finance.historical({
      symbol:symbol,
      from: getOldDate(),
      to: getNormalDate(),
    }, (err,result) => {
      res.json({
        symbol:  result[result.length - 1].symbol,
        price:  result[result.length - 1].close
      })
    })
  })
}
