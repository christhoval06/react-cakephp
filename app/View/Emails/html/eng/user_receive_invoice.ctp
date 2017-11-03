<h1 style="display:block;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;line-height:30px;margin:0.75em 0px;padding:0px;text-align:left;color:rgb(51,51,51)!important">
  Invoice generated for payment <?php echo $payment['id']; ?>!
</h1>
<p style="margin:1em 0px;padding:0px">
  Hi <?php echo $user['username']; ?>,
  we have generated the invoice for your payment!
  You can download a copy accessing the Dashboard panel and cliking on "Payments" menu item.
</p>
<h2 style="display:block;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:bold;line-height:25px;margin:1em 0px 0px;padding:0px;text-align:left;color:rgb(51,51,51)!important">
  Recap:
</h2>
<p style="margin:1em 0px;padding:0px">
  Invoice generated for these payment data:
</p>
<hr style="background-color:rgb(221,221,221);border:0px;min-height:1px;margin:0px;width:458px;background-position:initial initial;background-repeat:initial initial">
<table style="border-spacing:0px;line-height:15px;padding:10px 0px;width:458px;border-collapse:separate!important">
  <tbody>
    <tr>
      <td style="font-weight:bold;white-space:nowrap;padding:5px 0px;vertical-align:top">
        Plan:
      </td>
      <td style="padding:5px 0px;vertical-align:top">
        <?php echo $package['title']; ?>
      </td>
    </tr>
    <tr>
      <td style="font-weight:bold;white-space:nowrap;padding:5px 0px;vertical-align:top">
        Duration:
      </td>
      <td style="padding:5px 0px;vertical-align:top">
        <?php echo $package['billing_frequency'] . ' ' . __($package['billing_period']); ?>
      </td>
    </tr>
    <tr>
      <td style="font-weight:bold;white-space:nowrap;padding:5px 0px;vertical-align:top">
        Cost:
      </td>
      <td style="padding:5px 0px;vertical-align:top">
        <?php echo $payment['payout']; ?> &euro;
      </td>
    </tr>
    <tr>
      <td style="font-weight:bold;white-space:nowrap;width:180px;padding:5px 0px;vertical-align:top">
        Recurring payments:
      </td>
      <td style="padding:5px 0px;vertical-align:top">
        <?php echo $package['billing_type'] == 'RecurringPayments' ? "Si" : "No"; ?>
      </td>
    </tr>
  </tbody>
</table>
<hr style="background-color:rgb(221,221,221);border:0px;min-height:1px;margin:0px;width:458px;background-position:initial initial;background-repeat:initial initial">
