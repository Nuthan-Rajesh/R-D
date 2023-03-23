const express = require("express");
const swaggerUI = require("swagger-ui-express");
const Yaml = require("yamljs");
const fileupload = require("express-fileupload");

const swaggerJsDocs = Yaml.load('./api.yaml');

const app = express();

app.use(fileupload())
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

app.get('/string', (req, res) => {
    res.status(500).send("THIS IS A STRING");
})

let users = [{ id: 1, name: "Raj" }, { id: 2, name: "Raj2" }, { id: 3, name: "Raj3" }]

app.get('/user', (req, res) => {
    const obj = { id: 1, name: "Raj" }
    res.status(200).send(obj);
})

app.get('/users', (req, res) => {
    res.status(200).send(users);
})

app.get('/users/:id', (req, res) => {
    const obj = users.find(x => x.id === parseInt(req.params.id));
    res.status(200).send(obj);
})

app.get('/usersQuery/', (req, res) => {
    const obj = users.find(x => x.id === parseInt(req.query.id));
    res.status(200).send(obj);
})

app.post('/create', (req, res) => {
    users = [req.body, ...users]
    res.send(users);
    // res.status(200).send(req.body, "pushed");
})

app.post('/upload', (req, res) => {
    const file = req.files.file;
    console.log(req.files)
    const id = req.files.id;
    let path = __dirname + "/upload/"+ "file" + id + Date.now() + ".jpg";

    file.mv(path, (err) => {
        res.send("OK");
    });
});

app.listen(3000, () => {
    console.log("UP and Running");
    console.log(users);
})