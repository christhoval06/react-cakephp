<?php
  class ShellTask extends AppModel {
    public $hasMany = array(
      'logs' => array(
        'className' => 'ShellTaskLog',
        'dependent' => true,
        'order' => 'logs.created'
      )
    );

    public function prepare($name) {
      $this->data = array(
        'ShellTask' => array(
          'name' => $name,
          'exit_status' => 'success',
          'start_at' => date('Y-m-d h:i:s'),
          'end_at' => null
        ),
        'logs' => array()
      );
    }

    public function setName($name) {
      $this->data['ShellTask']['name'] = $name;
    }

    public function refreshName($name) {
      $this->setName($name);
    }

    public function putInfoLog($message) {
      $this->putLog('INFO', $message);
    }

    public function putErrorLog($message) {
      $this->putLog('ERROR', $message);
    }

    public function putWarningLog($message) {
      $this->putLog('WARNING', $message);
    }

    public function putVerboseLog($message) {
      $this->putLog('VERBOSE', $message);
    }

    public function putLog($type, $message) {
      $this->data['logs'][] = array(
        'type' => $type,
        'message' => $message,
        'created' => date('Y-m-d h:i:s')
      );
    }

    public function finalize($status = "success") {
      $this->data['ShellTask']['end_at'] = date('Y-m-d h:i:s');
      $this->data['ShellTask']['status'] = $status;
      $this->saveAll($this->data, array('deep' => true));

    }
  }
?>
