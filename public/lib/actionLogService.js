    /*Update action log
    To use this function to broadcast an action to the actionlog simply add this to any function
            let data = {
            name: nameplayer,
            action: action
          }
        $.get('/actionLog',data)
    */
   function updateActionLog(){
    socket.on('updateactionlog', data => {
      $('#actionLogWindow').append(`${data.name} has ${data.action}<br/>`)
  });
}
