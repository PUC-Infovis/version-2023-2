import pandas as pd 

df = pd.read_csv('taylor_swift_spotify.csv', sep=",")

#eliminamos columnas que no se utilizarán
new_df = df.drop([ "id", "uri"], axis=1)
#print(new_df.head(3))
new_df = new_df.rename(columns = {'Unnamed: 0':'id'})
print(new_df)


new_df.to_json("teilor.json", orient="records", indent=4)

