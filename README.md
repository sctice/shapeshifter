# Shapeshifter

A small Bottle-powered project to run a networked game of "shapeshifter". The game is played with four players: three crew members and one evil shapeshifter; the crew do not know who the shapeshifter is. The group has to place three beacons to summon the shapeshifter eradicators, each attempt to set a beacon requiring three people.

Before each attempt to set a beacon begins, the group agrees on three people to send. Once the decision is made, the attempt is initiated and the three selected players have a fixed amount of time to enter their "succeed" or "fail" votes secretly, each at a separate terminal. Failing to cast a vote in time counts as a vote for failure. If all votes are cast for success, then the mission is a success; otherwise, it's a failure. If at least two of the three attempts to set a beacon succeed then the crew wins, and otherwise the shapeshifter wins.

## Implementation

The game state is managed by a Bottle server. The server expects HTTP requests from one "bridge" client and three "workstation" clients. The bridge client is responsible for sending requests to the server to move it between the states of the game, and the workstation clients poll the server to find out when a vote is happening. When a vote is active, the workstation clients are permitted to send a "vote" request that records a "succeed" or "fail" vote for the corresponding workstation. 