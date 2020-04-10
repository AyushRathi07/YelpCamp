var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
    {
        title: "Cloud's Rest",
        image: "https://drive.google.com/open?id=1t8PoXOf9Xb-viGvZo50lOl7oF195KDN8",
        desc: "Bful!! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." 
    },
    {
        title: "Desert Mesa",
        image: "https://drive.google.com/open?id=1PN7wudMzbqPwvwb8olFr0zeS3binBSU1",
        desc: "Bful!! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        title: "Laky Laky",
        image: "https://drive.google.com/open?id=18ikoIgG5gJ0k8MH2Q0f4VN88W-xfLaxN/view",
        desc: "Bful!! Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
]

function seedDB(){
    Campground.deleteMany({},function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Removed all!");
            // data.forEach(function(seed){
            //     Campground.create(seed,function(err,cg){
            //         if(err){
            //             console.log(err);
            //         }
            //         else{
            //             Comment.create({
            //                 text: "Network sucks here!",
            //                 author: "Anonymous"
            //             },function(err,cmnt){
            //                 if(err){
            //                     console.log(err);
            //                 }
            //                 else{
            //                     cg.comments.push(cmnt);
            //                     cg.save();
            //                 }
            //             })
            //         }
            //     })
            // })
        }
   })
}

module.exports = seedDB;