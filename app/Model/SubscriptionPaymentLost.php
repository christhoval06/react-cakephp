<?php

  class SubscriptionPaymentLost extends AppModel {
    public $validate = array(
      'post_data' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      )
    );
  }
?>
