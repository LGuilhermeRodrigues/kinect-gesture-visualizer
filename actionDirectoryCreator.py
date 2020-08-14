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

action_total = len(action_list)
count = 0
current_folder = None
randMovment = 0
breaks = []
for idx, act in enumerate(action_list):
    if idx == action_total:
        continue
    folder,actor,mov_name,frame=(act[0],act[1],act[2],act[3])
    if current_folder == folder:
        breaks.append(act)
    elif not current_folder:
        current_folder = folder
        frames = []
        #frames_directory = f'dataset/{mov_to_scenario(mov_name)}/KinectOutput{current_folder}/Skeleton'
        #for (dirpath, dirnames, filenames) in walk(frames_directory):
        #        for filename in filenames:
        #            frames.append(extractor.extract_skeleton(f'{frames_directory}/{filename}'))
        breaks.append(act)
    else:
        #send breaks interval to folders
        print('break:',breaks)
        __act = breaks.pop(0)
        __folder,__actor,__mov_name,__frame=(__act[0],__act[1],__act[2],__act[3])
        while (len(breaks)>1):
            _act = breaks.pop(0)
            _folder,_actor,_mov_name,_frame=(_act[0],_act[1],_act[2],_act[3])
            gesture_frames = list(range(__frame, _frame))
            #lets test this gesture
            frames = []
            for frameId in gesture_frames:
                frames_directory = f'dataset/{mov_to_scenario(_mov_name)}/KinectOutput{_folder}/Skeleton/Skeleton {frameId}.xml'
                frames.append(extractor.extract_skeleton(frames_directory))
            with open("skeletons.json", "w") as write_file:
                json.dump(frames, write_file)
                print('saved: ',_act)
            break

        #print(action_list)
        #print(f'{folder} {actor} {mov_name} {frame}')
        frames = []
        frames_directory = f'dataset/{mov_to_scenario(mov_name)}/KinectOutput{current_folder}/Skeleton'
        for (dirpath, dirnames, filenames) in walk(frames_directory):
                for filename in filenames:
                    frames.append(extractor.extract_skeleton(f'{frames_directory}/{filename}'))


        frame_id = 0
        #print(frames)
        #print(f'{folder} {actor} {mov_name} {frame}')
        #print(breaks)


        if len(breaks):
            initial = breaks.pop(0)
        breaks = []
        breaks.append(act)
        current_folder = folder
        if randMovment == 6:
        # 30 deu ruim
            break
        else:
            randMovment = randMovment + 1