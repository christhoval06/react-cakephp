<?php
  class UserProp extends AppModel {
    /**
     * Indicate personal referal code of this user.
     * @var string
     */
    const REFERAL_CODE = "referal_code";
    /**
     * Indicate the referal code of parent user (How bring the user to the platform).
     * @var string
     */
    const REFERAL_SOURCE = "referal_source";
    /**
     * Indicate the referal status of this user.
     * Referal status can be: pending, completed
     *
     * - pending: this user has not yet buyed an account.
     * - completed: this user has bought an account from this user.
     * @var string
     */
    const REFERAL_STATUS = "referal_status";
    /**
     * Indicate how much user earn from first payment. The value is expressed
     * in "money" value.
     * @var string
     */
    const REFERAL_FIRST_PAYMENT_COMMISSION = "referal_first_payment_commission";
    /**
     * Indicate how much user earn from next payments after fist. The value is expressed
     * in "money" value.
     * @var string
     */
    const REFERAL_NEXT_PAYMENTS_COMMISSION = "referal_next_payments_commission";
    /**
     * Indicate prefered language for this user.
     * @var string
     */
    const PREFERED_LANG = "prefered_lang";
    /**
     * Indicate user's network name.
     * @var string
     */
    const NETWORK_NAME = "network_name";
    /**
     * Indicate user's network whitelist
     * @var string
     */
    const NETWORK_URL_WHITELIST = "network_url_whitelist";
    /**
     * Indicate referencing network.
     * Referencing network must be an item contained in NETWORK_NAME prop.
     * @var string
     */
    const NETWORK_REFERENCE = "network_reference";

    /**
     * Returns prop from specified array.
     * @param  array $props   array of props from which retrieve data.
     * @param  string $name    property to search for.
     * @param  object $default default value to returns if nothing found.
     * @return object result.
     */
    public function getProp($props, $name, $default = null) {
      foreach($props as $prop) {
        if ($prop['name'] === $name) {
          return empty($prop['value']) ? $default : $prop['value'];
        }
      }
      return $default;
    }

    /**
     * Check if array contains specified prop.
     */
    public function hasProp($props, $name) {
      $prop = $this->getProp($props, $name, null);
      return !is_null($prop) && !empty($prop);
    }

    /**
     * Set specific prop or add it as new.
     */
    public function setProp(&$props, $name, $value) {
      $propSet = false;
      foreach($props as $prop) {
        if ($prop['name'] == $name) {
          $prop['value'] = $value;
          $propSet = true;
        }
      }
      if (!$propSet) {
        $props[] = array('name' => $name, 'value' => $value);
      }
    }

    public function changeProp($user, $name, $value) {
      $this->begin();
      $this->deleteAll(array(
        'name' => $name,
        'user_id' => $user['User']['id']
      ));
      $this->create();
      $this->save(array(
        'name' => $name,
        'value' => $value,
        'user_id' => $user['User']['id']
      ));

      $this->commit();
    }

    public $validate = array(
      'name' => array(
        'required' => array(
          'rule' => 'notBlank',
          'message' => 'Required'
        )
      )
    );

  }
