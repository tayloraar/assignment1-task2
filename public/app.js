
// This is the main script for the application that will run after the document is read.
$(document).ready(function(){

  // Tell us the document is ready and set up 'sidenav' for the new post window.
  console.log("Document ready");
  $('.modal').modal();
  
  // Load - posts, set up HTML, link buttons and provide constant pull for messages.
  $.get("/postnum", function(posts){
    $("#mainColum").empty();
    let postCount = posts.length;

    /* This will populate the page with the posts, pushing through the posts and adding in id's and informaiton where needed. 
    I've also nested some other functions that use the posts.*/
    posts.forEach((posts)=>{
      let id = posts.postNum;

      $("#mainColum").prepend(`
        <div class="row post">
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
                <h5>Caption</h5>
                <div class="postCaption">${posts.caption}</div>
              </div>
              <div class="divider"></div>
              <div class="card-content">
                <div class="postComments">
                  <h5>Comments</h5>
                  <div class="card-content" id="${posts.postNum}"></div>
                </div>
              </div>
              <div class="divider"></div>
              <div class="row">
                <div class="card-content">
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

      // New Post
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
                  if(image != ""){
                  $.ajax({
                      url:"/post",
                      contentType: 'application/json',
                      data: JSON.stringify(data),
                      type: 'post',
                      // success: function(result){
                      //   console.log(result);
                      // }
                    });
                  }

                  $(`#input${posts.postNum}`).val(" ");
                  $(`#userNameIn`).val(" ");
                  $(`#imageUrl`).val(" ");
                  $(`#captionIn`).val(" ");
                  location.reload();
            });

      // New Comment
      $(`#btnComment${id}`).click(function(){
        console.log(`You hit button id #btnComment${id}`);
        let comments = $(`#input${posts.postNum}`).val();
        let commentId = id;
        let data={
          comments,
          commentId
        }
        $.ajax({
          url:"/comment",
          contentType: 'application/json',
          data: JSON.stringify(data),
          type: 'post',
          // success: function(result){
          //   console.log(result);
          // }
        })

        $(`#input${posts.postNum}`).val(" ");
      });

      // Constant Pull New Comments
      setInterval(()=>{       
        $.get("/comments", function(comments){
          $(`#${posts.postNum}`).empty();
          comments.forEach((comment)=>{
            if (comment.commentId == id){
              $(`#${id}`).append(`<div class='row'><i class="material-icons prefix">subdirectory_arrow_right</i> ${comment.comments}</div>`);
            }
          });
        });
      },1000);
    });
  });
});
