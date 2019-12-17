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


def run(request):
    arg = request.Arg
    id = request.id
    record = Record()
    record.user_id = id
    record.arg = arg
    record.completed = False
    record.answer = 0
    record.save()
    launch_result = subprocess.run(['ansible-playbook',
                                    './core/ansible/launch.yml',
                                    '--extra-vars', 'vmID=' + id],
                                   capture_output=True)
    addr = "http://195.133.144.66/api/complete"
    launch_result = subprocess.run('ansible-playbook', 
                                   './core/ansible/run_task.yml',
                                    '--extra-vars',
                                   'vmID=' + id, 'id=' + id,
                                   'arg=' + arg, 'addr=' + addr)
    return HttpResponse(status=200)


def complete(request):
    id = request.id
    ans = request.answer
    record = Record.objects.get(user_id=id)
    record.answer = ans
    record.completed = True
    record.save()
    return HttpResponse(status=200)


def get_result(request):
    id = request.id
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
