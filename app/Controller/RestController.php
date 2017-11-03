<?php
App::uses('SimplePasswordHasher', 'Controller/Component/Auth');
App::uses('Controller', 'Controller');
App::uses('CakeText', 'Utility');

/**
* Controller responsible for all rest requests related to crud operation.
* Token authentication stack is handled too.
*/
class RestController extends Controller {

  public $components = array(
    'RequestHandler',
    'Rest',
    'FileUploader'
  );

  public $uses = array(
    'User',
    'UserIp',
    'UserProp',
    'UserToken',
    'UserProfile'
  );

  /**
   * Here you should map requested resource to local model instance.
   * @var array
   */
  public $map = array(
    'user' => 'User',
    'user-profile' => 'UserProfile',
    'user-lead' => 'UserLead',
    'country' => 'Country',

    'subscription-coupon' => 'SubscriptionCoupon',
    'subscription-payment' => 'SubscriptionPayment',
    'subscription-package' => 'SubscriptionPackage',

    'shell-task' => 'ShellTask',
    'app-setting' => 'AppSetting',
    'municipality' => 'Municipality',

    'deal-category' => 'DealCategory',
    'deal' => 'Deal'
  );

  public $roles = array(
    'user' => array('admin')
  );

  public function validateToken() {
    $this->Rest->debug();
    if (!$this->request->is('post')) {
      throw new NotFoundException();
    }

    $token = $this->request->data('token');
    if (!is_null($token)) {
      $user = $this->User->findByToken($token);
      if (isset($user['User'])) {
        $this->User->save($user);
        $count = $this->UserIp->find('count', array(
          'conditions' => array(
            'user_id' => $user['User']['id'],
            'ip' => ip2long($this->Rest->getClientIp())
          )
        ));
        if ($count == 0) {
          $this->UserIp->save(array(
            'user_id' => $user['User']['id'],
            'ip' => ip2long($this->Rest->getClientIp())
          ));
        }
        return $this->Rest->ok(array(
          "username" => $user['User']['username'],
          "token" => $token,
          "valid" => $this->UserProfile->isValid($user['profile']),
          "role" => $user['User']['role'],
          'network' => $this->UserProp->hasProp($user['props'], UserProp::NETWORK_NAME),
          'network_url_whitelist' => $this->UserProp->getProp($user['props'], UserProp::NETWORK_URL_WHITELIST),
          "reseller" => $this->UserProp->hasProp($user['props'], UserProp::REFERAL_CODE),
          'reseller_code' => $this->UserProp->getProp($user['props'], UserProp::REFERAL_CODE),
          "first_payment_commission" => $this->UserProp->getProp($user['props'], UserProp::REFERAL_FIRST_PAYMENT_COMMISSION),
          "next_payments_commission" => $this->UserProp->getProp($user['props'], UserProp::REFERAL_NEXT_PAYMENTS_COMMISSION)
        ));
      }
    }
    return $this->Rest->json(array(
      "error" => true,
      "message" => __("Token invalid or expired.")
    ));
  }

  public function logout() {
    if (!$this->request->is('post')) {
      throw new NotFoundException();
    }
    $request = $this->request->input('json_decode', true);
    if (!isset($request['token'])) {
      return $this->Rest->error(__("Invalid token."));
    }
    $token = $this->UserToken->findByToken($request['token']);
    if (!isset($token['UserToken'])) {
      return $this->Rest->error(__("Token session not found."));
    }
    $token['UserToken']['is_expired'] = true;
    $this->UserToken->save($token);
    return $this->Rest->ok(__("Signed out."));
  }

