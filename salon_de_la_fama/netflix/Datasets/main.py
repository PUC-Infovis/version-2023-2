import json
# Read the csv

# importing module 
import csv
  
# csv fileused id Geeks.csv
filename="Geeks.csv"
 
# opening the file using "with"
# statement
csvpath = 'imdb_top_1000.csv'

title_list_1 = []
with open(csvpath,'r', encoding='utf-8') as data:
    for line in csv.reader(data):
        title_list_1.append(line[1].lower())

print(title_list_1)


csvpath_2 = 'Netflix_dataset.csv'
title_list_2 = []
with open(csvpath_2, 'r', encoding='utf-8') as data:
    for line in csv.reader(data):
        title_list_2.append(line[0].lower())

print(title_list_2)



intersection = list(set(title_list_1) & set(title_list_2))
print("intersection len", len(intersection))

dict_dataset = {}

# Netflix
# Titulo, Dir, pais, año, calificación, duración
# 0, 1, 2, 4, 6, 7

# IMDB
# poster, genre, imbd_rating, overview, Meta_score, n_votes
# 0, 5, 6, 7, 8, 14

keys = ["title", "director", "country", "year","decade", "classification", "duration", "poster", "genre", "imdb_rating", "overview", "Meta_score", "n_votes"]


with open(csvpath_2, 'r', encoding='utf-8') as data:
    for line in csv.reader(data):
        if line[0].lower() in intersection:
            dict_dataset[line[0].lower()] = [line[0], line[1], line[2], line[4], str(int(line[4]) // 10 * 10),line[6], line[7]]


with open(csvpath, 'r', encoding='utf-8') as data:
    for line in csv.reader(data):
        if line[1].lower() in intersection:
            if line[15] == '':
                print("no tiene gross rev")
            dict_dataset[line[1].lower()].extend([line[0], line[5], line[6], line[7], line[8], line[14]])

# csvpath = 'imdb_top_1000.csv'
# with open(csvpath, newline='', encoding='utf-8') as csvfile:
#     for lines in csvfile:
#         print(lines)

# print(dict_dataset)

json_list = []

for value in dict_dataset.values():
    json_list.append(dict(zip(keys, value)))

# print(json_list)


file_path = 'final_dataset.json'

# Writing the dictionary to a JSON file
with open(file_path, 'w') as json_file:
    json.dump(json_list, json_file)


