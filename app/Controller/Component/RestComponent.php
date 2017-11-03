<?php
App::uses('Component', 'Controller');

class RestComponent extends Component {

  public function startup(Controller $controller) {
    $controller->autoRender = false;
    $controller->layout = 'ajax';
    $controller->response->type('application/json');
    $controller->response->header('Access-Control-Allow-Origin', '*');
    $controller->response->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    $controller->response->header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
    if ($controller->request->is('OPTIONS')) {
      $controller->response->send();
      die;
    }
  }

  public function debug() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
  }

  public function mapErrors($validationErrors) {
    $errors = array();
    foreach(array_keys($validationErrors) as $field) {
      $errors[] = array(
        'field' => $field,
        'message' => isset($validationErrors[$field][0])
          ? $validationErrors[$field][0]
          : $validationErrors[$field]
      );
    }
    return $errors;
  }

  public function compact($resourceModel, $array) {
    if (!isset($array[$resourceModel])) {
      foreach($array as &$item) {
        $item = array_merge($item, $item[$resourceModel]);

        unset($item[$resourceModel]);
      }
    }
    else {
      $array = array_merge($array, $array[$resourceModel]);
      unset($array[$resourceModel]);
    }
    return $array;
  }

  public function ok($message = null, $data = array()) {
    if (is_array($message) && count($data) == 0) {
      $data = $message;
      $message = "";
    }
    return $this->json(array_merge(array(
      'valid' => true,
      'error' => false,
      'message' => $message
    ), $data));
  }

  public function notValid($errors = array()) {
    return $this->json(array(
      'error' => true,
      'valid' => false,
      'validationErrors' => isset($errors['field']) ? array($errors) : $errors
    ));
  }

  public function error($args = null) {
    if (is_array($args)) {
      $response = array_merge(array(
        'error' => true
      ), $args);
    }
    else {
      $response = array(
        'error' => true,
        'message' => $args
      );
    }
    return $this->json($response);
  }

  public function json($data) {
    // $data = $this->recursiveUTF8($data);
    return json_encode($data);
  }

  public function getClientIp() {
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if(isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
  }

  public function html($view = null) {
    $this->controller->autoRender = false;
    $this->controller->layout = NULL;
    $this->controller->response->type('text/html');
    $this->controller->render($view);
  }

  private function recursiveUTF8($data) {
    if (!is_array($data)) {
      return utf8_encode($data);
    }
    $result = array();
    foreach ($data as $index=>$item) {
      if (is_array($item)) {
        $result[$index] = array();
        foreach($item as $key=>$value) {
          $result[$index][$key] = $this->recursiveUTF8($value);
        }
      }
      else if (is_object($item)) {
        $result[$index] = array();
        foreach(get_object_vars($item) as $key=>$value) {
          $result[$index][$key] = $this->recursiveUTF8($value);
        }
      }
      else {
        $result[$index] = $this->recursiveUTF8($item);
      }
    }
    return $result;
  }
}

?>
