% rebase('base.tpl', title="Workstation {}".format(wsid))

<h1>Workstation {{wsid}}</h1>

<div id="voting" class="hidden">
  <button class="cast-vote" data-vote="1">Succeed!</button>
  <button class="cast-vote" data-vote="0">Fail!</button>
</div>

<script type="text/javascript">
window.Shapeshifter = {
  'wsid': {{wsid}}
}
</script>

<script src="/static/script/jquery-2.1.4.min.js"></script>
<script src="/static/script/workstation.js"></script>
