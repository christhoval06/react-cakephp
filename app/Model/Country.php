<?php
  class Country extends AppModel {
    public $validate = array(
      'code' => array(
        'required' => array(
          'rule' => array('notBlank')
        )
      ),
      'name' => array(
        'required' => array(
          'rule' => array('notBlank')
        )
      )
    );

    public function getCodeByUser($user, $default) {
      if (!isset($user['profile'])) {
        return $default;
      }
      $profile = $user['profile'];
      if (!isset($profile['country_id'])) {
        return $default;
      }
      $countryId = $profile['country_id'];
      $country = $this->findById($countryId);
      return isset($country['Country'])
        ? $country['Country']['code']
        : $default;
    }
  }
?>
