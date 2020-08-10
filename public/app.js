  $(document).ready(function(){
    console.log("Document ready");
    $('.sidenav').sidenav();
//On Doucment Load - Posts

       $.get("/postnum", function(posts){
           $("#mainColum").empty();
           let postCount = posts.length
           console.log(postCount)
            posts.forEach((posts)=>{
              let id = posts.postNum
                 $("#mainColum").prepend(`<div class="row post">
                 <div class="col s12">
                   <div class="card">
                     <div class="card-action">
                      <a class="btn-floating btn-small waves-effect waves-light red" href="#"><img class="circle responsive-img" style= "height:inherit;" src="_images/profile1.jpeg"></a>
                      <a href="#" class="userName">${posts.user}</a>
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
               
// setInterval(()=>{
 
//   if ($('.helper-text').attr(data-success, true)){
//    // console.log('true')
//     $('#postBtn').prop('disable', true);
//   } else{
//     $('#postBtn').prop('disable', false);
//     console.log('false')
//   }

// },100);
              //  New Post
               $(`#postBtn`).click(function(){
                  console.log(`You hit post button`)
                  let user = $(`#userNameIn`).val();
                  let image = $(`#imageUrl`).val();
                  let caption = $(`#captionIn`).val();
                  let postNum = postCount + 1;
                  let data={
                    user,
                    image,
                    caption,
                    postNum
                  };
                  console.log(data)
                  if(image != ""){
                    console.log("we have data")
                  $.get("/newPost", data,function(){
          
                  });
                }

                  $(`#input${posts.postNum}`).val(" ");
                  $(`#userNameIn`).val(" ");
                  $(`#imageUrl`).val(" ");
                  $(`#captionIn`).val(" ");
  
            });

              //New Comment
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
              //Constant Pull New Comments
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
  });
