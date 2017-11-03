<?php
  class SubscriptionPayment extends AppModel {
    public $validate = array(
      'user_id' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      ),
      'subscription_package_id' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      ),
      'payout' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      ),
      'status' => array(
        'required' => array(
          'rule' => 'notBlank'
        ),
        'valid' => array(
          'rule' => array('inList', array('Pending', 'Completed', 'Canceled')),
          'message' => 'Invalid status',
          'allowEmpty' => false
        )
      )
    );

    public $virtualFields = array(
      'user' => "SELECT username FROM users WHERE id = SubscriptionPayment.user_id LIMIT 1"
    );

    /**
     * Create an order with required properties necessary to send it to Paypal.
     * @param  array $package Package informations.
     * @param  integer $userId  User id for which order is created.
     * @param  array $coupon copunt to get discount price for this order.
     * @return array Order array.
     */
    public function createOrder($package, $user, $coupon = null) {
      $baseUrl = Router::url("/", true);
      $type = isset($user['profile']) ? $user['profile']['type'] : "private";
      $tax = 0;
      $qs = "";
      if (!is_null($coupon)) {
        $package['amount'] = $package['amount'] - $coupon['discount'];
        $qs = $qs . "&coupon=" . $coupon['coupon_code'];
      }
      switch($type) {
        case "private":
        case "company":
          $tax = round($package['amount'] * ($package['vat'] / 100), 2);
          break;
      }
      $order = array(
        'description' => $package['title'],
        'currency' => 'EUR',
        'return' => $baseUrl . "client/#/subscription-package/grid?s=p$qs",
        'cancel' => $baseUrl . "client/#/subscription-package/grid?s=c$qs",
        /*'return' => "http://localhost:3000/client/#/subscription-package/grid?s=p$qs",
        'cancel' => "http://localhost:3000/client/#/subscription-package/grid?s=c$qs",*/
        'shipping' => 0,
        'custom' => $package['id'],
        'billing_type' => $package['billing_type'],
        'billing_type_description' => $package['description_for_paypal'],
        'items' => array(
          0 => array(
            'name' => $package['title'],
            'description' => $package['description_for_paypal'],
            'tax' => $tax,
            'subtotal' => round($package['amount'] - $tax, 2),
            'qty' => 1
          )
        )
      );
      return $order;
    }

    public function getList(&$params, $user) {
      if ($user['User']['role'] != 'admin') {
        $params['conditions']['user_id'] = $user['User']['id'];
      }
      return parent::find('all', $params);
    }

    public function getLastPending($payerId) {
      return $this->find('first', array(
        'conditions' => array(
          'payer_id' => $payerId,
          'status' => 'Pending'
        ),
        'order' => array(
          'created' => 'DESC'
        )
      ));
    }

    public function getLastPayed($payerId, $profileId = null) {
      $conditions = array(
        'payer_id' => $payerId,
        'status' => 'Completed'
      );
      if (isset($profileId) && !is_null($profileId)) {
        $conditions['profile_id'] = $profileId;
      }
      return $this->find('first', array(
        'conditions' => $conditions,
        'order' => array(
          'created' => 'DESC'
        )
      ));
    }

    public function get($id, $user) {
      $role = $user['User']['role'];
      if ($role != 'admin') {
        return $this->find('first', array(
          'conditions' => array(
            'id' => $id,
            'user_id' => $user['User']['id']
          )
        ));
      }
      else {
        return $this->find('first', array(
          'conditions' => array(
            'id' => $id
          )
        ));
      }
    }
  }
?>
