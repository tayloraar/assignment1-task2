  $(document).ready(function(){
    console.log("Document ready");
    
//On Doucment Load - Posts

       $.get("/postnum", function(posts){
           $("#mainColum").empty();
            posts.forEach((posts)=>{
              let id = posts.postNum
                 $("#mainColum").append(`<div class="row post">
                 <div class="col s12">
                   <div class="card">
                     <div class="card-action small">
                         <a class="btn-floating btn-small waves-effect waves-light red" href="#"><img class="circle responsive-img" style= "height:inherit;" src="_images/profile1.jpeg"></a>
                         <div href="#" class="userName">${posts.user}</div>
                       </div>
                       <div class="divider"></div>
                     <div class="card-image">
                       <img class="postImage" src="${posts.image}">
                     </div>
                     <div class="divider"></div>
                     <div class="card-content">
                       <div class="postCaption">${posts.caption}</div>
                     </div>
                     <div class="divider"></div>
                     <div class="divider"></div>
                     <div class="card-content">
                       <div class="postComments">
                       <div class="commentSection" id="${posts.postNum}"></div></div>
                     </div>
                     <div class="divider"></div>
                     <div class="row">
                         <div class="card-action">
                         <div class="input-field col s12">
                           <input id="input${posts.postNum}" type="text" class="validate">
                           <label class="active" for="input${posts.postNum}">Message</label>
                           <a id="btnComment${posts.postNum}" class="waves-effet waves-light btn">Post</a>
                         </div>
                     </div>
                     </div>
                   </div>
                 </div>
               </div>`);

               $(`#btnComment${id}`).click(function(){
                console.log(`You hit button id #btnComment${id}`)
                let comment = $(`#input${posts.postNum}`).val();
                let commentId = id
                let data={
                    comment,
                    commentId
                };
                console.log(data)
                $.get("/comment", data,function(){
        
                });
                $(`#input${posts.postNum}`).val(" ");
            });

               setInterval(()=>{       
       $.get("/comments", function(comments){
            $(`#${posts.postNum}`).empty();
            comments.forEach((comment)=>{
             if (comment.commentId == id){
             $(`#${id}`).append(`<div class='row'>${comment.comments}</div>`);
            };
          })
        });
      },1000)
      })
    });

 

    



    //This is posting a comment from the board


    // //This block handles the retreival of messages and adds them to the board

    // //get messages
 
    
    // setInterval(()=>{
    //    $.get("/comments", function(comments){
    //         $("#comments").empty();
    //         comments.forEach((comment)=>{
    //           if (comment.commentId == post){
    //              $("#comments").append(`<div class='row'>${comment.comments}</div>`);
    //         };
    //     })
    //   });
    // },1000)



  });
