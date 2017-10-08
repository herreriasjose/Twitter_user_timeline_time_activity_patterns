# app.py

__author__ = "Jose Herrerías"
__version__ = "1.0.0"
__email__ = "herreriasjose@gmail.com"
__status__ = "Test"

import json
import sqlite3
import datetime


# Notice the scrape code is not included in this package
db = sqlite3.connect("realDonaldTrump.db")

cursor = db.cursor()

cursor.execute("SELECT created_at, text FROM tweets")
timestamps_in_tuples = cursor.fetchall()

timestamps_in_a_list = []

for i in range(len(timestamps_in_tuples)):
    timestamps_in_a_list.append(timestamps_in_tuples[i][0])


dates_in_json = [json.dumps({'created_at':int(timestamp)}) for timestamp in timestamps_in_a_list]

file_name = 'timestamps_dataset.json'

all_the_timestamps_in_a_huge_str = ",".join(dates_in_json)

with open(file_name,'w') as f:
    f.write('[')
    f.write(all_the_timestamps_in_a_huge_str)
    f.write(']')

print("Done!")