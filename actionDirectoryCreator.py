from os import walk
import xml.etree.ElementTree as ET
import json
import skeleton_extractor as extractor

def mov_to_scenario(mov_name):
    dictionary = {
        'TennisServe': 'Tennis',
        'Clap': 'Misc',
        'KickRight': 'Fighting',
        'KickLeft': 'Fighting',
        'ThrowBowlingBall': 'Bowling',
        'Run': 'FPS',
        'Jump': 'FPS',
        'TennisSwingBackhand': 'Tennis',
        'PunchLeft': 'Fighting',
        'SteerRight': 'Driving',
        'TennisSwingForehand': 'Tennis',
        'Crouch': 'FPS',
        'Walk': 'FPS',
        'Flap': 'Misc',
        'AimAndFireGun': 'FPS',
        'GolfSwing': 'Golf',
        'SteerCentre': 'Driving',
        'SteerLeft': 'Driving',
        'Defend': 'Fighting',
        'Climb': 'FPS',
        'Wave': 'Misc',
        'PunchRight': 'Fighting'
    }
    if mov_name in dictionary:
        return dictionary[mov_name]
    else:
        print('Unexpected value in mov_to_scenario')
        return ''


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


def get_breaks(folder_id, last_frame):
    break_actions = []
    for item in action_list:
        actor = item[1]
        if item[0] == folder_id:
            break_actions.append(item)
    breaks = []
    for index, act in enumerate(break_actions):
        folder,actor,mov_name,frame=(act[0],act[1],act[2],act[3])
        if index < (len(break_actions) - 1):
            next_frame = break_actions[index+1][3]-1
        else:
            next_frame = last_frame
        breaks.append((mov_name,frame,next_frame))
    return actor, breaks


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

def sorting(obj):
    return obj[0]

action_list.sort(key=sorting)

folders = set()
for action_point in action_list:
    folders.add((action_point[0],mov_to_scenario(action_point[2])))
folders = list(folders)
last_frames = {}
movement_id = 0
for folder,scene in folders:
        frames_directory = f'dataset/{scene}/KinectOutput{folder}/Skeleton'
        frame_ids = []
        frames = {}
        for (dirpath, dirnames, filenames) in walk(frames_directory):
            for filename in filenames:
                frame_id = int(filename[9:-4])
                frame_ids.append(frame_id)
                frames[frame_id] = extractor.extract_skeleton(f'{frames_directory}/{filename}')
        last_frames[folder]=max(frame_ids)
        actor, breaks = get_breaks(folder,last_frames[folder])
        #print(folder,actor,breaks)
        for movement_name, start, stop in breaks:
            movement = []
            for frame_id in range(start, stop-1):
                if frame_id in frames:
                    movement.append(frames[frame_id])
            with open(f'json_frames/{actor}/{movement_name}/{movement_id}.json', "w") as write_file:
                movement_id = movement_id + 1
                json.dump(movement, write_file)
                #print('saved a movement: ',folder,actor,start,stop,stop-start,len(movement),'frames')

        testing = False
        if testing:
            with open("skeletons.json", "w") as write_file:
                json.dump([frames[frame_id] for frame_id in range(min(frame_ids)+1,max(frame_ids))], write_file)
                print('saved all movements on skeletons')
                break
