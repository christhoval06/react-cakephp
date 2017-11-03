<?php
  App::uses('Component', 'Controller');
  class DataValidatorComponent extends Component {
    private $errors = array();

    public function reject($field, $errorMessage) {
      $this->errors[] = array('field' => $field, 'message' => $errorMessage);
    }

    public function getErrors() {
      return $this->errors;
    }

    public function hasErrors() {
      return count($this->errors) > 0;
    }
  }
?>
