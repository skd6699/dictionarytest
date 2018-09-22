var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser")
var Dictionary = require("oxford-dictionary");
var request = require("request");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
 var config = {
    app_id : "c5c7dabc",
    app_key : "141456dea3cb67c30f0193264d1b755f",
    source_lang : "en"
  };
var word = "";
        var dict = new Dictionary(config);
        var dataFind,dataThes;
        var def,examples,synonyms,antonyms,title;
        
app.get("/",function(req,res){
       word = req.query.search;
        if(word == undefined)
        {
            word = "example";
            
        }
        console.log(word);
        var lookup = dict.find(word);
        var reqMain =function(c) { 
        lookup.then(function (body) {
              dataFind = body;
              def = dataFind["results"][0]["lexicalEntries"][0]["entries"][0]["senses"];
            title = dataFind["results"][0];
            examples = dataFind["results"][0]["lexicalEntries"][0]["entries"][0]["senses"][0]["examples"] ;
            var mainObj = {
                def: def,
                examples: examples,
                title:title
            };
            c(null,mainObj);
            
      },
  function(err){
      console.log(err);
      c(err);
  });
 };
var reqThes = function(t){  lookup = dict.thesaurus(word);
        
      lookup.then(function(body) {
      dataThes = body;
      antonyms = dataThes["results"][0]["lexicalEntries"][0]["entries"][0]["senses"][0]["antonyms"];
      synonyms = dataThes["results"][0]["lexicalEntries"][0]["entries"][0]["senses"][0]["synonyms"];
      var thesObj = {
                antonyms:antonyms,
                synonyms: synonyms
            };
            t(null,thesObj);
          
      },
  function(err){
      console.log(err);
      t(err);
  });

};
                   reqMain(function(err,data){
                    if(err)
                return console.log(err);
                console.log(data);
        reqThes(function(err,data1){
            if(err)
            return console.log(err);
            res.render("home",{data1: data1,data: data,word: word,count: 1});
        });
    });

       
});     


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("dictionary started");
});