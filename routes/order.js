var express = require('express');
var router = express.Router();

var mysql = require('mysql'); 

function getConnection() {
  return mysql.createConnection({
    host     : 'ecomsite-rds.clpcnl2zsquk.us-east-1.rds.amazonaws.com',
    user     : 'ecomsiteabdullah',
    password : 'setsuna00',
    database: 'ecomsite', 
    port     : 3306
  });
}

connection = getConnection(); 
const createDatabaseStatement =  `CREATE TABLE if not exists orderNum (
  id int primary key auto_increment, 
  firstname varchar(255) not null,
  lastname varchar(255),
  email varchar(255) not null, 
  product varchar(255) not null,
  paymentType varchar(255) not null
)`;
connection.query(createDatabaseStatement, function(err, results, fields) {
  if (err) {
    console.log(err.message);
  }
});

router.get('/', (req, res) => {
  console.log('getting orders...'); 
  res.render('order',  {
    title: 'order page', 
    pageFirstName: req.body.firstname, 
    pageLastName: req.body.lastname, 
    pageEmail: req.body.email,
    pageProduct: req.body.buyproducts, 
    pagePaymentType: req.body.paymentType
  })
});


router.post('/', (req, res) => {
  connection = getConnection(); 

  const firstname = req.body.firstname; 
  console.log(req.body.firstname);
  const lastname = req.body.lastname; 
  console.log(req.body.lastname);
  const email = req.body.email; 
  console.log(req.body.email);
  const product = req.body.buyproducts;
  console.log(req.body.buyproducts);
  const paymentType = req.body.paymentType; 
  console.log(req.body.paymentType);

  const stmt = 'INSERT INTO ecomsite.orderNum (first_name, last_name, email, product, paymentType) VALUES (?, ?, ?, ?, ?)';

  connection.query(stmt, [firstname, lastname, email, product, paymentType], (err, results, fields) => {
    if (err) {
      console.log('failed to create order'); 
      res.sendStatus(500);
      return
    }

    console.log('successfully created the order'); 
    console.log('Rows Affected: ' + results.rowsAffected)
    res.redirect('/');
  });
});

router.get('/search', (req, res) => {
  res.render('search', {
   title: 'Search for an order' 
  })
});

router.post('/search', (req, res) => {
  const firstname = req.body.firstname; 
  const lastname = req.body.lastname; 
  const email = req.body.email; 

  const stmt = 'SELECT * FROM ecomsite.orderNum WHERE first_name = ? AND last_name = ? AND email = ?';
  connection = getConnection(); 

  connection.query(stmt, [firstname, lastname, email], (err, results, fields) => {
    if (err) {
      console.log('failed to fetch order'); 
      res.sendStatus(500); 
      return
    }

    console.log('successfully fetched order'); 
    console.log(JSON.stringify(results));
    
    res.render('order', {
      title: 'Order', 
      pageFirstName: firstname,
      pageLastName: lastname, 
      pageEmail: email, 
      pageProduct: results[0].product,
      pagePaymentType: results[0].paymentType
    }); 
  });
});

module.exports = router;
