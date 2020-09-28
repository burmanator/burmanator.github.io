const e = require("express");
const campground = require("./models/campground");
const comment = require("./models/comment");

var     express     = require("express"),
        app         = express(),
        port        = 3000,
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose");
        seedsDB     = require("./seeds");

mongoose.connect('mongodb+srv://djasuan:ig6siSpPZxLj4it@cluster0.ufm5n.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.connection.on('connected', ()=>{
    console.log('Mongoose is connected!');
});

// seedsDB();


// campground.create({
//     name:"Pine Crest", 
//     image:"https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350",
//     description: "Pinecrest is an unincorporated community in Tuolumne County, California, United States. Pinecrest is located near Pinecrest Lake northwest of Mi-Wuk Village. Pinecrest Lake sits in what was once a meadow surrounded by granite outcroppings"
// },
//     function(err, campground){
//         if(err){
//             console.log("there is an error: "); console.log(err);
//         }
//         else{
//             console.log("campground added! ");
//             console.log(campground);
//         }
//     }
// );

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/",function(req, res){
    res.render("landing");
});


//===============================
//SHOWING ALL CAMPGROUND 
//===============================

app.get("/campground", function(req, res){
    // get all campground from db
    campground.find({},function(err, allCampgrounds){
        if(err){console.log("there was an err"+ err);}
        else{
            res.render("campgrounds/campground", {campground:allCampgrounds});
        }
    });
    

});

//===============================
//CREATE NEW CAMPGROUND ROUTES 
//===============================

app.post("/campground",function(req, res){
    var name= req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name:name, image:image, description: description}
    // create a new campground and add it to a database

    campground.create(newCampground,function(err, newlyCreated){
        if(err){console.log("there is an error "+ err)}
        else{"new campground added!: "+ newlyCreated}
        res.redirect("campgrounds/campground");
    });    
});

//=======================
//NEW CAMPGROUND ROUTES 
//=======================
app.get("/campground/new", function(req,res){
    res.render("campgrounds/new");

})

//=======================
//SHOW ROUTES 
//=======================

app.get("/campground/:id", function(req, res){
    //find the campground with the provided id
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampGround){
        if(err){console.log("there is an error"+ err)}
        else{res.render("campgrounds/show", {campground:foundCampGround});}
    });
    //render show template with that campground
})

//=======================
//COMMENT ROUTES 
//=======================
app.get("/campground/:id/comments/new", function(req,res){
    //find campground by id
    campground.findById(req.params.id, function(err, foundCampGround){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground:foundCampGround});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    //look up comment using id
    campground.findById(req.params.id,function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campground");
        }
        else{
            comment.create(req.body.comment, function(err,comment){
                if(err){console.log(err);}
                else{
                    console.log(comment);
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campground/"+foundCampground._id);
                }
            });
            //connect new comment to campground
            //redirect to campground:id show page

        }
    });

});


app.listen(port, ()=>{});