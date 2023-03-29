const express = require("express");
const cors = require("cors");

const app = express();

var corOptions = {
    origin: 'http://localhost:8081'
}
//middlewares
app.use(cors(corOptions));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

const router = require('./router/productRouters.js')
app.use('/api/products', router)

//testing API

app.get('/',(req,res) => {
    res.json({message : "hello"});
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`);
})