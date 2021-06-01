// const { request } = require("express");

const 
    express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    fs = require('fs'),
    
    util = require('util'),
    unlinkFile = util.promisify(fs.unlink),
    S3 = require('aws-sdk/clients/s3'),

    multer = require('multer'),
    upload = multer({ dest: 'uploads/' }),

    ApplicationsDB = require("./dbmodels/applications");

    const bucketName = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_BUCKET_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SECRET_KEY;

    const s3 = new S3({
        region,
        accessKeyId,
        secretAccessKey
    });

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

    app.post("/application", upload.single("cv"), async (req,res)=>{
        const file = req.file;
        try{
            const result = await uploadFile(file)
            await unlinkFile(file.path)
            console.log(result);
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

    function uploadFile(file) {
        const fileStream = fs.createReadStream(file.path)
      
        const uploadParams = {
          Bucket: bucketName,
          Body: fileStream,
          Key: file.filename
        }
      
        return s3.upload(uploadParams).promise();
    }