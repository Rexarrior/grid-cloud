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
      .then(check_result_request_handler)
}



function check_result_handler(request)
{
    if (request.status != 200)
    {
        alert("Error response")  ;
        clearInterval(document.checkTaskId);
        document.checkTaskId = undefined;
    } 
    result = request.getResponseHeader('result');
    if (result >= 0)
    {
        document.Answer = result
        resultPlace = document.getElementById("answer-place")
        resultPlace.innerText = "Answer is " + result
        clearInterval(document.checkTaskId)
        document.checkTaskId = undefined
    }
}

document.addEventListener("DOMContentLoaded", init);