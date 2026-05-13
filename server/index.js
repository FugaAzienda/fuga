const express = require("express")
const cors = require("cors")
const Stripe = require("stripe")
require("dotenv").config()

const app = express()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

app.post("/api/pagamenti/crea-intent", async (req, res) => {
  try {
    const { importo, booking_id } = req.body
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(importo * 100), // Stripe vuole i centesimi
      currency: "eur",
      metadata: { booking_id }
    })
    res.json({ clientSecret: intent.client_secret })
  } catch (err) {
    res.status(500).json({ errore: err.message })
  }
})

app.listen(process.env.PORT || 3001, () => {
  console.log("Server avviato sulla porta", process.env.PORT || 3001)
})