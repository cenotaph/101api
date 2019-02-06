const koa = require('koa')
const koaRouter = require('koa-router')
const topics = require('./data/topics')
const participants = require('./data/combined')
const responses = require('./data/responses')
const cors = require('@koa/cors');

const app = new koa()
const router = new koaRouter()

app.use(cors());

router.get('/participants', (ctx, next) => {
  return ctx.body = {
    status: 'success',
    data: participants
  }
})

router.get('/topic/:id', (ctx, next) => {
  let output = []
  responses.forEach((resp) => {
    if (resp.responses) {
      output.push({ "respondent": resp.respondent, 
                    "response": resp.responses.filter( (x) => { return x.topic == ctx.params.id })[0].value,
                    "video": resp.responses.filter( (x) => { return x.topic == ctx.params.id })[0].video
                   })
    }
  })
  return ctx.body = {
    status: 'success',
    data: output
  }
  next()
}).get('/', (ctx, next) => {
  return ctx.body = {
    status: 'success',
    data: topics.slice(1)
  }
})

app.use(router.routes())
  .use(router.allowedMethods())


app.listen(3000)