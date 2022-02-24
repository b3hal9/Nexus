const webpush = require('web-push')
const publicVapidKey = process.env.PUBLIC_VAPIDKEY
const privateVapidKey = process.env.PRIVATE_VAPIDKEY

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey)

Notifier = (req, res) => {
  const subscribtion = req.body
  const payload = JSON.stringify({
    title: 'Emergency Alert',
    body: 'help help help',
  })

  webpush
    .sendNotification(subscribtion, payload)
    .then((result) => console.log(result))
    .catch((e) => console.log(e.stack))
}

module.exports = Notifier
