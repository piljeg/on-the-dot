import cv2
import numpy as np
import requests

# Global variables
polygon_points = []
image_url = "https://www.hak.hr/info/kamere/983.jpg"

def get_image_from_url(url):
    response = requests.get(url)
    img_array = np.array(bytearray(response.content), dtype=np.uint8)
    img = cv2.imdecode(img_array, -1)
    return cv2.resize(img, (1280, 720))  # Resize to match original dimensions

# Callback function for mouse events
def mouse_callback(event, x, y, flags, param):
    global polygon_points
    if event == cv2.EVENT_LBUTTONDOWN:
        polygon_points.append((x, y))
        print(f"Point Added: (X: {x}, Y: {y})")
        if len(polygon_points) == 4 or len(polygon_points) == 8:
            print_vertices()

def print_vertices():
    global polygon_points
    if len(polygon_points) == 4:
        print("First polygon vertices:")
        print(f"{polygon_points}")
    elif len(polygon_points) == 8:
        print("Second polygon vertices:")
        print(f"{polygon_points[4:]}")

# Get the first image
frame = get_image_from_url(image_url)

# Create a window and set the mouse callback
cv2.namedWindow('Frame')
cv2.setMouseCallback('Frame', mouse_callback)

while True:
    # Create a copy of the original frame to draw on
    display_frame = frame.copy()

    # Draw the polygon on the frame
    if len(polygon_points) > 1:
        cv2.polylines(display_frame, [np.array(polygon_points[:4])], isClosed=True, color=(0, 255, 0), thickness=2)
        if len(polygon_points) > 4:
            cv2.polylines(display_frame, [np.array(polygon_points[4:])], isClosed=True, color=(255, 0, 0), thickness=2)

    # Draw points
    for point in polygon_points:
        cv2.circle(display_frame, point, 5, (0, 0, 255), -1)

    cv2.imshow('Frame', display_frame)

    # Press 'Esc' to exit, 'n' for new image
    key = cv2.waitKey(1) & 0xFF
    if key == 27:  # Esc key
        break
    elif key == ord('n'):  # 'n' key
        frame = get_image_from_url(image_url)

cv2.destroyAllWindows()

# Print the final polygon points
print("Final Polygon Points:")
for i, point in enumerate(polygon_points):
    print(f"Point {i+1}: X: {point[0]}, Y: {point[1]}")

if len(polygon_points) >= 4:
    print("\nFirst polygon vertices:")
    print(f"{polygon_points[:4]}")
if len(polygon_points) == 8:
    print("\nSecond polygon vertices:")
    print(f"{polygon_points[4:]}")