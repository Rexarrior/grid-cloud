function init()
{
    document.ID = Math.floor(Math.random() * Math.floor(1000000));
    idplace = document.getElementById("id-place");
    idplace.innerText = document.ID;
}




function run()
{
    if (document.checkTaskId != undefined)
    {
        alert("Already executing")
        return
    }
    argPlace = document.getElementById('arg-input')
    arg = argPlace.value; 
    axios.post(RUN_PATH, {
        id: document.ID,
        arg: arg
      })
      .then(run_request_handler)
      .catch()
    document.checkTaskId = setInterval(check_result, 1000)
}



function run_request_handler(request)
{

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
    }
}



function check_result_error(arg)
{
    clearInterval(document.checkTaskId);
    document.checkTaskId = undefined;
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