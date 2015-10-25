% rebase('base.tpl', title="Workstation {}".format(wsid))

<div id="workstation">
  <p id="waiting-msg" class="msg">Awaiting beacon coordinates...</p>

  <p id="voting-msg" class="msg">Select <strong>Succeed</strong> in order to do
  your part to place the beacon at the appropriate coordinates. Select
  <strong>Fail</strong> in order to guarantee that placing the beacon
  fails.</p>

  <p id="voted-msg" class="msg">Sending telemetry data...</p>

  <div id="buttons">
    <a id="succeed-btn" class="cast-vote" data-vote="1" href="#succeed"
    >Succeed</a>
    <a id="fail-btn" class="cast-vote" data-vote="0" href="#fail">Fail</a>
  </div>
</div>

<script type="text/javascript">
window.Shapeshifter = {
  'wsid': {{wsid}}
}
</script>

<script src="/static/script/jquery-2.1.4.min.js"></script>
<script src="/static/script/workstation.js"></script>
