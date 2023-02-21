const path = require('path')
const express = require('express')
const methodOverride = require('method-override')
const models=require("./db/data")
const pass = models.pass
const cfc = models.cfc

const app=express()
const bodyParser = require("body-parser")
app.use(methodOverride('_method'))

app.use(express.json())
const publicDirectoryPath = path.join(__dirname, '../public')

app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath))

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('', (req, res) => {
    res.render('signup', {
        // title: 'Londons best',
        // name: 'Chelsea'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Club',
        name: 'Navaneeth'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Chelsea Football Club is an English professional football club based in Fulham, West London. Founded in 1905, they play their home games at Stamford Bridge.'
    })
})

app.post('/signup', async (req, res) => {
    const { username, password,email } = req.body
    const passwordcheck = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    if (!passwordcheck.test(password)) {
    return res.render('signup', { error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.' })
    }
    const user = new pass(req.body)
    user.save((err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Internal Server Error')
      }
      res.render('login', { success: 'You have successfully signed up! Please log in.' })
    })
  })
  

app.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password 
    pass.findOne({ username, password }, (err, user) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Internal Server Error')
      }
      if (!user) {
        return res.render('error')
      }
      res.render('index',{ success: ' You have successfully loged in.' })
    })
  })


app.get('/player', async (req, res) => {
  try {
    const cfcData = await cfc.find({})
    res.render('new', { cfcData })
        } catch (error) {
    console.log(error)
  }
})

app.get('/ind',(req,res)=>{
  res.render('login')
})

app.post("/cfc", async (req, res) => { 
    const { name,age,position,nationality } = req.body 
    const data = req.body
    console.log(data)
    const CFC = await cfc.create(data)
    res.redirect('/new')
    // res.send({ data: cfc })
})

// //postman
// app.get('/cfcs', async (req, res) => {
//     try {
//         const CFC = await cfc.find({})
//         res.send({ data: CFC })
//     } catch (error) {
//         console.log(error)
//     }
// })
//

app.get('/new', async (req, res) => {
    try {
      const cfcData = await cfc.find({})
      res.render('new', { cfcData })
    } catch (error) {
      console.log(error)
    }
  })


app.delete('/cfc/:id', async (req, res) => {
    try {
      const id = req.params.id
      const result = await cfc.deleteOne({ _id: id })
      res.redirect('/new')
    } catch (error) {
      console.log(error)
      res.status(500).send({ error: 'Internal server error' })
    }
  })

app.get('/cfc/:id/edit', async (req, res) => {
    cfc.findById(req.params.id, (err, player) => {
      if (err) {
        console.log(err)
        res.redirect('/cfc')
      } else {
        res.render('edit', { player })
      }
    })
  })
  
  app.post('/cfc/:id', async (req, res) => {
    console.log('Request Body:', req.body)
    cfc.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedPlayer) => {
      if (err) {
        console.log(err)
        res.redirect('/new')
      } else {
        console.log('Updated Player:', updatedPlayer)
        res.redirect('/new')
      }
    })
  })


app.get('*',(req,res)=>{
    res.send("Erorr 404")
})

app.listen(5000, () => {
    console.log('Server is up')
})
