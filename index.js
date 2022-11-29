const express = require('express');
const app = express();
const Piscina = require('piscina');
const path = require('path');
const pool = new Piscina({
	idleTimeout: 5000,
	filename: path.resolve(__dirname, "./worker.js")
});

app.get("/", (req,res)=>{
	res.status(200).send("Hola ke ase");
});

app.get("/non-blocking", (req,res)=>{
	setTimeout(()=>{
		res.status(200).send("Non-blocking operation");
	}, 1000);
});

app.get("/blocking", (req,res)=>{
	let cnt = 0;
	for(let i=0; i<1_000_000_000; ++i) {
		++cnt;
	}
	res.status(200).send(`Blocking operation cnt=${cnt}`);
});

app.get("/blocking-thread", async (req,res)=>{
	await pool
		.run()
		.then(()=>{
			res.status(200).send("Blocking operation in thread pool");
		});
});

app.listen(3000, ()=>{
	console.log("App listening on port 3000");
});
