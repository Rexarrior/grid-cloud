from rest_framework import viewsets
from rest_framework.authentication import get_authorization_header
from rest_framework.response import Response
from django.http import FileResponse, HttpResponseNotFound, HttpResponse
from core.models import *
from core.utils.decorators import redirect_if_authorize
from core.utils.exceptions import ErrorResponse
from web_service.settings import BASE_DIR
import json
import os
from django.core import serializers
import random
import subprocess
import string
import re
import sys
import time
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
APP_URL = "http://rexarrior.ml/api/complete"


@csrf_exempt
def run(request):
    data = json.loads(request.body.decode('utf-8'))
    arg = data['arg']
    id = data['id']
    record = Record.objects.filter(user_id=id)
    if (len(record) == 0):
        record = Record()
    else:
        record = record[0]
    record.user_id = id
    record.arg = arg
    record.completed = False
    record.answer = 0
    record.save()
    launch_result = subprocess.call(['ansible-playbook',
                                     './core/ansible/launch.yml',
                                     '--extra-vars',
                                     'vmID=' + str(id),
                                     '--extra-vars',
                                     'id=' + str(id),
                                     '--extra-vars',
                                     'arg=' + str(arg),
                                     '--extra-vars',
                                     'addr=' + APP_URL]
                                    )
    return HttpResponse(status=200)


@csrf_exempt
def complete(request):
    data = json.loads(request.body.decode('utf-8'))
    id = data['id']
    ans = data['answer']
    record = Record.objects.get(user_id=id)
    record.answer = ans
    record.completed = True
    record.save()
    subprocess.call(['ansible-playbook',
                     './core/ansible/terminate.yml',
                     '--extra-vars', 'vmID=' + str(id)]
                    )
    return HttpResponse(status=200)


@csrf_exempt
def get_result(request):
    data = json.loads(request.body.decode('utf-8'))
    id = data['id']
    records = Record.objects.all().filter(user_id=id)
    result = -1
    if (len(records) > 0):
        if (records[0].completed):
            result = int(records[0].answer)
    response = HttpResponse(status=200)
    response['result'] = result
    return response


# def main(request):
#     return FileResponse(open(BASE_DIR+'/frontend/index.html',
#                              'rb'))


# def static_delivery(request, path=""):
#     p = BASE_DIR + '/frontend/' + path
#     print('requested path ' + p)
#     if os.path.isfile(p):
#         response = FileResponse(open(p))
#         if 'css'in path:
#             response['Content-Type'] = 'text/css'
#         if 'js' in path:
#             response['Content-Type'] = 'text/javascript'

#     else:
#         response = HttpResponseNotFound
#     return response
