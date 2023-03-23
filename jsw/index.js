const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
  
const app = express();
  
// Set up Global configuration access
dotenv.config();
console.log(process.env)
  
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});

app.post("/user/generateToken", (req, res) => {
    console.log(process.env.JWT_SECRET_TOKEN)
    let jwtSecretKey = process.env.JWT_SECRET_TOKEN;
    let data = {
        time : Date(),
        userId: 10
    };
    const token = jwt.sign(data, jwtSecretKey);
    res.send(token);
});

app.get("/user/validateToken", (req, res) => {
	let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
	let jwtSecretKey = process.env.JWT_SECRET_TOKEN;

	try {
		const token = req.header(tokenHeaderKey);

		const verified = jwt.verify(token, jwtSecretKey);
		if(verified){
			return res.send("Successfully Verified");
		}else{
			// Access Denied
			return res.status(401).send(error);
		}
	} catch (error) {
		// Access Denied
		return res.status(401).send(error);
	}
});
