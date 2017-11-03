<?php
App::uses('SimplePasswordHasher', 'Controller/Component/Auth');
App::uses('UserProp', 'Model');
App::uses('UserToken', 'Model');

class User extends AppModel {
  public $validate = array(
    'username' => array(
      'required' => array(
        'rule' => array('notBlank'),
        'message' => 'Required'
      ),
      'unique' => array(
        'rule' => 'uniqueUsername',
        'message' => 'Username already in use.'
      )
    ),
    'password' => array(
      'required' => array(
        'rule' => array('notBlank'),
        'message' => 'Required'
      )
    ),
    'email' => array(
      'required' => array(
        'rule' => array('notBlank'),
        'message' => 'Required'
      ),
      'validEmail' => array(
        'rule' => 'email',
        'message' => 'Please provide valid email address.'
      ),
      'unique' => array(
        'rule' => 'uniqueEmail',
        'message' => 'Email already in use.'
      )
    ),
    'role' => array(
      'valid' => array(
        'rule' => array('inList', array('admin', 'user')),
        'message' => 'Please enter a valid role',
        'allowEmpty' => false
      )
    ),
    'status' => array(
      'valid' => array(
        'rule' => array('inLIst', array('Pending', 'Active')),
        'message' => 'Please enter valid status (Pending|Active)'
      )
    ),
    'expiry_date' => array(
      'valid' => array(
        'rule' => array('notBlank'),
        'message' => 'Please insert valid date'
      )
    )
  );

  public function uniqueEmail($check) {
    $value = array_values($check);
    $value = $value[0];
    $conds = array();
    $conds[] = array('email' => $value);
    if (isset($this->data[$this->alias]['id'])) {
      $conds[] = array('id != ' => $this->data[$this->alias]['id']);
    }
    $count = $this->find('count', array('conditions' => $conds));
    return $count == 0;
  }

  public function uniqueUsername($check) {
    $value = array_values($check);
    $value = $value[0];
    $conds = array();
    $conds[] = array('username' => $value);
    if (isset($this->data[$this->alias]['id'])) {
      $conds[] = array('id != ' => $this->data[$this->alias]['id']);
    }
    $count = $this->find('count', array('conditions' => $conds));
    return $count == 0;
  }

  public $hasMany = array(
    'props' => array(
      'className' => 'UserProp',
      'dependent' => true,
      'order' => 'props.name'
    )
  );

  public $hasOne = array(
    'profile' => array(
      'className' => 'UserProfile',
      'foreignKey' => 'user_id',
      'dependent' => true
    )
  );

  public function canList($user) {
    if (!isset($user['User'])) {
      return FALSE;
    }
    if ($user['User']['role'] == 'admin') {
      return TRUE;
    }

    $userProp = ClassRegistry::init('UserProp');
    $isNetwork = $userProp->hasProp($user['props'], UserProp::NETWORK_NAME);

    return $isNetwork;
  }

  public function canSave($data, $user) {
    if (!isset($user['User'])) {
      return FALSE;
    }
    if ($user['User']['role'] == 'admin') {
      return TRUE;
    }

    $userProp = ClassRegistry::init('UserProp');
    $isNetwork = $userProp->hasProp($user['props'], UserProp::NETWORK_NAME);

    return $isNetwork;
  }

  public function canGet($item, $user) {
    if (!isset($user['User'])) {
      return FALSE;
    }
    if ($user['User']['role'] == 'admin') {
      return TRUE;
    }
    if ($user['User']['id'] == $item['User']['id']) {
      return TRUE;
    }

    $userProp = ClassRegistry::init('UserProp');
    $isNetwork = $userProp->hasProp($user['props'], UserProp::NETWORK_NAME);

    return $isNetwork;
  }

