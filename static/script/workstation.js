(function() {
  var POLLING_INTERVAL = 1000;

  var workstationEl = $('#workstation');
  var buttonEls = $('.cast-vote');

  var voteActive = false;
  var voted = false;


  buttonEls.each(function() {
    var vote = $(this).attr('data-vote');
    $(this).on('click', function() {
      castVote(vote)
      return false;
    });
  });

  sizeButtons();
  $(window).on('resize', sizeButtons);

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
    workstationEl.toggleClass('voting', voting);
    if (!voting) {
      voted = false;
      workstationEl.removeClass('voted');
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
    workstationEl.addClass('voted');
  }

  function sizeButtons() {
    // The height available minus margins.
    var buttonHeight = window.innerHeight - 220;
    buttonEls.each(function() {
      $(this).css({
        'height': buttonHeight,
        'line-height': buttonHeight + 'px'
      });
    });
  }
})();
