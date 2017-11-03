<?php
  App::uses('UserProp', 'Model');

  class UserLead extends AppModel {
    public $useTable = "users";
    public $hasMany = array(
      'props' => array(
        'className' => 'UserProp',
        'dependent' => true,
        'order' => 'props.name'
      )
    );

    public function canList($user) {
      $up = ClassRegistry::init('UserProp');
      return isset($user['User'])
        && isset($user['props'])
        && $up->hasProp($user['props'], UserProp::REFERAL_CODE);
    }

    public function getList(&$params, $user) {
      $up = ClassRegistry::init('UserProp');
      $this->recursive = -1;
      $code = $up->getProp($user['props'], UserProp::REFERAL_CODE);
      $status = UserProp::REFERAL_STATUS;
      $this->virtualFields = array(
        'first_payment_commission' => $this->calculateFirstPaymentCommission($user),
        'next_payments_commission' => $this->calculateNextPaymentsCommission($user),
        'next_payments_count' => $this->countNextPayments($user),
        'lead_status' => "SELECT value FROM user_props WHERE user_id = UserLead.id AND name = '$status'"
      );
      if (!isset($params['joins'])) {
        $params['joins'] = array();
      }
      $params['joins'][] = array(
        'table' => 'user_props',
        'alias' => 'prop',
        'type' => 'inner',
        'conditions' => array(
          'prop.user_id = UserLead.id',
          'prop.name' => UserProp::REFERAL_SOURCE,
          'prop.value' => $code
        )
      );
      $params['fields'] = array_merge(array(
        'id',
        'username',
        'email'
      ), array_keys($this->virtualFields));
      return parent::find('all', $params);
    }

    private function calculateFirstPaymentCommission($reseller) {
      $prop = UserProp::REFERAL_FIRST_PAYMENT_COMMISSION;
      $resellerId = $reseller['User']['id'];
      return "
        SELECT      CASE sp.payout WHEN NULL THEN 0 ELSE CONVERT(up.value, DECIMAL(10, 2)) END
        FROM        subscription_payments sp
        INNER JOIN  user_props up ON up.user_id = $resellerId
        AND         up.name = '$prop'
        WHERE       sp.user_id = UserLead.id
        ORDER BY    sp.created
        LIMIT       1
      ";
    }

    private function calculateNextPaymentsCommission($reseller) {
      $prop = UserProp::REFERAL_NEXT_PAYMENTS_COMMISSION;
      $resellerId = $reseller['User']['id'];
      return "
        SELECT      CASE up.value WHEN NULL THEN NULL ELSE (COUNT(*) - 1) * CONVERT(up.value, DECIMAL(10, 2)) END
        FROM        subscription_payments sp
        INNER JOIN  user_props up ON up.user_id = $resellerId
        AND         up.name = '$prop'
        WHERE       sp.user_id = UserLead.id
      ";
    }

    private function countNextPayments($reseller) {
      return "SELECT COUNT(*) - 1 FROM subscription_payments WHERE user_id = UserLead.id";
    }
  }
?>
