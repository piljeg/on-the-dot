import cv2
import numpy as np
from ultralytics import YOLO
import requests
import json
import csv
from datetime import datetime
import os
import re

# Load the best fine-tuned YOLOv8 model
best_model = YOLO('models/best.pt')

# Define thresholds for traffic intensity
light_traffic_threshold = 10
moderate_traffic_threshold = 15
heavy_traffic_threshold = 20

# Define font, scale, and colors for the annotations
font = cv2.FONT_HERSHEY_SIMPLEX
font_scale = 0.5
font_color = (255, 255, 255)    # White color for text
background_color = (0, 0, 255)  # Red background for text

# CSV file name
csv_filename = 'traffic_data.csv'

def load_camera_data(file_path='cameras.json'):
    with open(file_path, 'r') as file:
        data = json.load(file)
    
    # Extract camera ID from URL
    for camera in data['cameras']:
        url = camera['cameraUrl']
        camera_id = re.search(r'/(\d+)\.jpg$', url)
        if camera_id:
            camera['id'] = camera_id.group(1)
        else:
            camera['id'] = 'unknown'
    
    return data['cameras']

def get_image_from_url(url):
    response = requests.get(url)
    img_array = np.array(bytearray(response.content), dtype=np.uint8)
    img = cv2.imdecode(img_array, -1)
    return cv2.resize(img, (1280, 720))  # Resize to match original dimensions

def determine_traffic_intensity(total_vehicles):
    if total_vehicles <= light_traffic_threshold:
        return "Light"
    elif total_vehicles <= moderate_traffic_threshold:
        return "Moderate"
    elif total_vehicles <= heavy_traffic_threshold:
        return "Heavy"
    else:
        return "Very Heavy"

def save_to_csv(camera_id, lane_data):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    file_exists = os.path.isfile(csv_filename)
    
    with open(csv_filename, 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        if not file_exists:
            writer.writerow(['Timestamp', 'Camera ID', 'Lane', 'Total Vehicles', 'Traffic Intensity'])
        for lane, (total_vehicles, intensity) in lane_data.items():
            writer.writerow([timestamp, camera_id, lane, total_vehicles, intensity])

def process_camera(camera_data):
    frame = get_image_from_url(camera_data['cameraUrl'])
    
    # Create a copy of the original frame to modify
    detection_frame = frame.copy()

    # Perform inference on the frame
    results = best_model.predict(detection_frame, imgsz=640, conf=0.4)
    processed_frame = results[0].plot(line_width=1)
    
    # Process each lane
    lane_data = {}
    for i, lane in enumerate(camera_data['lanes']):
        lane_poly = np.array(lane, np.int32).reshape((-1, 1, 2))
        cv2.polylines(processed_frame, [lane_poly], True, (0, 255, 0), 2)
        
        # Count vehicles in this lane
        vehicles_in_lane = 0
        for box in results[0].boxes.xyxy:
            x_center = int((box[0] + box[2]) / 2)
            y_center = int((box[1] + box[3]) / 2)
            if cv2.pointPolygonTest(lane_poly, (x_center, y_center), False) >= 0:
                vehicles_in_lane += 1
        
        # Determine traffic intensity for this lane
        intensity = determine_traffic_intensity(vehicles_in_lane)
        lane_data[f'Lane {i+1}'] = (vehicles_in_lane, intensity)
        
        # Add lane annotation
        cv2.putText(processed_frame, f'Lane {i+1}: {vehicles_in_lane} - {intensity}', 
                    (10, 30 + i*30), font, font_scale, font_color, 2, cv2.LINE_AA)

    # Save data to CSV
    save_to_csv(camera_data['id'], lane_data)

    # Add camera ID annotation
    cv2.putText(processed_frame, f'Camera ID: {camera_data["id"]}', 
                (10, processed_frame.shape[0] - 10), font, font_scale, font_color, 2, cv2.LINE_AA)

    return processed_frame

def main():
    cameras = load_camera_data()
    
    while True:
        for camera in cameras:
            processed_frame = process_camera(camera)
            
            # Display the processed frame
            cv2.imshow(f'Traffic Analysis - Camera {camera["id"]}', processed_frame)

        # Wait for 20 seconds or until 'q' is pressed
        if cv2.waitKey(20000) & 0xFF == ord('q'):
            break

    # Close all the frames
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()