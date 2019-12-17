function CreateRequest()
{
    var Request = false;

    if (window.XMLHttpRequest)
    {
        //Gecko-совместимые браузеры, Safari, Konqueror
        Request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        //Internet explorer
        try
        {
             Request = new ActiveXObject("Microsoft.XMLHTTP");
        }    
        catch (CatchException)
        {
             Request = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
 
    if (!Request)
    {
        alert("Невозможно создать XMLHttpRequest");
    }
    
    return Request;
} 



/*
Функция посылки запроса к файлу на сервере
r_method  - тип запроса: GET или POST
r_path    - путь к файлу
r_args    - аргументы вида a=1&b=2&c=3...
r_handler - функция-обработчик ответа от сервера
*/
function SendRequest(r_method, r_path, r_args, r_handler)
{
    //Создаём запрос
    var Request = CreateRequest();
    
    //Проверяем существование запроса еще раз
    if (!Request)
    {
        return;
    }
    
    //Назначаем пользовательский обработчик
    Request.onreadystatechange = function()
    {
        //Если обмен данными завершен
        if (Request.readyState == 4)
        {
            //Передаем управление обработчику пользователя
            r_handler(Request);
        }
    }
    
    //Проверяем, если требуется сделать GET-запрос
    if (r_method.toLowerCase() == "get" && r_args.length > 0)
        r_path += "?" + r_args;
    
    //Инициализируем соединение
    Request.open(r_method, r_path, true);
    
    if (r_method.toLowerCase() == "post")
    {
        //Если это POST-запрос
        
        //Устанавливаем заголовок
        Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
        //Посылаем запрос
        Request.send(r_args);
    }
    else
    {
        //Если это GET-запрос
        
        //Посылаем нуль-запрос
        Request.send(null);
    }
} 



function init()
{
    document.ID = Math.floor(Math.random() * Math.floor(1000000))
    idplace = document.getElementById(document.ID)
    idplace.innerText = document.ID
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
    SendRequest("GET", RUN_PATH, {ID:document.ID, arg:arg},
                run_request_handler)
    document.checkTaskId = setInterval(check_result, 1000)
}



function run_request_handler(request)
{

}


function check_result()
{
    SendRequest("GET", RESULT_PATH, {id: document.ID}, check_result_handler)
}



function check_result_handler(request)
{
    if (request.response.status != 200)
    {
        alert("Error response")  
    } 
    result = request.response.result
    if (result >= 0)
    {
        document.Answer = result
        resultPlace = document.getElementById("answer-place")
        resultPlace.innerText = "Answer is " + result
        clearInterval(document.checkTaskId)
        document.checkTaskId = undefined
    }
}


init()