  public function canDelete($id, $user) {
    if (!isset($user['User'])) {
      return FALSE;
    }
    if ($user['User']['role'] == 'admin') {
      return TRUE;
    }

    $userProp = ClassRegistry::init('UserProp');
    $isNetwork = $userProp->hasProp($user['props'], UserProp::NETWORK_NAME);
    if (!$isNetwork) {
      return FALSE;
    }

    $deletingUser = $this->findById($id);
    if (!isset($deletingUser['User'])) {
      return FALSE;
    }
    $deletingUserNetwork = $userProp->getProp($deletingUser['props'], UserProp::NETWORK_REFERENCE);
    $executorUserNetwork = $userProp->getProp($user['props'], UserProp::NETWORK_NAME);

    return $deletingUserNetwork == $executorUserNetwork;
  }

  public function getList(&$params, $user) {
    $userProp = ClassRegistry::init('UserProp');
    if ($user['User']['role'] != 'admin') {
      $params['joins'] = array(
        array(
          'table' => 'user_props',
          'alias' => 'props',
          'type' => 'inner',
          'conditions' => array(
            'props.user_id = User.id',
            'props.name' => UserProp::NETWORK_REFERENCE,
            'props.value' => $userProp->getProp($user['props'], UserProp::NETWORK_NAME)
          )
        )
      );
    }

    return parent::find('all', $params);
  }

  public function saveItem($data, $user) {
    $this->begin();
    $hasher = new SimplePasswordHasher();
    $password = $data['User']['password'];
    $modified = $this->find('count', array(
      'conditions' => array(
        'id' => isset($data['User']['id']) ? $data['User']['id'] : 0,
        'password' => $password
      )
    )) == 0;
    $userProp = ClassRegistry::init('UserProp');
    if (!isset($data['props'])) {
      $data['props'] = array();
    }
    if($modified) {
      $data['User']['password'] = $hasher->hash($password);
    }
    else if(isset($data['User']['id'])) {
      $userProp->deleteAll(array('user_id' => $data['User']['id']));
      foreach($data['props'] as &$prop) {
        unset($prop['id']);
      }
    }

    //  We needs few modification to engage the "Network" user role.
    $network = $userProp->getProp($user['props'], UserProp::NETWORK_NAME);
    if (!is_null($network) && !$userProp->hasProp($data['props'], UserProp::NETWORK_REFERENCE)) {
      $userProp->setProp($data['props'], UserProp::NETWORK_REFERENCE, $network);
      $data['User']['expiry_date'] = date('Y-m-d', strtotime('+100 years'));
    }

    if (!isset($data['profile'])) {
      $data['profile'] = array('type' => 'private');
    }

    $saved = $this->saveAll($data, array('deep' => true));
    if ($saved) {
      $this->commit();
      return TRUE;
    }
    else {
      $this->rollback();
      return FALSE;
    }
  }

  public function changeStatus($request) {
    $user = $this->findById($request['id']);
    if (isset($user['User'])) {
      $user['User']['status'] = $request['status'];
      return $this->save($user);
    }
    return array();
  }

  public function emailOf($role) {
    $users = $this->find('all', array(
      'fields' => array('email'),
      'conditions' => array('role' => $role)
    ));
    $emails = array();
    foreach($users as $user) {
      if (!empty($user['User']['email'])) {
        $emails[] = $user['User']['email'];
      }
    }
    return $emails;
  }

  public function findByToken($token) {
    $user = parent::findByToken($token);
    if (isset($user['User'])) {
      return $user;
    }
    $userTokenRepo = ClassRegistry::init('UserToken');
    $userToken = $userTokenRepo->findByTokenAndIsExpired($token, 0);
    if(!isset($userToken['UserToken'])) {
      return null;
    }

    $user = parent::findById($userToken['UserToken']['user_id']);
    if (!isset($user['User'])) {
      return null;
    }

    if($user['User']['role'] == 'admin') {
      return $user;
    }

    $userProp = ClassRegistry::init('UserProp');
    $isNetwork = $userProp->hasProp($user['props'], UserProp::NETWORK_NAME);
    if ($isNetwork) {
      return $user;
    }

    return null;
  }
}
?>
