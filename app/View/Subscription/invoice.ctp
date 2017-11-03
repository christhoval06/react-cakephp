<!DOCTYPE html>
<html>
  <head>
    <title>Fattura n.<?php echo $payment['billing_number'] . "/" . $payment['billing_year']; ?></title>
    <style type="text/css">
    * {
      font-family: Arial
    }
    table {
      border-collapse: collapse
    }
    address {
      margin-bottom: 1cm
    }
    .border-bottom-blue {
      border-bottom: 1pt solid #34495e;
    }
    .border-bottom-gray,
    tr.border-bottom-gray > td {
      border-bottom: 1pt solid #d3d3d3;
    }
    th {
      -webkit-print-color-adjust: exact;
      background-color: #34495e;
      color: white;
      text-align: left;
      font-weight: normal;
    }
    label {
      color: #34495e;
    }
    th, td {
      padding: 2mm;
    }
    @media print {
      table {
        width: 100%
      }
    }
    </style>
  </head>
  <body>
    <table>
      <tr>
        <td>
          <address>
            WZeta S.r.l.s.<br />
            Via Taranto 9/Q<br />
            75100 Matera (MT)<br />
            C.F. e P.I.<br />
            IT01284050778
        </td>
        <td colspan="3">&nbsp;</td>
      </tr>
      <tr>
        <th colspan="2">Fattura N. <?php echo $payment['billing_number']; ?></th>
        <th colspan="2">Del <?php echo $payment['billing_year']; ?></th>
      </tr>
      <tr>
        <td colspan="4" class="border-bottom-gray">
          <label>Intestatario</label>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <?=$user['profile']['name'] . " " . $user['profile']['surname']; ?><br />
          <?=$user['profile']['fiscal_code']; ?>
          <?=$user['profile']['vat_number']; ?><br />
          <pre><?=$user['profile']['address']; ?></pre>
        </td>
      </tr>
      <tr>
        <th>Quantit&agrave;</th>
        <th>Descrizione</th>
        <th>Prezzo Unitario</th>
        <th>Totale</th>
      </tr>
      <tr class="border-bottom-gray">
        <td>1</td>
        <td><?php echo $package['description_for_paypal']; ?></td>
        <td><?php echo $payment['payout']; ?> &euro;</td>
        <td><?php echo $payment['payout']; ?> &euro;</td>
      </tr>
      <?php $type = isset($user['profile']['type']) ? $user['profile']['type'] : "private"; ?>
      <?php if($type === "private" || $type === "company") : ?>
      <tr>
        <td colspan="2">&nbsp;</td>
        <td class="border-bottom-gray"><label>Subtotale</label></td>
        <td class="border-bottom-gray"><?php echo (($payment['payout'] / 100) * (100 - $package['vat'])); ?> &euro;</td>
      </tr>
      <tr>
        <td colspan="2">&nbsp;</td>
        <td class="border-bottom-gray"><label>IVA</label></td>
        <td class="border-bottom-gray"><?php echo (($payment['payout'] / 100) * $package['vat']); ?> &euro;</td>
      </tr>
      <?php endif; ?>
      <tr>
        <td colspan="2">&nbsp;</td>
        <td class="border-bottom-gray"><label>Totale</label></td>
        <td class="border-bottom-gray"><?php echo $payment['payout']; ?> &euro;</td>
      </tr>
    </table>
  </body>
</html>
