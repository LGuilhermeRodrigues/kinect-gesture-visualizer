from os import walk
import xml.etree.ElementTree as ET
import json
import skeleton_extractor as extractor

def folder_to_actor(folder_number):
    if folder_number <=42:
        return 1
    if folder_number <=42:
            return 2
    if folder_number <=63:
            return 3
    if folder_number <=84:
            return 4
    if folder_number <=105:
            return 5
    if folder_number <=126:
            return 6
    if folder_number <=147:
            return 7
    if folder_number <=168:
            return 8
    if folder_number <=189:
            return 9
    if folder_number <=234:
            return 10
    print('Unexpected Folder: '+folder_number)

action_list = []
action_points_folder = 'dataset/ActionPoints'
for (directory_path, directory_names, filenames) in walk(action_points_folder):
    for filename in filenames:
        tree = ET.parse(f'{action_points_folder}/{filename}')
        root = tree.getroot()
        for action_point in root:
            action = action_point[0].text
            frame_start = action_point[1].text
            action_list.append((int(filename[12:][:-4]),folder_to_actor(int(filename[12:][:-4])), action, int(frame_start)))

action_total = len(action_list)
count = 1
current_folder = 22

breaks = []
for idx, act in enumerate(action_list):
    if idc == action_total:
        break
	folder,actor,mov_name,frame = act
	if current_folder == folder:
	    breaks.append(frame)
	else:
	    frames = extractor.extract_skeleton(f'dataset/{mov_name}/KinectOutput{current_folder}/Skeleton')
	    #send breaks interval to folders
	    frame_id = 0








	    initial = breaks.pop(0)
	    breaks = []
	    current_folder = folder
