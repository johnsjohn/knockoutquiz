const express = require("express");

const fs=require("fs");
const port=process.env.PORT || 3000;
const app =  express();

app.use(express.static("."));
app.get('/',(req,res)=>{
    res.sendFile(__dirname+"index.html");
});

app.get('/data',(req,res)=>{
    let rawdata = fs.readFile('rounds.json',(err,data)=>{
        if(err) throw err;
        let quizData= JSON.parse(data);
        res.json(quizData);
        
    });
    
});
app.listen(port,()=>{
    console.log("Quiz app listening at "+ port);
})