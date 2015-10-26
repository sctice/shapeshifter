#!/usr/bin/env python

import bottle as btl
from bottle import request, response


ABSTAIN = 'A'
VOTE_YES = 'Y'
VOTE_NO = 'N'

app = btl.Bottle()
app.config['voting'] = False
app.config['valid_stations'] = set(['1', '2', '3'])
app.config['valid_votes'] = set([ABSTAIN, VOTE_YES, VOTE_NO])


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
        default_votes = [(k, ABSTAIN) for k in app_config['valid_stations']]
        app_config['votes'] = dict(default_votes)
        app_config['voting'] = True
    elif int(request.query.get('stop-vote', 0)) == 1:
        app_config['voting'] = False
        votes = app_config['votes']
        total_votes = sum(1 for v in votes.itervalues() if v != ABSTAIN)
        yes_votes = sum(1 for v in votes.itervalues() if v == VOTE_YES)
        success = total_votes >= 1 and yes_votes == total_votes
        json['success'] = 1 if success else 0
    json['voting'] = app_config['voting']
    return json


@app.get('/workstation/<wsid:int>')
@btl.view('workstation')
def get_workstation(wsid):
    if str(wsid) not in request.app.config['valid_stations']:
        btl.abort(404, "Invalid workstation")
    return {
        'wsid': wsid,
        'vote_yes': VOTE_YES,
        'vote_no': VOTE_NO
    }


@app.get('/update-workstation')
def get_workstation_update():
    json = {}
    app_config = request.app.config
    voting = app_config['voting']
    vote = request.query.get('cast-vote', None)
    if vote is not None and voting:
        if vote in app_config['valid_votes']:
            station = request.query.get('station')
            if station in app_config['valid_stations']:
                app_config['votes'][station] = vote
    json['voting'] = 1 if voting else 0
    return json


@app.get('/static/<filepath:path>')
def asset(filepath):
    return btl.static_file(filepath, root='static')


btl.run(app, host='0.0.0.0', port=8080, debug=True, reloader=True)
