#!/bin/env python3

import requests

data = {"album_number": "53896"}

response = requests.post("http://localhost:8000", json=data)

print(response.text)
