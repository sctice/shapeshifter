#!/usr/bin/env python

import bottle as btl
from bottle import request, response


app = btl.Bottle()
app.config['voting'] = False
app.config['votes'] = {'1': 0, '2': 0, '3': 0}
app.config['valid_stations'] = set(['1', '2', '3'])


@app.get('/bridge')
@btl.view('bridge')
def get_bridge():
    return {}


@app.get('/update-bridge')
def get_bridge_update():
    json = {}
    app_config = request.app.config
    voting = app_config['voting']
    if int(request.query.get('start-vote', 0)) == 1:
        default_votes = [(k, 0) for k in app_config['valid_stations']]
        app_config['votes'] = dict(default_votes)
        app_config['voting'] = True
    elif int(request.query.get('stop-vote', 0)) == 1:
        app_config['voting'] = False
        votes = app_config['votes']
        success = sum(votes.itervalues()) == len(votes)
        json['success'] = 1 if success else 0
    json['voting'] = app_config['voting']
    return json


@app.get('/workstation/<wsid:int>')
@btl.view('workstation')
def get_workstation(wsid):
    if str(wsid) not in request.app.config['valid_stations']:
        btl.abort(404, "Invalid workstation")
    return {'wsid': wsid}


@app.get('/update-workstation')
def get_workstation_update():
    json = {}
    app_config = request.app.config
    voting = app_config['voting']
    vote = request.query.get('cast-vote', None)
    if vote is not None and voting:
        vote = 1 if int(vote) == 1 else 0
        station = request.query.get('station')
        if station in app_config['valid_stations']:
            app_config['votes'][station] = vote
    json['voting'] = 1 if voting else 0
    return json


@app.get('/static/<filepath:path>')
def asset(filepath):
    return btl.static_file(filepath, root='static')


btl.run(app, host='0.0.0.0', port=8080, debug=True, reloader=True)
