const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
const port = 3000;


app.use(
    fileUpload({
        limits: {
            fileSize: 1000000,
        },
        abortOnLimit: true,
    })
);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.post("/upload", (req, res) => {
    const { image } = req.files;
    
    if (!image) return res.send(400);

    // if (image.test(image.mimetype)) return res.sendStatus(400);

    image.mv(__dirname+ '/uploads/' + Date.now() + image.name);

    console.log(req.files);
    res.send(200);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});