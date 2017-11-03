<?php
  App::uses('Controller', 'Controller');
  App::uses('AppModel', 'Model');
  App::uses('UserProp', 'Model');

  class RestUserController extends Controller {
    public $components = array(
      'Rest',
      'Notification',
      'DataValidator',
      'Password'
    );

    public $uses = array(
      'User',
      'UserProp',
      'UserProfile',
      'ShellTask'
    );

    public function signup() {
      $this->Rest->debug();
      if (!$this->request->is('post')) {
        return $this->Rest->error(__("Not found."));
      }
      $request = $this->request->input('json_decode', true);
      $fields = array(
        'name',
        'surname',
        'email',
        'reason',
        'username',
        'password'
      );
      foreach($fields as $field) {
        if (!isset($request[$field]) || empty($request[$field])) {
          $this->DataValidator->reject($field, __("Required"));
        }
      }
      if ($this->DataValidator->hasErrors()) {
        return $this->Rest->notValid($this->DataValidator->getErrors());
      }

      $user = $this->User->findByUsername($request['username']);
      if (isset($user['User'])) {
        $this->DataValidator->reject('username', __("Username already in use"));
      }
      $user = $this->User->findByEmail($request['email']);
      if (isset($user['User'])) {
        $this->DataValidator->reject('email', __("Email already exists"));
      }
      if ($this->DataValidator->hasErrors()) {
        return $this->Rest->notValid($this->DataValidator->getErrors());
      }

      $hasher = new SimplePasswordHasher();
      $expiryDate = new DateTime(null);
      $expiryDate->add(new DateInterval("P14D"));
      $user['User'] = array_merge($request, array(
        'password' => $hasher->hash($request['password']),
        'status' => 'Pending',
        'role' => 'user',
        'token' => CakeText::uuid(),
        'expiry_date' => $expiryDate->format('Y-m-d')
      ));
      $user['props'] = array(
        array('name' => UserProp::PREFERED_LANG, 'value' => Configure::read('Config.language')),
        array('name' => UserProp::REFERAL_SOURCE, 'value' =>  $request['referal_source']),
        array('name' => UserProp::REFERAL_STATUS, 'value' => 'Pending')
      );
      $user['profile'] = array(
        'type' => 'private',
        'name' => $request['name'],
        'surname' => $request['surname']
      );
      if ($this->User->saveAll($user, array('deep' => true))) {
        $this->Notification->sendMultiple(array(
          array(
            'to' => $request['email'],
            'view' => 'user_registration',
            'subject' => __('Welcome in SafeGuard'),
            'vars' => $request
          ),
          /* Sent notification mail to admins. */
          array(
            'to' => $this->User->emailOf('admin'),
            'view' => 'user_registration_notify',
            'subject' => __('Signup'),
            'vars' => $request
          )
        ));
        return $this->Rest->ok(__('Thank you for your registration. Your subscription will be processed soon!'));
      }
      else {
        return $this->Rest->error(array(
          'message' => __("Error during registration."),
          'validationErrors' => $this->User->validationErrors
        ));
      }
    }

    public function contact() {
      $this->Rest->debug();
      if (!$this->request->is('post')) {
        return $this->Rest->error(__("Not found."));
      }
      $request = $this->request->input('json_decode', true);
      if (!isset($request['name']) || empty($request['name'])) {
        $this->DataValidator->reject('name', __("Required"));
      }
      if (!isset($request['surname']) || empty($request['surname'])) {
        $this->DataValidator->reject('surname', __("Required"));
      }
      if (!isset($request['email']) || empty($request['email'])) {
        $this->DataValidator->reject('email', __("Required"));
      }
      if (!isset($request['message']) || empty($request['message'])) {
        $this->DataValidator->reject('message', __("Required"));
      }
      if ($this->DataValidator->hasErrors()) {
        return $this->Rest->notValid($this->DataValidator->getErrors());
      }
      $this->Notification->send(array(
        'to' => $this->User->emailOf('admin'),
        'view' => 'user_contact',
        'subject' => __('New contact request'),
        'vars' => $request
      ));
      return $this->Rest->ok(__('Message sent! We will contact you soon as possible!'));
    }

    public function changeStatus() {
      $this->Rest->debug();
      if (!$this->request->is('post')) {
        return $this->Rest->error(__("Not found."));
      }
      $request = $this->request->input('json_decode', true);
      $handler = $this->User->findByToken($request['token']);
      if (!isset($handler['User'])) {
        return $this->Rest->error(__("Not allowed."));
      }
      $user = $this->User->changeStatus($request);

      if (isset($user['User'])) {
        $suffix = strtolower($request['status']);
        $subject = ($request['status'] == 'Active')
          ? __("Test Account Conferimed")
          : __('Account status changed to %s', $request['status']);

        $template = "user_registration_status_$suffix";
        $this->Notification->send(array(
          'to' => $user['User']['email'],
          'view' => $template,
          'subject' => $subject,
          'vars' => $user['User']
        ));
        return $this->Rest->ok($subject);
      }
      else {
        return $this->Rest->error(array(
          'message' => __("Error changing user status."),
          'validationErrors' => $this->User->validationErrors
        ));
      }
    }

    public function changePassword() {
      if (!$this->request->is('post')) {
        return $this->Rest->error(__("Not found."));
      }

      $request = $this->request->input('json_decode', true);
      $user = $this->User->findByToken($request['token']);
      if (!isset($user['User'])) {
        return $this->Rest->error(__("Token expired or not allowed."));
      }
      $validationErrors = array();
      if (!isset($request['old_password']) || empty($request['old_password'])) {
        $this->DataValidator->reject('old_password', __("Required"));
      }
      if (!isset($request['new_password']) || empty($request['new_password'])) {
        $this->DataValidator->reject('new_password', __("Required"));
      }
      if (!isset($request['confirm_password']) || empty($request['confirm_password'])) {
        $this->DataValidator->reject('confirm_password', __("Required"));
      }
      if ($this->DataValidator->hasErrors()) {
        return $this->Rest->notValid($this->DataValidator->getErrors());
      }

      if ($request['new_password'] != $request['confirm_password']) {
        $this->DataValidator->reject('confirm_password', __("Confirm password does not match the new password."));
        return $this->Rest->notValid($this->DataValidator->getErrors());
      }

      $hasher = new SimplePasswordHasher();
      $password = $hasher->hash($request['old_password']);
      if ($user['User']['password'] != $password) {
        $this->DataValidator->reject('old_password', __("Old password does not match."));
        return $this->Rest->notValid($this->DataValidator->getErrors());
      }
      if ($request['old_password'] == $request['new_password']) {
        $this->DataValidator->reject('new_password', __("New password cannt be equals to old."));
        return $this->Rest->notValid($this->DataValidator->getErrors());
      }

      $user['User']['password'] = $hasher->hash($request['new_password']);
      if ($this->User->save($user)) {
        return $this->Rest->ok(__("Password changed."));
      }
      else {
        return $this->Rest->error(__("Error changing password."));
      }
    }

    public function resetPassword() {
      $this->Rest->debug();
      if (!$this->request->is('post')) {
        return $this->Rest->error(__("Not found."));
      }
      $request = $this->request->input('json_decode', true);
      if (!isset($request['account']) || empty($request['account'])) {
        $this->DataValidator->reject('account', __('Required'));
        return $this->Rest->notValid($this->DataValidator->getErrors());
      }
      $account = $request['account'];
      $user = $this->User->find('first', array(
        'conditions' => array(
          'or' => array(
            'username' => $account,
            'email' => $account
          )
        )
      ));
      if (!isset($user['User'])) {
        $this->DataValidator->reject('account', __("Username or email not valid."));
        return $this->Rest->notValid($this->DataValidator->getErrors());
      }
      $password = $this->Password->generate();
      $hasher = new SimplePasswordHasher();
      $user['User']['password'] = $hasher->hash($password);
      $this->User->save($user);
      $this->Notification->send(array(
        'to' => $user['User']['email'],
        'view' => 'user_password_reset',
        'subject' => __('Password Reset'),
        'vars' => array(
          'name' => $user['profile']['name'],
          'surname' => $user['profile']['surname'],
          'username' => $user['User']['username'],
          'password' => $password
        )
      ));
      return $this->Rest->ok(__("Password changed, please check your email to view new associated password."));
    }

    public function getProfile() {
      $this->Rest->debug();
      if (!$this->request->is('post')) {
        return $this->Rest->error(__("Not found."));
      }

      $request = $this->request->input('json_decode', true);
      $user = $this->User->findByToken($request['token']);
      if (!isset($user['User'])) {
        return $this->Rest->error(__("Token expired or not allowed."));
      }
      $profile = null;
      if (!isset($user['profile']) || empty($user['profile']['type'])) {
        $profile = array(
          'type' => 'private',
          'city_id' => null,
          'province_id' => null,
          'birth_city_id' => null,
          'country_id' => null,
          'name' => '',
          'surname' => '',
          'fiscal_code' => '',
          'address' => '',
          'zip_code' => '',
          'vat_number' => ''
        );
      }
      else {
        $profile = $user['profile'];
      }
      return $this->Rest->ok(array('profile' => $profile));
    }

    public function updateProfile() {
      $this->Rest->debug();
      if (!$this->request->is('post')) {
        return $this->Rest->error(__("Not found."));
      }

      $request = $this->request->input('json_decode', true);
      $user = $this->User->findByToken($request['token']);
      if (!isset($user['User'])) {
        return $this->Rest->error(__("Token expired or not allowed."));
      }
      $type = $request['type'];
      $typeValidators = $this->UserProfile->getValidators($type);
      foreach($typeValidators as $validator) {
        if (!isset($request[$validator]) || empty($request[$validator])) {
          $this->DataValidator->reject($validator, __("Required"));
        }
        else {
          $user['profile'][$validator] = $request[$validator];
        }
      }

      if ($this->DataValidator->hasErrors()) {
        return $this->Rest->notValid($this->DataValidator->getErrors());
      }
      $user['profile']['type'] = $type;
      $user['profile']['user_id'] = $user['User']['id'];
      if ($this->User->saveAll($user, array('deep' => true))) {
        return $this->Rest->ok(__("Profile updated."));
      }
      else {
        return $this->Rest->error(array(
          'message' => __("Error updating profile."),
          'validationErrors' => $this->User->validationErrors));
      }
    }

    public function updateProp() {
      $this->Rest->debug();
      if (!$this->request->is('post')) {
        return $this->Rest->error(__("Not found."));
      }

      $request = $this->request->input('json_decode', true);
      $user = $this->User->findByToken($request['token']);
      if (!isset($user['User'])) {
        return $this->Rest->error(__("Token expired or not allowed."));
      }
      $name = $request['name'];
      $value = $request['value'];
      $this->UserProp->changeProp($user, $name, $value);
      return $this->Rest->ok(__("Property updated!"));
    }

    public function checkExpiringAccounts() {
      $this->ShellTask->prepare("Checking expiring users.");
      $users = $this->User->find('all', array(
        'conditions' => array(
          'status' => 'Active',
          'DATE(expiry_date)' => date('Y-m-d')
        )
      ));
      foreach($users as $user) {
        $username = $user['User']['username'];
        $this->ShellTask->putInfoLog("Sending email to $username.");
        $this->Notification->send(array(
          'to' => $user['User']['email'],
          'view' => "user_account_expiring",
          'subject' => __("Account expiring"),
          'vars' => $user['User']
        ));
      }
      $count = count($users);
      $message = "Email sent to $count expiring accounts.";
      $this->ShellTask->refreshName($message);
      $this->ShellTask->finalize();
      return $this->Rest->ok($message);
    }

    public function checkExpiredAccounts() {
      $condition = "=";
      $days = 3;
      $simulate = true;
      if (isset($this->request->query['c'])) {
        $condition = $this->request->query['c'];
        switch($condition) {
          case "equals":
          default:
            $condition = "=";
            break;
          case "lowerThen":
            $condition = "<";
            break;
          case "lowerOrEquals":
            $condition = "<=";
            break;
          case "greaterThen":
            $condition = ">";
            break;
          case "greaterOrEquals":
            $condition = ">=";
            break;
        }
      }
      if (isset($this->request->query['d'])) {
        $days = $this->request->query['d'];
      }
      if (isset($this->request->query['s'])) {
        $simulate = $this->request->query['s'] == "yes";
      }
      $this->ShellTask->prepare("Checking expired users.");
      $date = date('Y-m-d');
      $users = $this->User->find('all', array(
        'conditions' => array(
          'status' => 'Active',
          "DATEDIFF('$date', expiry_date) $condition $days"
        )
      ));
      foreach($users as $user) {
        $username = $user['User']['username'];
        $this->ShellTask->putInfoLog("Sending email to $username.");
        if (!$simulate && isset($user['User']['email'])) {
          $this->Notification->send(array(
            'to' => $user['User']['email'],
            'view' => 'user_account_expired',
            'subject' => __("Account expired"),
            'vars' => $user['User']
          ));
        }
      }
      $count = count($users);
      $message = "Account expireds since 3 days: $count";
      $this->ShellTask->refreshName($message);
      $report = $this->ShellTask->data;
      $this->ShellTask->finalize();
      return $this->Rest->ok(array(
        'message' => $message,
        'simulate' => $simulate,
        'report' => $report
      ));
    }
  }
?>
