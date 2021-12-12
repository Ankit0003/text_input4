var express = require("express");
var app = express();
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var request = require("request");
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Ankit003:ankitkumar@cluster0.mq7ne.mongodb.net/sentence?retryWrites=true&w=majority",{useNewUrlParser:true},{useUnifiedTopology:true});
var MongoClient = require('mongodb').MongoClient;
var nameSchema = new mongoose.Schema({
  sentence: String,
});
var quest = mongoose.model('sentence',nameSchema);
var url = "mongodb+srv://Ankit003:ankitkumar@cluster0.mq7ne.mongodb.net/sentence?retryWrites=true&w=majority";


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"/index.html"));
});

app.post("/addquestion",(req,res)=>{
  var info={
    sentence:req.body.sentence
  };
  var flag = 0;

  function myFun(item,index)
  {
    var sent = req.body.sentence;
 
    //console.log(item.sentence);
  
    request('http://13.232.231.249/'+item.sentence+'/'+ sent, function (error, response, body) {
    if (!error && response.statusCode == 200) {
    var Resp = JSON.parse(body);
    console.log(Resp);
    if(Resp.val>=70)
    {
      console.log("The string is present in database already.")
      flag=1;
    }
  }

})

}
  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    quest.find({},function(err, result){
      if(err) throw err;
      result.forEach(myFun);
      
     
      setTimeout(function myFun1(){
      
        if(flag==0){
          
        console.log("Not present..adding to database!");
      var me = new quest(info);
      me.save(function(err){
        if(err)
        {
          console.log("error occured!")
        }
        else
        {
          console.log("Done!");
        }
      });
    }
      },2000);
     
  

      db.close();
    });
  });

 
  res.redirect('/');

});

module.exports = quest;


app.listen(3000, () => {
  console.log("Server listening");
});