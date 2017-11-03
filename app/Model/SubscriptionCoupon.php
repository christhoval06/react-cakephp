<?php
  class SubscriptionCoupon extends AppModel {
    public function canList($user) {
      return isset($user['User']) && $user['User']['role'] == 'admin';
    }
    public $validate = array(
      'subscription_package_id' => array(
        'required' => array(
          'rule' => 'notBlank',
          'message' => 'Required'
        )
      ),
      'coupon_code' => array(
        'required' => array(
          'rule' => 'notBlank',
          'message' => 'Required'
        ),
        'unique' => array(
          'rule' => 'uniqueCouponCode',
          'message' => 'Coupon code already used.'
        )
      ),
      'discount' => array(
        'required' => array(
          'rule' => 'notBlank'
        ),
        'validDiscount' => array(
          'rule' => 'validDiscount',
          'message' => 'Discount price cannot be greater the 20% of the original price'
        )
      ),
      'max_payments' => array(
        'required' => array(
          'rule' => 'notBlank'
        )
      )
    );

    public function getList(&$params, $user) {
      $this->virtualFields = array(
        'used_coupons' => "SELECT COUNT(*) FROM subscription_payments WHERE subscription_coupon_id = SubscriptionCoupon.id AND first_coupon_payment = 1"
      );
      return parent::find('all', $params);
    }

    public function uniqueCouponCode($check) {
      $value = array_values($check);
      $value = $value[0];
      $filter = array();
      $filter[] = array('coupon_code' => $value);
      if (isset($this->data[$this->alias]['id'])) {
        $filter[] = array('id != ' => $this->data[$this->alias]['id']);
      }
      $filter = array('conditions' => $filter);
      return $this->find('count', $filter) == 0;
    }

    public function validDiscount($check) {
      $value = array_values($check);
      $value = $value[0];
      if (isset($this->data[$this->alias]['subscription_package_id'])) {
        $packageId = $this->data[$this->alias]['subscription_package_id'];
        $package = ClassRegistry::init('SubscriptionPackage')->findById($packageId);
        if (isset($package['SubscriptionPackage'])) {
          $package = $package['SubscriptionPackage'];
          $amount = $package['amount'];
          $amount20perc = $amount * 0.2;
          return $value <= $amount20perc;
        }
      }
      return false;
    }
  }
?>
