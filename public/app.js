  $(document).ready(function(){
    console.log("Document ready");
    let post = 1;


    //This is posting a comment from the board
    $("#btnMessage").click(function(){
        let comment = $("#messageBox").val();
        let commentId = post;
        let data={
            comment,
            commentId
        };
        $.get("/comment", data,function(){

        });
    });

    //This block handles the retreival of messages and adds them to the board

    //get messages
 
    
    setInterval(()=>{
       $.get("/comments", function(comments){
            $("#comments").empty();
            comments.forEach((comment)=>{
              if (comment.commentId == post){
                 $("#comments").append(`<div class='row'>${comment.comments}</div>`);
            };
        })
      });
    },1000)



  });
