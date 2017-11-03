<?php
  class Log extends AppModel {
    private $prefix = null;

    public $validate = array(
      'message' => array(
        'required' => array(
          'rule' => array('notBlank')
        )
      ),
      'type' => array(
        'inList' => array(
          'rule' => array('inList', array('info', 'warning', 'verbose', 'error'))
        )
      )
    );

    public function setPrefix($prefix) {
      $this->prefix = $prefix;
    }
    public function write($type, $message) {
      if (!is_null($this->prefix)) {
        $message = $this->prefix . ' - ' . $message;
      }
      $this->create();
      $this->save(array(
        'type' => $type,
        'message' => $message
      ));
      return $this->getInsertID();
    }

    public function info($message) {
      return $this->write('info', $message);
    }
    public function warning($message) {
      return $this->write('warning', $message);
    }
    public function verbose($message) {
      return $this->write('verbose', $message);
    }
    public function error($message) {
      return $this->write('error', $message);
    }
  }
?>
