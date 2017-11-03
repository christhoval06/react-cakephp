<?php
  class SubscriptionPaymentBilling extends AppModel {
    /**
     * Get next valid invoice number to emit new billing document.
     * @param  Number $year Year for which generate the billing doc.
     * @return Number the next valid number for the billing.
     */
    public function calculateNextNumber($year) {
      $billing = $this->findByYear($year);
      $number = 1;
      if (isset($billing['SubscriptionPaymentBilling'])) {
        $number = $billing['SubscriptionPaymentBilling']['number'];
        $billing['SubscriptionPaymentBilling']['number'] = $number + 1;
      }
      else {
        $billing = array('year' => $year, 'number' => ($number + 1));
      }
      parent::save($billing);

      return $number;
    }
  }
?>
