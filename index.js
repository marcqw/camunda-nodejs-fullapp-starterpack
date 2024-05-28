require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send(`
    <form action="/submit" method="post">
      <label for="name">Nom:</label>
      <input type="text" id="name" name="name"><br><br>
      <label for="sinistre">Sinistre:</label>
      <select id="sinistre" name="sinistre">
        <option value="auto">Auto</option>
        <option value="moto">Moto</option>
        <option value="habitation">Habitation</option>
      </select><br><br>
      <label for="city">Ville:</label>
      <select id="city" name="city">
        <option value="Paris">Paris</option>
        <option value="Bordeaux">Bordeaux</option>
        <option value="Bastia">Bastia</option>
      </select><br><br>
      <button type="submit">Envoyer</button>
    </form>
    `);
});

app.post('/submit', async (req, res) => {
  const { name, sinistre, city } = req.body;
  // envoi un email au service sinistre
  res.send(`
    <p>Merci ${name} ! Nous reviendrons vers toi dès que nous aurons trouvé un expert ${sinistre} dans la ville de ${city}</p>
    <a href="/">Retour au formulaire</a>
    `);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});