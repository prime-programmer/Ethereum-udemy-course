const next = require('next')
const routes = require('./routes')
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handler = routes.getRequestHandler(app)

// setting next routers
const {createServer} = require('http')
app.prepare().then(() => {
  createServer(handler).listen(3000), error =>{
    if(error) throw(error)
    console.log('Server start at port: 3000')
  }
})