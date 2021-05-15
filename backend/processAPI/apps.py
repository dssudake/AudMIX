from django.apps import AppConfig
from django.conf import settings
from tensorflow.keras.models import model_from_json


class ProcessapiConfig(AppConfig):
    name = 'processAPI'

    json_file = open(settings.MODEL_ARCH_PATH, 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    model = model_from_json(loaded_model_json)
    model.load_weights(settings.MODEL_WEIGHT_PATH)
