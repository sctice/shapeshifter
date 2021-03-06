% rebase('base.tpl', title="Workstation {}".format(wsid))

<div id="workstation">
  <p id="waiting-msg" class="msg">Waiting for call initiation from main
  hub.</p>

  <p id="voted-msg" class="msg">Sending telemetry data... Return to main
  hub.</p>

  <table id="buttons">
    <tr>
      <td>
        <a id="succeed-btn" class="cast-vote" data-vote="{{vote_yes}}"
         href="#succeed">Send Signal</a>
      </td>
      <td>
        <a id="fail-btn" class="cast-vote" data-vote="{{vote_no}}"
         href="#fail">Disrupt Signal</a>
      </td>
    </tr>
  </table>
</div>

<script type="text/javascript">
window.Shapeshifter = {
  'wsid': {{wsid}}
}
</script>

<script src="/static/script/jquery-2.1.4.min.js"></script>
<script src="/static/script/workstation.js"></script>
