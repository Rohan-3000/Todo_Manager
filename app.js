//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ =require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-rohan:rohan123@cluster0.ikstt.mongodb.net/todoDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = ({
  name: String
});
const Item = mongoose.model("Item", itemSchema);
const Item1 = new Item({
  name: "Heyyyyy! whats up"
});
const Item2 = new Item({
  name: "What you want to do today"
});
const Item3 = new Item({
  name: "Have fun in everything"
});
const defaultitems = [Item1, Item2, Item3];


app.get("/", function (req, res) {

  Item.find({}, function (err, foundItem) {
    if (foundItem.length === 0) {
      Item.insertMany(defaultitems, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("successfully inserted");
        }
      });
      res.redirect("/");
    }
    else { res.render("list", { listTitle: "Today", newListItems: foundItem }); }

  })

});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listitem = req.body.list;

  const item4 = new Item({
    name: itemName
  });
  if(listitem==="Today"){
    item4.save();
    res.redirect("/");
  }
  else{
    custom.findOne({name: listitem},function(err,foundlist){
   
          foundlist.items.push(item4);
          foundlist.save();
          res.redirect("/"+listitem);
     
    })
  }
  

});
app.post("/delete", function (req, res) {
  const del = req.body.checkbox;
  const listname = req.body.listtype;
  // Item.remove({ _id: del }, function (err) {
  //   if (err) {
  //     console.log(err);
  //   }
  //   else {
  //     console.log("Everything is fine and one item deleted");
  //   }
  // });
 
 if(listname==="Today"){
  Item.findByIdAndRemove(del, function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Everything is fine and one item deleted");
    }
  });
  res.redirect("/");
 }
 else{
   custom.findOneAndUpdate({name: listname},{$pull:{items:{_id: del}}},function(err,found){
     if(!err){
      res.redirect("/"+listname);
     }
   });
  
 }
});
const customSchema = ({
  name: String,
  items: [itemSchema]
});
const custom = mongoose.model("custom", customSchema);
app.get("/:customlistname", function (req, res) {
  const customname = _.capitalize(req.params.customlistname);
  custom.findOne({ name: customname }, function (err, found) {
    if (!err) {
      if (!found) {
        const custom1 = new custom({
          name: customname,
          items: defaultitems
        });
        custom1.save();
        res.redirect("/"+customname);
      }
      else {
        res.render("list", { listTitle: found.name, newListItems: found.items });
      }
    }
  });
})
app.post("/:customlistname", function (req, res){
  const customs= req.body.newItem;
  const customname = req.params.customlistname;
  const custom2 = new custom({
    name: customname,
    items: customs
  });
  res.redirect("/"+customname);
  
})
app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
