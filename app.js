const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const Boardgame = require('./models/boardgames');
const morgan = require('morgan');
const methodOverride = require('method-override');

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(methodOverride('_method'))

mongoose.connect('mongodb://localhost:27017/BGCM', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => {
    console.log("Mongo Connection Opened!");
  })
  .catch(err => {
    console.log("Mongo Connection Error Occurred");
    console.log(err);
  });

app.get('/', async (req, res) => {
  const boardgames = await Boardgame.find({});
  res.render('home', { boardgames });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', async (req, res) => {
  // const { title, designer, publisher, description } = req.body;
  const newBoardgame = new Boardgame(req.body);
  await newBoardgame.save()
  res.redirect('/');
});

app.post('/search', async (req, res) => {
  const { query } = req.body;
  const regexQuery = new RegExp(query.toLowerCase(), 'g');
  const allGames = await Boardgame.find({});
  const matches = [];
  allGames.forEach(boardgameObject => {
    if (regexQuery.test(boardgameObject.title.toLowerCase())) {
      matches.push(boardgameObject);
    }
  })
  res.render('search', { matches, query });
})

app.delete('/show/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const boardgame = await Boardgame.findByIdAndDelete(id);
  res.redirect('/')
})

app.get('/show/:id', async (req, res) => {
  const { id } = req.params;
  const boardgame = await Boardgame.findById(id);
  if (!boardgame) {
    res.redirect('/');
  }
  res.render('show', { boardgame });
})

// app.get('*', async (req, res) => {
//   const boardgames = await Boardgame.find({});
//   res.render('home', { boardgames });
// });



app.listen(8080, () => {
  console.log(`Listening on port 8080!`);
})