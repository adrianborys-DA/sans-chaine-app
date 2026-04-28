import os
import pandas as pd
from fitparse import FitFile
import logging
import gzip

logging.basicConfig(level=logging.INFO)

def process_fit_files(folder_path, rider_name):
    all_data = []
    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' not found.")
        return

    files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.fit', '.fit.gz'))]
    print(f"Processing {len(files)} files...")

    for file_name in files:
        file_path = os.path.join(folder_path, file_name)
        try:
            if file_name.lower().endswith('.gz'):
                with gzip.open(file_path, 'rb') as f:
                    fitfile = FitFile(f.read())
            else:
                fitfile = FitFile(file_path)

            ride_records = []
            for record in fitfile.get_messages('record'):
                data = record.get_values()
                ride_records.append({
                    'timestamp': data.get('timestamp'),
                    'power': data.get('power', 0),
                    'heart_rate': data.get('heart_rate', 0)
                })
            
            df = pd.DataFrame(ride_records)
            if not df.empty:
                df['Rider'] = rider_name
                all_data.append(df)
                print(f"Done: {file_name}")
        except Exception as e:
            print(f"Error {file_name}: {e}")

    if all_data:
        master = pd.concat(all_data)
        master.to_csv('Master_Training_Data.csv', index=False)
        print("Success: Master_Training_Data.csv created.")

if __name__ == "__main__":
    folder = input("Enter folder path: ")
    name = input("Enter Rider Name: ")
    process_fit_files(folder, name)
