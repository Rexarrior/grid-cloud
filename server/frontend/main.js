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



var RECORD_HTML = [
    "<div class=\"panel panel-default\">\n<div class=\"panel-heading\">\n  <h3 class=\"panel-title\">\n",
    "</h3>\n</div>\<div class=\"panel-body\">\n<div class=\"record_place\"><pre class=\"language-javascript\"><code class=\"language-javascript\">\n",
    "</code></pre></div>\n</div>\n</div>"
]



function LoadRecords()
{
    SendRequest("GET", "/api/get_records", [], function(request){
        var container = document.getElementById("record_place");
        console.log(request);
        let records =  request.response;
        records = JSON.parse(records) ;
        let txt = "";
        for (var i =0; i < records.length; i++)
        {
            
            txt += RECORD_HTML[0];
            txt += i;
            txt += RECORD_HTML[1];
            txt += JSON.stringify(records[i].fields);
            txt += RECORD_HTML[2];
        }
        container.innerHTML = txt;
        });
}



function ClearView()
{
    var container = document.getElementById("record_place");
    container.innerText = "";
}


function ClearDB()
{
    SendRequest("GET", "/api/reset_db",[], function(){
        alert("Все записи из базы данных были удалены.");
    });
}
