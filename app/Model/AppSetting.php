<?php
  class AppSetting extends AppModel {
    public $validate = array(
      'key' => array(
        'required' => array(
          'rule' => array('notBlank'),
          'message' => 'Required'
        )
      ),
      'value' => array(
        'required' => array(
          'rule' => array('notBlank'),
          'message' => 'Required'
        )
      )
    );

    public function canList($user) {
      return isset($user['User']) && $user['User']['role'] == 'admin';
    }
    public function canSave($item, $user) {
      return $this->canList($user);
    }
    public function canDelete($id, $user) {
      return $this->canList($user);
    }

    public function saveItem($data, $user) {
      $key = $data["AppSetting"]['key'];
      return parent::save($data);
    }

    public function getValue($key) {
      $setting = $this->findByKey($key);
      return isset($setting['AppSetting'])
        ? $setting['AppSetting']['value']
        : null;
    }

    public function getBoolean($key) {
      $v = $this->getValue($key);
      return $v == 1 || $v == "1" || $v == "true" || $v == "True";
    }
  }
?>
