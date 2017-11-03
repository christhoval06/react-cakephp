<h1 style="display:block;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;line-height:30px;margin:0.75em 0px;padding:0px;text-align:left;color:rgb(51,51,51)!important">
  Complimenti! Da ora fai parte della community di SafeGuard!
</h1>
<p style="margin:1em 0px;padding:0px">
  Verrai aggiunto al gruppo segreto &quot;SafeGuard members&quot; su Facebook, riservato
  ai nostri abbonati, dove verranno condivisi i contenuti esclusivi e le esperienze degli utenti.
</p>
<h2 style="display:block;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:bold;line-height:25px;margin:1em 0px 0px;padding:0px;text-align:left;color:rgb(51,51,51)!important">
  Riepilogo:
</h2>
<p style="margin:1em 0px;padding:0px">
  Il tuo account a pagamento è stato attivato con la seguente modalità:
</p>
<hr style="background-color:rgb(221,221,221);border:0px;min-height:1px;margin:0px;width:458px;background-position:initial initial;background-repeat:initial initial">
<table style="border-spacing:0px;line-height:15px;padding:10px 0px;width:458px;border-collapse:separate!important">
  <tbody>
    <tr>
      <td style="font-weight:bold;white-space:nowrap;padding:5px 0px;vertical-align:top">
        Piano tariffario:
      </td>
      <td style="padding:5px 0px;vertical-align:top">
        <?php echo $package['title']; ?>
      </td>
    </tr>
    <tr>
      <td style="font-weight:bold;white-space:nowrap;padding:5px 0px;vertical-align:top">
        Durata:
      </td>
      <td style="padding:5px 0px;vertical-align:top">
        <?php echo $package['billing_frequency'] . ' ' . __($package['billing_period']); ?>
      </td>
    </tr>
    <tr>
      <td style="font-weight:bold;white-space:nowrap;padding:5px 0px;vertical-align:top">
        Costo:
      </td>
      <td style="padding:5px 0px;vertical-align:top">
        <?php echo $package['amount']; ?> &euro;
      </td>
    </tr>
    <tr>
      <td style="font-weight:bold;white-space:nowrap;width:180px;padding:5px 0px;vertical-align:top">
        Addebito automatico:
      </td>
      <td style="padding:5px 0px;vertical-align:top">
        <?php echo $package['billing_type'] == 'RecurringPayments' ? "Si" : "No"; ?>
      </td>
    </tr>
  </tbody>
</table>
<hr style="background-color:rgb(221,221,221);border:0px;min-height:1px;margin:0px;width:458px;background-position:initial initial;background-repeat:initial initial">
<p style="margin:1em 0px;padding:0px">
  Per scaricare la fattura relativa al pagamento accedi alla sezione
  &quot;Pagamenti&quot; nel menù del tuo pannello personale.
</p>
