import xml.etree.ElementTree as ET
import json
my_data = []

tree = ET.parse('Skeleton 113.xml')
root = tree.getroot()
for i,child in enumerate(root):
    if i == 1:
        print(child)
        for option in child:
            if option.tag == "Joints":
                for joint in option:
                    position = joint[0]
                    print(f'x={position[0].text}; y={position[1].text}; z={position[2].text}')
                    x=position[0].text
                    y=position[1].text
                    z=position[2].text
                    my_data.append({"x": x, "y": y, "z":z})

with open("skeleton.json", "w") as write_file:
    json.dump(my_data, write_file)