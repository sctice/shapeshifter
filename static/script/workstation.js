(function() {
  var POLLING_INTERVAL = 1000;

  var votingPanelEl = $('#voting');
  var votingEls = $('.cast-vote');

  var voteActive = false;
  var voted = false;

  votingEls.each(function() {
    var vote = $(this).attr('data-vote');
    $(this).on('click', function() {
      castVote(vote)
    });
  });

  setInterval(function() {
    $.ajax({
      url: '/update-workstation',
      success: function(response) {
        setVoting(parseInt(response.voting) == 1);
      }
    });
  }, POLLING_INTERVAL);

  function setVoting(voting) {
    voteActive = voting;
    votingPanelEl.toggleClass('hidden', !voting);
    if (!voting) {
      voted = false;
      votingPanelEl.removeClass('voted');
    }
  }

  function castVote(vote) {
    if (!voteActive || voted) {
      return;
    }

    $.ajax({
      url: '/update-workstation',
      data: {'station': Shapeshifter.wsid, 'cast-vote': vote},
      success: null
    });

    voted = true;
    votingPanelEl.addClass('voted');
  }
})();
