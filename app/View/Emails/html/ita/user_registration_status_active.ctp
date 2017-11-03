<h1 style="display:block;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;line-height:30px;margin:0.75em 0px;padding:0px;text-align:left;color:rgb(51,51,51)!important">
  <?php echo isset($name) ? $name : $username; ?>, sei dei nostri!
</h1>
<p style="margin:1em 0px;padding:0px">
  Il tuo account di prova è stato attivato, da questo momento hai 48h per
  accedere gratuitamente a tutti i servizi di SafeGuard.
</p>
<h2 style="display:block;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:bold;line-height:25px;margin:1em 0px 0px;padding:0px;text-align:left;color:rgb(51,51,51)!important">
  Come proseguire?
</h2>
<p style="margin:1em 0px;padding:0px">
  Al termine dei 14 giorni gratuiti il software smetterà di funzionare, per questo
  motivo ti invieremo una mail di “allert” 12 ore prima della scadenza della prova.
</p>
<p style="margin:1em 0px;padding:0px">
  Se desideri continuare ad usare SafeGuard dovrai confermare il tuo account a
  pagamento: puoi farlo in ogni momento (anche prima del termine delle ore di prova)
  accedendo alla sezione “Acquista” nel menù del tuo pannello personale e scegliendo
  il piano tariffario più adatto alle tue esigenze.
</p>
<h2 style="display:block;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:bold;line-height:25px;margin:1em 0px 0px;padding:0px;text-align:left;color:rgb(51,51,51)!important">
  Riepilogo dati account:
</h2>
<hr style="background-color:rgb(221,221,221);border:0px;min-height:1px;margin:0px;width:458px;background-position:initial initial;background-repeat:initial initial">
<table style="border-spacing:0px;line-height:15px;padding:10px 0px;width:458px;border-collapse:separate!important">
  <tbody>
    <tr>
      <td style="font-weight:bold;white-space:nowrap;width:114px;padding:5px 0px;vertical-align:top">
        Username:
      </td>
      <td style="padding:5px 0px;vertical-align:top">
        <?php echo $username; ?>
      </td>
    </tr>
    <?php if(isset($name) && !empty($name)) : ?>
      <tr>
        <td style="font-weight:bold;white-space:nowrap;width:114px;padding:5px 0px;vertical-align:top">
          Nome:
        </td>
        <td style="padding:5px 0px;vertical-align:top">
          <?php echo $name; ?>
        </td>
      </tr>
    <?php endif; ?>
    <?php if(isset($surname) && !empty($surname)) : ?>
    <tr>
      <td style="font-weight:bold;white-space:nowrap;width:114px;padding:5px 0px;vertical-align:top">
        Cognome
      </td>
      <td style="padding:5px 0px;vertical-align:top">
        <?php echo $surname; ?>
      </td>
    </tr>
    <?php endif; ?>
  </tbody>
</table>
<hr style="background-color:rgb(221,221,221);border:0px;min-height:1px;margin:0px;width:458px;background-position:initial initial;background-repeat:initial initial">
<p style="margin:1em 0px;padding:0px">
  <a href="<?php echo $this->Html->url("/dashboard", true); ?>" style="border:1px solid rgb(20,140,0);border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:4px;border-bottom-left-radius:4px;display:inline-block;font-weight:bold;margin:5px 0px 10px;padding:8px 18px;text-align:center;background-color:rgb(70,175,50)!important;color:rgb(255,255,255)!important;text-decoration:none!important" target="_blank">
    Accedi alla piattaforma
  </a>
</p>
