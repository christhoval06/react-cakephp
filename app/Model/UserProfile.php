<?php
  class UserProfile extends AppModel {
    public $primaryKey = "user_id";

    public $validate = array(
      'type' => array(
        'required' => array(
          'rule' => array('notBlank')
        ),
        'inList' => array(
          'rule' => array('inList', array(
            'private',
            'company',
            'foreign_company',
            'foreign_private'
          ))
        )
      )
    );
    public $virtualFields = array(
      "province_name" => "SELECT name FROM municipalities WHERE id = profile.province_id LIMIT 1",
      "city_name" => "SELECT name FROM municipalities WHERE id = profile.city_id LIMIT 1",
      "birth_city_name" => "SELECT name FROM municipalities WHERE id = profile.birth_city_id LIMIT 1",
      "country_name" => "SELECT name FROM countries WHERE id = profile.country_id LIMIT 1"
    );

    public function canList($user) {
      return isset($user['User']) && $user['User']['role'] == 'admin';
    }

    public function canGet($item, $user) {
      if (!isset($user['User'])) {
        return FALSE;
      }
      if ($user['User']['role'] == 'admin') {
        return TRUE;
      }
      $canGet = $item['id'] === $user['User']['id'];
      if ($canGet) {
        return $item;
      }
      else {
        return FALSE;
      }
    }
    public function getValidators($type) {
      $types = array(
        'private' => array(
          'name',
          'surname',
          'address',
          'city_id',
          'zip_code',
          'province_id',
          'fiscal_code'
        ),
        'company' => array(
          'name',
          'address',
          'city_id',
          'zip_code',
          'province_id',
          'vat_number'
        ),
        'foreign_company' => array(
          'name',
          'address',
          'country_id',
          'vat_number'
        ),
        'foreign_private' => array(
          'name',
          'surname',
          'address',
          'country_id',
          'vat_number'
        )
      );
      return $types[$type];
    }

    public function isValid($profile) {
      $valid = !is_null($profile);
      if (!$valid) {
        return $valid;
      }
      $type = $profile['type'];
      if (is_null($type)) {
        return FALSE;
      }
      $validators = $this->getValidators($type);
      foreach($validators as $validator) {
        if (!isset($profile[$validator]) || empty($validator)) {
          return FALSE;
        }
      }
      return TRUE;
    }
  }
?>
