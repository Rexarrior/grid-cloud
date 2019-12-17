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


def run(request):
    arg = request.Arg
    id = request.ID
    record = Record()
    record.user_id = id
    record.arg = arg
    record.completed = False
    record.answer = 0
    record.save()

    return HttpResponse(status=200)

def main(request):
    return FileResponse(open(BASE_DIR+'/frontend/index.html',
                             'rb'))


def static_delivery(request, path=""):
    p = BASE_DIR + '/frontend/' + path
    print(f'requested path {p}')
    if os.path.isfile(p):
        response = FileResponse(open(p))
        if 'css'in path:
            response['Content-Type'] = 'text/css'
        if 'js' in path:
            response['Content-Type'] = 'text/javascript'

    else:
        response = HttpResponseNotFound
    return response
