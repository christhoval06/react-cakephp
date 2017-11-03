<h1 style="display:block;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;line-height:30px;margin:0.75em 0px;padding:0px;text-align:left;color:rgb(51,51,51)!important">
  Nuova richiesta di contatto!
</h1>
<p style="margin:1em 0px;padding:0px">
  L'utente <?php echo $name . ' ' . $surname; ?> ha inoltrato la seguente
  richiesta di contatto:
</p>
<table style="border-spacing:0px;line-height:15px;padding:10px 0px;width:458px;border-collapse:separate!important">
  <tbody>
    <tr>
      <td style="font-weight:bold;white-space:nowrap;width:114px;padding:5px 0px;vertical-align:top">
        Email:
      </td>
      <td style="padding:5px 0px;vertical-align:top">
        <a href="mailto:<?php echo $email; ?>"><?php echo $email; ?></a>
      </td>
    </tr>
    <tr>
      <td style="font-weight:bold;white-space:nowrap;width:114px;padding:5px 0px;vertical-align:top">
        Messaggio:
      </td>
      <td style="padding:5px 0px;vertical-align:top">
        <?php echo $message; ?>
      </td>
    </tr>
  </tbody>
</table>
