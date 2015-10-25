(function() {
  var svgDocument;

  var START_STATE = 1;
  var READY_TO_START_VOTE_STATE = 2;
  var VOTING_STATE = 3;
  var GAME_OVER_STATE = 4;

  var VOTE_DURATION = 10 * 1000; // 10 seconds
  var VOTE_LEEWAY = 1 * 1000;    //  1 second

  var hubState = START_STATE;
  var call_history = [];

  var messageScreens = [
    "CalculatingVote",
    "StartVote",
    "VoteFail",
    "VoteSuccess",
    "IntroLayer",
    "VideoPlaceholder"
  ];

  window.onload = function() {
    var obj = document.getElementById('HubObj');
    svgDocument = obj.contentDocument;
    showStartState();
    $(document).on('keyup', mykeypress);
  }

  // ANIMATIONS

  var myTimerVar = null;
  var loadingCount = 1;

  var numberOfLoadingElements = 12;

  function hideMe(x) {
    svgDocument.getElementById(x).setAttributeNS(null, 'opacity', 0);
  }

  function showMe(x) {
    svgDocument.getElementById(x).setAttributeNS(null, 'opacity', 1);
  }

  function hideMessages() {
    for(var i = 0; i < messageScreens.length; ++ i) {
      hideMe(messageScreens[i]);
    }
  }

  function hideCallHistorySymbols() {
    for(var i = 1; i < 4; ++ i) {
      hideMe("SuccessSymbol"+i);
      hideMe("FailSymbol"+i);
    }
  }

  function setCallHistory() {
    // call_history is an array e.g. ["success", "fail"] or [1, 0]
    hideCallHistorySymbols();
    var tox = call_history.length;
    if (tox > 3) {
      tox = 3;
    }
    for(var i = 0; i < tox; ++ i) {
      if (call_history[i] == 'success' || call_history[i] == 1) {
        showMe("SuccessSymbol"+(i+1));
      } else {
        showMe("FailSymbol"+(i+1));
      }
    }
  }

  function startLoadingAnimation() {
    loadingCount = 1;
    myTimerVar = setInterval(nextLoadingElement, 100);
  }

  function stopLoadingAnimation() {
    clearInterval(myTimerVar);
    loadingCount = 1;
    for(i = 1; i <= numberOfLoadingElements; ++i) {
      showMe("Status"+i);
    }
  }

  function nextLoadingElement() {
    for(i = 1; i <= numberOfLoadingElements; ++i) {
      if (i == loadingCount) {
        hideMe("Status"+i);
      } else {
        showMe("Status"+i);
      }
    }
    loadingCount += 1;
    if (loadingCount > numberOfLoadingElements) {
      loadingCount = 1;
    }
  }

  // MOUSE / KEYBOARD

  function mouseHasMoved(event) {
    var diffx = (old_mouse_x - event.clientX);
    diffx = diffx*diffx;
    var diffy = (old_mouse_y - event.clientY);
    diffy = diffy*diffy;
    var dist = Math.sqrt(diffx+diffy);
    if (dist > move_thresh) {
      console.log("move");
    }
    old_mouse_x = event.clientX;
    old_mouse_y = event.clientY;
  }

  function mykeypress(event) {
    if (event.keyCode == 32) { // space bar
      if (hubState == START_STATE) {
        playIntroVideo();
      }

      if (hubState == READY_TO_START_VOTE_STATE) {
        startVote();
      }
    }
  }

  // MOUSE STUFF

  var move_thresh = 2;
  var old_mouse_x = 0;
  var old_mouse_y = 0;

  // for 'fingerprint scanner'
  //document.addEventListener('mousemove', mouseHasMoved, false);

  // STATES

  function showStartState() {
    hideMessages();
    hideCallHistorySymbols();
    showMe("IntroLayer");
  }

  function playIntroVideo() {
    hideMessages();
    showMe("VideoPlaceholder");
    setTimeout(voteReady, 3000);
  }

  function voteReady() {
    hideMessages();
    showMe("StartVote");
    hubState = READY_TO_START_VOTE_STATE;
  }

  function startVote() {
    hideMessages();
    // countdown to vote
    startLoadingAnimation();
    hubState = VOTING_STATE;
    $.ajax({
      url: '/update-bridge',
      data: {'start-vote': 1},
      success: null
    });
    setTimeout(votingPeriodOver, VOTE_DURATION);
  }

  function votingPeriodOver() {
    showMe("CalculatingVote");
    setTimeout(function() {
      $.ajax({
        url: '/update-bridge',
        data: {'stop-vote': 1},
        dataType: 'json',
        success: function(result) {
          hideMessages();
          var success = parseInt(result.success, 10) > 0;
          showVoteResults(success)
        }
      });
    }, VOTE_LEEWAY);
  }

  function showVoteResults(success) {
    hideMessages();
    if (success) {
      showMe("VoteSuccess");
      call_history.push("success");
    } else {
      showMe("VoteFail");
      call_history.push("fail");
    }
    setCallHistory();
    stopLoadingAnimation();
    if (call_history.length == 3) {
      setTimeout(playEndVideo, 3000);
    } else {
      setTimeout(voteReady, 3000);
    }
  }

  function playEndVideo() {
    hideMessages();
    showMe("VideoPlaceholder");
    // after a long time, reset to start
    setTimeout(resetToStart, 5000);
    hubState = GAME_OVER_STATE;
  }

  function resetToStart() {
    call_history = [];
    hubState = START_STATE;
    showStartState();
  }
})();
