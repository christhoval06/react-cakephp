<?php
  App::uses('Component', 'Controller');
  App::uses('CakeEmail', 'Network/Email');

  class NotificationComponent extends Component {
    public $template = "default";
    public $config = "aws";

    public function sendMultiple($args) {
      foreach($args as $mail) {
        $this->send($mail);
      }
    }
    
    public function send($args) {
      $args = array_merge(array(
        'from' => array('noreply@safeguard.network' => 'SafeGuard')
      ), $args);
      $language = Configure::read('Config.language');
      $email = new CakeEmail($this->config);
      $email->template($language . DS . $args['view'], $this->template);
      $email->viewVars(array_merge($args['vars'], array(
        'baseUrl' => Router::url("/", true)
      )));
      $email->emailFormat("html");
      $email->from($args['from']);
      $email->subject("[SafeGuard] - ".$args['subject']);
      $email->to($args['to']);
      $email->send();
    }
  }
?>
