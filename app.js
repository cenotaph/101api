const koa = require('koa')
const koaRouter = require('koa-router')
const topics = require('./data/topics')
const participants = require('./data/combined')
const responses = require('./data/responses')
const cors = require('@koa/cors')
const aws = require('aws-sdk')
const config = require('config')
const serviceConfigOptions = {
  endpoint: config.get('endpoint'),
  accessKeyId: config.get('s3key'),
  signatureVersion: 'v2',
  secretAccessKey: config.get('s3secret'),
}
const s3 = new aws.S3(serviceConfigOptions)
const app = new koa()
const router = new koaRouter()


app.use(cors());

router.get('/participants', (ctx, next) => {
  return ctx.body = {
    status: 'success',
    data: participants
  }
})

async function getS3VideoUrl(exists, respondent, topic) {
  if (exists === true) {
    return await s3.getSignedUrl('getObject', {
      Bucket: config.get('bucket'),
      Key: config.get('path') + respondent + "_" + topic + ".mp4",
      Expires: 15 * 60
    })
  } else {
    return "false"
  }
}
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

router.get('/topic/:id', async (ctx, next) => {
  let output = []
  let videos = []
  const collect = async () => {
    await asyncForEach(responses, async (resp) => {
      if (resp.responses) {
        videos[resp.respondent] = await getS3VideoUrl(resp.responses.filter( (x) => { return x.topic == ctx.params.id })[0].video, resp.respondent, ctx.params.id)
      }
    })
  }
  await collect()
  responses.forEach((resp) => {
    if (resp.responses) {
      output.push({ "respondent": resp.respondent, 
                    "response": resp.responses.filter( (x) => { return x.topic == ctx.params.id })[0].value,
                    "video": videos[resp.respondent]
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


app.listen(3073)