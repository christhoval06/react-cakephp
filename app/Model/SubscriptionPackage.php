<?php

  class SubscriptionPackage extends AppModel {
    public $validate = array(
      'theme' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      ),
      'group' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      ),
      'ordinal' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      ),
      'title' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      ),
      'billing_type' => array(
        'required' => array(
          'rule' => 'notBlank',
        ),
        'valid' => array(
          'rule' => array('inList', array('RecurringPayments', 'MerchantInitiatedBilling'))
        )
      ),
      'billing_period' => array(
        'valid' => array(
          'rule' => array('inList', array('Day', 'Week', 'SemiMonth', 'Month', 'Year')),
          'message' => 'Please provide valid billing period',
          'allowEmpty' => false
        )
      ),
      'billing_frequency' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      ),
      'quota_type' => array(
        'valid' => array(
          'rule' => array('inList', array('daily')),
          'message' => 'Please provide valid quota type',
          'allowEmpty' => false
        )
      ),
      'description' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      ),
      'amount' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      ),
      'vat' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      )
    );

    public function getActive($id) {
      $package = $this->find('first', array(
        'conditions' => array(
          'is_active' => 1,
          'id' => $id
        )
      ));
      if( isset($package['SubscriptionPackage'])) {
        return $package['SubscriptionPackage'];
      }
      else {
        return null;
      }
    }

    public function getList(&$params, $user) {
      if (!isset($user['User']) || $user['User']['role'] != 'admin') {
        $params['conditions']['is_active'] = 1;
      }
      return parent::find('all', $params);
    }

    /**
     * Get subscription package by specified payment record.
     * @param  array $payment Payment record from which deduce package id.
     * @return array Package informations record.
     */
    public function getByPayment($payment) {
      $packageId = 0;
      if (isset($payment['SubscriptionPayment'])) {
        $packageId = $payment['SubscriptionPayment']['subscription_package_id'];
      }
      else {
        $packageId = $payment['subscription_package_id'];
      }
      return $this->find('first', array(
        'conditions' => array(
          'id' => $packageId
        )
      ));
    }

    /**
     * Calculate next billing date .
     * @param  array $package Package from which retrieve info about duration.
     * @param  array $auth Auth componente from which retrieve connected user in
     * @return DateTime Returns next billing date based on package info.
     */
    public function calculateNextBillingDate($package, $user) {
      if (isset($package['SubscriptionPackage'])) {
        $package = $package['SubscriptionPackage'];
      }
      $today = new DateTime(date('Y-m-d'));
      $expiryDate = new DateTime($user['User']['expiry_date']);
      if( $expiryDate < $today) {
        $expiryDate = $today;
      }
      $T = $package['billing_period'][0];
      $F = $package['billing_frequency'];

      $expiryDate->add(new DateInterval("P$F$T"));

      return $expiryDate;
    }
  }
?>
