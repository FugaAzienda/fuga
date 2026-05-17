const express = require("express")
const cors = require("cors")
const Stripe = require("stripe")
const { Resend } = require("resend")
require("dotenv").config()
console.log("CLIENT_URL:", process.env.CLIENT_URL)
const app = express()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

app.post("/api/pagamenti/crea-intent", async (req, res) => {
  console.log("Richiesta ricevuta da:", req.headers.origin)
  try {
    const { importo, booking_id } = req.body
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(importo * 100),
      currency: "eur",
      metadata: { booking_id }
    })
    res.json({ clientSecret: intent.client_secret })
  } catch (err) {
    res.status(500).json({ errore: err.message })
  }
})

app.post("/api/email/conferma", async (req, res) => {
  console.log("Email ricevuta:", req.body)
  try {
    const { email, nome, camera, checkin, checkout, totale, codice } = req.body
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "fuga.azienda@gmail.com",
      subject: `Prenotazione confermata — ${codice}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">Prenotazione confermata</h1>
          <p style="color: #666; margin-bottom: 24px;">Ciao ${nome || ""}! La tua prenotazione è confermata.</p>
          <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 16px;">${camera}</h2>
            <table style="width: 100%; font-size: 14px; color: #555;">
              <tr><td>Check-in</td><td style="text-align: right; color: #111;">${checkin}</td></tr>
              <tr><td>Check-out</td><td style="text-align: right; color: #111;">${checkout}</td></tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding-top: 12px; font-weight: bold; color: #111;">Totale pagato</td>
                <td style="padding-top: 12px; text-align: right; font-weight: bold; color: #111;">€${totale}</td>
              </tr>
            </table>
          </div>
          <p style="font-size: 12px; color: #999; font-family: monospace;">Codice: ${codice}</p>
          <p style="font-size: 12px; color: #999; margin-top: 24px;">Grazie per aver scelto Fuga.</p>
        </div>
      `
    })
    console.log("Resend response:", data, error)
    res.json({ ok: true })
  } catch (err) {
    console.error("Errore email:", err)
    res.status(500).json({ errore: err.message })
  }
})

app.listen(process.env.PORT || 3001, () => {
  console.log("Server avviato sulla porta", process.env.PORT || 3001)
})