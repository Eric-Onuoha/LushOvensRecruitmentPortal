// const { request } = require("express");

const 
    express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    ApplicationsDB = require("./dbmodels/applications");


    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended: true}));
    const dbURL = process.env.DBPATH || "mongodb://127.0.0.1/lushad";
    mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});

    app.get("/", (req,res)=>{
        res.render("index");
    });

    app.get("/application", (req,res)=>{
        const job = (req.query.job);
        if(job == "Baker"){
            res.render("baker");
        }else if (job == "Accountant"){
            res.render("accountant");
        } else if ( job == "Sales Representative"){
            res.render("salesrep");
        } else if (job == "Bakery Assistant") {
            res.render("bakeryassistant");
        } else {
            console.log("here");
            res.redirect("/");
        }
    });

    app.post("/application", (req,res)=>{
        console.log(req.body);
        try{
            ApplicationsDB.create(req.body.questions, (err, newQuestion)=>{
                console.log(newQuestion);
                res.render("success");
            });
        } catch (err) {
            console.log(req.file);
            console.log(err);
            res.render("failed");
        }
    });

    app.get("*", (req, res)=>{
        res.render("index");
    });

    app.listen(process.env.PORT || "3000", process.env.IP || "0.0.0.0", (req, res)=>{
        console.log("Lush Server Running");
    });