  public function authenticate() {
    if (!$this->request->is('post')) {
      throw new NotFoundException();
    }
    $hasher = new SimplePasswordHasher();
    $username = $this->request->data('username');
    $password = $this->request->data('password');
    $passhash = $hasher->hash($password);
    $user = $this->User->find('first', array(
      'conditions' => array(
        'username' => $username,
        'password' => $passhash
      )
    ));
    if (isset($user['User'])) {
      if ($user['User']['status'] == 'Active') {
        $user['User']['token'] = CakeText::uuid();
        $this->UserToken->save(array(
          'token' => $user['User']['token'],
          'user_id' => $user['User']['id'],
          'ip' => ip2long($this->Rest->getClientIp()),
          'user_agent' => env('HTTP_USER_AGENT')
        ));
        $this->User->save($user);
        $profile = $user['profile'];
        return $this->Rest->ok(__("Login success!"), array(
          'username' => $user['User']['username'],
          'token' => $user['User']['token'],
          'valid' => $this->UserProfile->isValid($profile),
          'role' => $user['User']['role'],
          'network' => $this->UserProp->hasProp($user['props'], UserProp::NETWORK_NAME),
          'network_url_whitelist' => $this->UserProp->getProp($user['props'], UserProp::NETWORK_URL_WHITELIST),
          "reseller" => $this->UserProp->hasProp($user['props'], UserProp::REFERAL_CODE),
          'reseller_code' => $this->UserProp->getProp($user['props'], UserProp::REFERAL_CODE),
          "first_payment_commission" => $this->UserProp->getProp($user['props'], UserProp::REFERAL_FIRST_PAYMENT_COMMISSION),
          "next_payments_commission" => $this->UserProp->getProp($user['props'], UserProp::REFERAL_NEXT_PAYMENTS_COMMISSION)
        ));
      }
      else {
        return $this->Rest->error(__("Your account is waiting activation."));
      }
    }
    else {
      return $this->Rest->error(__("Invalid username or password"));
    }
  }

  public function getList($resource) {
    $this->Rest->debug();

    if (!$this->request->is('post')) {
      throw new NotFoundException();
    }

    $resourceModel = $this->map[$resource];
    if (!$this->loadModel($resourceModel)) {
      return $this->json(array(
        'error' => true,
        'message' => "Resource $resource not found."
      ));
    }

    $request = $this->request->input('json_decode');
    $user = $this->User->findByToken($request->token);
    if (method_exists($this->{$resourceModel}, "canList")) {
      $canList = $this->{$resourceModel}->canList($user);
      if (!$canList) {
        return $this->Rest->json(array(
          'error' => true,
          'message' => "Not allowed."
        ));
      }
    }
    $page = isset($request->page) ? $request->page : 1;
    $limit = isset($request->limit) ? $request->limit : 10;
    $offset = ($page - 1) * $limit;
    $options = array(
      'fields' => array(),
      'joins' => array(),
      'conditions' => array(),
      'order' => array(),
      'limit' => isset($request->limit) ? $request->limit : 10,
      'offset' => $offset,
      'page' => isset($request->page) ? $request->page : 1
    );

    if (isset($request->sort) && isset($request->sort->column)) {
      $requestSort = $request->sort;
      if (isset($requestSort->descending) && $requestSort->descending) {
        $options['order'] = $requestSort->column . ' DESC';
      }
      else {
        $options['order'] = $requestSort->column;
      }
    }

    if (isset($request->filters) && count($request->filters) > 0) {
      foreach($request->filters as $filter) {
        if (isset($filter->clause)) {
          $value = $filter->value;
          $field = $filter->name;
          if ($filter->clause == "like") {
            $field = $field . " like";
            $value = "%$value%";
          }
          else if ($filter->clause == "sw") {
            $field = $field . " like";
            $value = "$value%";
          }
          else if ($filter->clause == "ew") {
            $field = $field . " like";
            $value = "%$value";
          }
          else if ($filter->clause == "gt") {
            $field = $field . " >= ";
            $value = $value;
          }
          else if ($filter->clause == "lt") {
            $field = $field . " <= ";
            $value = $value;
          }
          $options['conditions'][] = array($field => $value);
        }
        else {
          $options['conditions'][] = array($filter->name => $filter->value);
        }
      }
    }

    if (method_exists($this->{$resourceModel}, 'getList')) {
      $data = $this->{$resourceModel}->getList($options, $user);
    }
    else {
      $data = $this->{$resourceModel}->find('all', $options);
    }
    $data = $this->Rest->compact($resourceModel, $data);
    $response = array(
      /*'conditions' => $options['conditions'],
      'joins' => $options['joins'],
      'request' => $request,*/
      'rows' => $data,
      'count' => $this->{$resourceModel}->find('count', array(
        'conditions' => $options['conditions'],
        'joins' => $options['joins']
      ))
    );
    return $this->Rest->json($response);
  }

