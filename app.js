var express = require('express');
var exphbs = require('express-handlebars');
const mercadopago = require("mercadopago");
require('dotenv').config();

mercadopago.configure({
  access_token:process.env.ACCESS_TOKEN_MP,
  integrator_id: process.env.INTEGRATOR_ID
});


var port = process.env.PORT || 3000

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.json())
app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/detail', function (req, res) {
  res.render('detail', req.query);
});

app.post('/create_preference', (req, res) => {
  console.log('req',req.body)
  const {title, price, picture_url} = req.body;
  let preference = {
    items: [{
      id: "1234",
      title,
      discription: "Celular de Tienda e-commerce",
      picture_url,
      unit_price: Number(price),
      quantity: 1,
    }],
    external_reference: "deuzinh2010@gmail.com",
    payer: {
      name: "Lalo",
      surname: "Landa",
      email: "test_user_92801501@testuser.com",
      date_created: new Date().toISOString(),
      phone: {
        area_code: "55",
        number: 985298743
      },

      address: {
        street_name: ": Insurgentes Sur",
        street_number: 1602,
        zip_code: "78134-190"
      }
    },
    payment_methods:{
      excluded_payment_types:[
        {
          id:"amex"
        }
      ],
      installments: 6
    },
    notification_url: "https://webhook.site/a35a2852-c273-4e8f-947b-e28b28a9e6af",
    back_urls: {
      "success": "http://localhost:3000/success",
      "failure": "http://localhost:3000/failure",
      "pending": "http://localhost:3000/pending"
    },
    auto_return: 'approved',
  };

  console.log(preference)

  mercadopago.preferences.create(preference)
    .then(function (response) {
      res.json({ id: response.body.id })
    }).catch(function (error) {
      console.log(error);
    });
})

app.listen(port, () => console.log('Ecommerce started🚀'));