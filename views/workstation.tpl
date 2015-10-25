% rebase('base.tpl', title="Workstation {}".format(wsid))

<div id="workstation">
  <p id="waiting-msg" class="msg">Waiting for call initiation from main
  hub.</p>

  <p id="voted-msg" class="msg">Sending telemetry data... Return to main
  hub.</p>

  <div id="buttons">
    <a id="succeed-btn" class="cast-vote" data-vote="1" href="#succeed"
    >Call for help</a>
    <a id="fail-btn" class="cast-vote" data-vote="0" href="#fail"
    >Don't call for help</a>
  </div>
</div>

<script type="text/javascript">
window.Shapeshifter = {
  'wsid': {{wsid}}
}
</script>

<script src="/static/script/jquery-2.1.4.min.js"></script>
<script src="/static/script/workstation.js"></script>
