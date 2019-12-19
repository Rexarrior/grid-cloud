from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField, ArrayField
from django.db import models


# Magic numbers take from magic specifications.
class Record(models.Model):
    primary_key = models.AutoField(primary_key=True)
    user_id = models.TextField()
    arg = models.IntegerField()
    completed = models.BooleanField()
    answer = models.TextField()