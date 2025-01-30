require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const { Camunda8 } = require('@camunda8/sdk');

const app = express();
const port = 3000;

const c8 = new Camunda8();
const zbc = c8.getZeebeGrpcApiClient();

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
  
  const p = await zbc.createProcessInstance({
    bpmnProcessId: 'Process_sinistre',
    variables: {
      name: name,
      sinistre: sinistre,
      city: city
    }
  })

  res.send(`
    <p>Merci ${name} ! Nous reviendrons vers toi dès que nous aurons trouvé un expert ${sinistre} dans la ville de ${city}</p>
    <a href="/">Retour au formulaire</a>
    `);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const worker = zbc.createWorker({
    taskType: 'find-expert',
    taskHandler: async (job, complete) => {
      const { sinistre, city } = job.variables;
      console.log(`Recherche d'un expert ${sinistre} à ${city}`);
      console.log("c'est terminé!");
      return job.complete({
        whereIsTheExpert: "Expert trouvé!",
        expert: "Jean Dupont",
        expertemail: "xx"
      });
    }
  });