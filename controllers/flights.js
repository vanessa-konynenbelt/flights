import  { Flight } from '../models/flight.js'
import  { Meal } from '../models/meal.js'


function newFlight(req, res) {
  res.render('flights/new', {
    title: "Add Flight",
  })
}

function create(req, res) {
  const flight = new Flight(req.body)
  flight.save(function(err){
    if(err) return res.redirect('/flights/new')
  })
  res.redirect('/flights')
  //Old 
  // flight.create(req.body, function(err, flight) {
  //   if (err) return res.redirect('/flights/new') 
  //   res.redirect('/flights/new')
  // })
}

function index(req, res) {
  Flight.find({}, function (error, flights){
    res.render("flights/index", {
      error: error,
      flights: flights, 
      title: 'All Flights',
    })
  })
}

function show(req, res) {
  Flight.findById(req.params.id)
  .populate('meals')
  .exec(function (err, flight) {
    Meal.find({_id: {$nin: flight.meals}}, function (err, meals) {
      console.log("flight ", flight)
      console.log("meals: ", meals)
      res.render("flights/show", {
        flight: flight,
        title: "Flight Detail",
        meals,
      })
    })
  })
}

function createTicket(req, res) {
  Flight.findById(req.params.id, function(err, flight) {
    flight.tickets.push(req.body)
    flight.save(function(err) {
      res.redirect(`/flights/${flight._id}`)
    })
    console.log(flight.tickets)
    console.log(flight)
  })
}

function addToMeal(req, res) {
  Flight.findById(req.params.id, function (err, flight) {
    flight.meals.push(req.body.mealId)
    flight.save(function (err) {
      res.redirect(`/flights/${flight._id}`)
    })
  })
}

export {
  newFlight as new,
  create, 
  index, 
  show, 
  createTicket,
  addToMeal,
}