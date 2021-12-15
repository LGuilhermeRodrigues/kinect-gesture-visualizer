import urllib.request

# run this command on Powershell to delete old frames
# Get-ChildItem -Path "D:\GitProjects\ClassificadorDeGestos\json_frames" -Include *.html -File -Recurse | foreach { $_.Delete()}

for actor in range(1,11):
    for movement in ['TennisServe','Clap','KickRight','KickLeft',
                     'ThrowBowlingBall','Run','Jump','TennisSwingBackhand',
                     'PunchLeft','SteerRight','TennisSwingForehand','Crouch',
                     'Walk','Flap','AimAndFireGun','GolfSwing','SteerCentre',
                     'SteerLeft','Defend','Climb','Wave','PunchRight']:
        path = f'http://localhost:8000/json_frames/{actor}/{movement}/'
        f = urllib.request.urlopen(f'http://localhost:8000/json_frames/{actor}/{movement}/')
        html_code = f.read()
        with open(f'json_frames/{actor}/{movement}/index.html', "w") as html_file:
            print('saving',actor,movement)
            html_file.write("".join([chr(x) for x in html_code]))