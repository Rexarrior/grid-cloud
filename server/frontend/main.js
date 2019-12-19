function init()
{
    document.ID = Math.floor(Math.random() * Math.floor(1000000));
    idplace = document.getElementById("id-place");
    idplace.innerText = document.ID;
}




function run()
{
    ;
    if (document.checkTaskId != undefined)
    {
        alert("Already executing")
        return
    }
    argPlace = document.getElementById('arg-input');
    arg = argPlace.value; 
    document.getElementById("RunButton").setAttribute("disabled", "disabled");
    axios.post(RUN_PATH, {
        id: document.ID,
        arg: arg
      }).then(function(){
            document.checkTaskId = setInterval(check_result, 1000);
            startLoadingAnimation();
      })
      .catch(function(){
          alert("Some erro occursed while run. Aborting...");
          document.getElementById("RunButton").removeAttribute("disabled");

      })
}




function check_result()
{
    axios.post(RESULT_PATH, {
        id: document.ID,
      })
      .then(check_result_handler).catch( check_result_error)
}



function check_result_handler(request)
{
   
    result = request.headers['result']  ;
    if (result >= 0)
    {
        document.Answer = result
        resultPlace = document.getElementById("answer-place")
        resultPlace.innerText = "Answer is " + result
        clearInterval(document.checkTaskId)
        document.checkTaskId = undefined
        stopLoadingAnimation();
        document.getElementById("RunButton").removeAttribute("disabled");

    }
}



function check_result_error(arg)
{
    alert("Some erro occursed while getting result. Aborting...");
    clearInterval(document.checkTaskId);
    document.checkTaskId = undefined;
    stopLoadingAnimation();
    document.getElementById("RunButton").removeAttribute("disabled");

}


function startLoadingAnimation() 
{
  var imgObj = $("#loadImg");
  imgObj.show();
 
  var centerY = $(window).scrollTop() + ($(window).height() + imgObj.height())/2;
  var centerX = $(window).scrollLeft() + ($(window).width() + imgObj.width())/2;
 
  imgObj.offset({top: centerY, left: centerX});
}
 
function stopLoadingAnimation() // - функция останавливающая анимацию
{
  $("#loadImg").hide();
}












document.addEventListener("DOMContentLoaded", init);