  public function getItem($resource, $id, $token) {
    $this->Rest->debug();
    if (!$this->request->is('post')) {
      throw new NotFoundException();
    }
    $resourceModel = $this->map[$resource];
    $this->loadModel($resourceModel);

    if (method_exists($this->{$resourceModel}, "getItem")) {
      $item = $this->{$resourceModel}->getItem($id);
    }
    else {
      $item = $this->{$resourceModel}->findById($id);
    }

    if (method_exists($this->{$resourceModel}, "canGet")) {
      $user = $this->User->findByToken($token);
      $canGet = $this->{$resourceModel}->canGet($item, $user);
      if (!$canGet) {
        return $this->Rest->json(array(
          'error' => true,
          'message' => "Not allowed."
        ));
      }
    }
    return $this->Rest->json(array(
      'error' => false,
      'item' => $this->Rest->compact($resourceModel, $item)
    ));
  }

  public function saveItem($resource) {
    $this->Rest->debug();
    if(!$this->request->is('post')) {
      throw new NotFoundException();
    }
    $request = $this->request->input('json_decode');
    $resourceModel = $this->map[$resource];
    if(!$this->loadModel($resourceModel)) {
      return $this->Rest->json(array(
        'error' => true,
        'message' => "Resource '$resource' not found"
      ));
    }
    $json = json_decode($request->item, true);
    $data = array($resourceModel => array());
    foreach(array_keys($json) as $field) {
      if (isset($this->{$resourceModel}->hasMany[$field])) {
        $data[$field] = $json[$field];
      }
      else {
        $data[$resourceModel][$field] = $json[$field];
      }
    }
    foreach(array_keys($this->{$resourceModel}->validate) as $field) {
      if (isset($this->{$resourceModel}->hasMany[$field])) {
        if (!isset($data[$field])) {
          $data[$field] = array();
        }
      }
      else if (!isset($data[$resourceModel][$field])) {
        $data[$resourceModel][$field] = '';
      }
    }

    $saved = false;
    $user = $this->User->findByToken($request->token);
    if (method_exists($this->{$resourceModel}, "canSave")) {
      $canSave = $this->{$resourceModel}->canSave($data, $user);
      if (!$canSave) {
        return $this->Rest->json(array(
          'error' => true,
          'message' => "Not allowed."
        ));
      }
    }

    if (method_exists($this->{$resourceModel}, "saveItem")) {
      $saved = $this->{$resourceModel}->saveItem($data, $user);
    }
    else {
      $saved = $this->{$resourceModel}->save($data);
    }
    if (!isset($data[$resourceModel]['id'])) {
      $data[$resourceModel]['id'] = $this->{$resourceModel}->getInsertID();
    }

    if ($saved) {
      return $this->Rest->json(array(
        'error' => false,
        'valid' => true,
        'data' => $this->Rest->compact($resourceModel, $data)
      ));
    }
    else {
      return $this->Rest->json(array(
        'error' => false,
        'valid' => false,
        'errors' => $this->Rest->mapErrors($this->{$resourceModel}->validationErrors),
        'data' => $this->Rest->compact($resourceModel, $data)
      ));
    }
  }

  public function deleteItem($resource, $id, $token) {
    if(!$this->request->is('post')) {
      throw new NotFoundException();
    }

    $resourceModel = $this->map[$resource];
    if(!$this->loadModel($resourceModel)) {
      throw new NotFoundException();
    }

    $this->{$resourceModel}->delete($id, true);
    return $this->Rest->ok();
  }


  public function uploadFile($folder) {
    $folder = str_replace('.', '/', $folder);
    $response = $this->FileUploader->upload($folder);
		return $this->Rest->ok($response);
	}

}
?>
