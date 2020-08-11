import xml.etree.ElementTree as ET
import json
my_data = []

def extract_skeleton(path):
    tree = ET.parse(path)
    my_skeleton = []
    root = tree.getroot()
    for i,child in enumerate(root):
        if i == 1:
            #print(child)
            for option in child:
                if option.tag == "Joints":
                    for joint in option:
                        position = joint[0]
                        #print(f'x={position[0].text}; y={position[1].text}; z={position[2].text}')
                        x=position[0].text
                        y=position[1].text
                        z=position[2].text
                        my_skeleton.append({"x": x, "y": y, "z":z})

    return my_skeleton

folder = 'dataset/Misc/KinectOutput40/Skeleton'
from os import walk
for (dirpath, dirnames, filenames) in walk(folder):
    for filename in filenames:
        my_data.append(extract_skeleton(f'{folder}/{filename}'))

with open("skeletons.json", "w") as write_file:
    json.dump(my_data, write_file)